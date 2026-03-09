/**
 * OB -- Onboarding -- Narration Module
 * ======================================
 * Page-level text-to-speech with:
 *   - Fixed control bar (always visible when enabled) with voice/speed selectors
 *   - Click anywhere in text to start narration from that word
 *   - Word-level highlighting overlay with auto-scroll
 *   - Sentence chunking (Chrome 15s workaround)
 *   - onboundary events with timer fallback
 *
 * Adapted from WCAI speech.js.
 * Attached to window.OB.speech.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  /* ── Constants ────────────────────────────────────────────── */
  var RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  var STORAGE_VOICE = "ob_narr_voice";
  var STORAGE_RATE = "ob_narr_rate";
  var STORAGE_COLLAPSED = "ob_narr_collapsed";
  var DEFAULT_CPM = 0.015; // chars per millisecond at 1x
  var TIMER_INTERVAL = 50;

  /* ── State ────────────────────────────────────────────────── */
  var synth = window.speechSynthesis || null;
  var voices = [];
  var selectedVoice = null;
  var rate = 1.0;

  // Playback state
  var playState = "stopped"; // "stopped" | "playing" | "paused"
  var narrationId = 0;       // generation counter to ignore stale callbacks
  var chunks = [];
  var currentChunk = 0;

  // Text map: array of { node: TextNode, start: int, end: int }
  var textMap = [];
  var fullText = "";
  var narrationRoot = null;

  // Highlight
  var overlay = null;
  var boundaryFired = false;

  // Timer fallback
  var timerInterval = null;
  var wordSchedule = [];
  var playStart = 0;
  var pausedDuration = 0;
  var pauseStartTime = 0;
  var lastTimerWord = -1;
  var calibratedCPM = DEFAULT_CPM;

  // UI
  var clickHandler = null;
  var collapsed = true; // default: off

  /* ── Helpers ──────────────────────────────────────────────── */
  function isSupported() { return !!synth; }

  function isBlockEl(el) {
    if (!el || el.nodeType !== 1) return false;
    var d = window.getComputedStyle(el).display;
    return d === "block" || d === "flex" || d === "grid" || d === "list-item" || d === "table";
  }

  function getBlockAncestor(node, root) {
    var el = node.parentElement;
    while (el && el !== root) {
      if (isBlockEl(el)) return el;
      el = el.parentElement;
    }
    return root;
  }

  /* ── Voice Management ─────────────────────────────────────── */
  function loadVoices() {
    if (!synth) return;
    var v = synth.getVoices();
    if (!v.length) return;
    voices = v;

    var saved = localStorage.getItem(STORAGE_VOICE);
    if (saved) {
      selectedVoice = null;
      for (var i = 0; i < voices.length; i++) {
        if (voices[i].name === saved) { selectedVoice = voices[i]; break; }
      }
    }
    if (!selectedVoice) pickDefaultVoice();
    populateVoiceSelect();
  }

  function pickDefaultVoice() {
    var english = [], localEn = [];
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang && voices[i].lang.indexOf("en") === 0) {
        english.push(voices[i]);
        if (voices[i].localService) localEn.push(voices[i]);
      }
    }
    selectedVoice = (localEn[0] || english[0] || voices[0]) || null;
  }

  function populateVoiceSelect() {
    var sel = document.getElementById("narr-voice-select");
    if (!sel) return;
    sel.innerHTML = "";
    for (var i = 0; i < voices.length; i++) {
      var o = document.createElement("option");
      o.value = voices[i].name;
      var lang = voices[i].lang || "";
      o.textContent = voices[i].name + (lang ? " (" + lang + ")" : "");
      if (selectedVoice && voices[i].name === selectedVoice.name) o.selected = true;
      sel.appendChild(o);
    }
  }

  function populateRateSelect() {
    var sel = document.getElementById("narr-rate-select");
    if (!sel) return;
    sel.innerHTML = "";
    for (var i = 0; i < RATES.length; i++) {
      var o = document.createElement("option");
      o.value = RATES[i];
      o.textContent = RATES[i] + "x";
      if (RATES[i] === rate) o.selected = true;
      sel.appendChild(o);
    }
  }

  /* ── Text Map ─────────────────────────────────────────────── */
  function buildTextMap(root) {
    var map = [];
    var offset = 0;
    var lastBlock = null;

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentElement;
        while (p && p !== root) {
          var tag = p.tagName;
          if (tag === "BUTTON" || tag === "SVG" || tag === "SCRIPT" || tag === "STYLE" ||
              p.classList.contains("narr-bar") || p.classList.contains("narr-toggle-btn")) {
            return NodeFilter.FILTER_REJECT;
          }
          p = p.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var node;
    while ((node = walker.nextNode())) {
      var len = (node.textContent || "").length;
      if (len === 0) continue;

      var block = getBlockAncestor(node, root);
      if (lastBlock && block !== lastBlock && offset > 0) {
        offset += 1; // virtual space
      }
      lastBlock = block;

      map.push({ node: node, start: offset, end: offset + len });
      offset += len;
    }

    return map;
  }

  function buildFullText(map) {
    var result = "";
    for (var i = 0; i < map.length; i++) {
      if (i > 0 && map[i].start > map[i - 1].end) {
        result += " ";
      }
      result += map[i].node.textContent || "";
    }
    return result;
  }

  function findNodeForChar(charIdx) {
    var lo = 0, hi = textMap.length - 1;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (charIdx < textMap[mid].start) hi = mid - 1;
      else if (charIdx >= textMap[mid].end) lo = mid + 1;
      else return textMap[mid];
    }
    return null;
  }

  /* ── Sentence Chunking ────────────────────────────────────── */
  function splitIntoChunks(text, startOffset) {
    startOffset = startOffset || 0;
    var result = [];
    var start = 0;

    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if ((ch === "." || ch === "!" || ch === "?") &&
          (i + 1 >= text.length || /\s/.test(text[i + 1]))) {
        var end = i + 1;
        while (end < text.length && /\s/.test(text[end])) end++;
        var chunk = text.slice(start, end);
        if (chunk.trim()) {
          result.push({ text: chunk, startChar: startOffset + start });
        }
        start = end;
      }
    }
    // Remainder
    if (start < text.length) {
      var rem = text.slice(start);
      if (rem.trim()) {
        result.push({ text: rem, startChar: startOffset + start });
      }
    }

    // Merge short chunks (< 20 chars) with previous
    var merged = [];
    for (var j = 0; j < result.length; j++) {
      if (merged.length > 0 && result[j].text.trim().length < 20) {
        merged[merged.length - 1].text += result[j].text;
      } else {
        merged.push({ text: result[j].text, startChar: result[j].startChar });
      }
    }
    return merged.length > 0 ? merged : [{ text: text, startChar: startOffset }];
  }

  /* ── Word Schedule (timer fallback) ───────────────────────── */
  function computeWordSchedule(chunkText, chunkStartChar) {
    var schedule = [];
    var re = /\S+/g;
    var m;
    while ((m = re.exec(chunkText)) !== null) {
      var time = m.index / (calibratedCPM * rate);
      schedule.push({
        charIndex: chunkStartChar + m.index,
        charLength: m[0].length,
        time: time
      });
    }
    return schedule;
  }

  /* ── Highlight Overlay ────────────────────────────────────── */
  function ensureOverlay() {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "narr-word-overlay";
    }
    if (narrationRoot && overlay.parentElement !== narrationRoot) {
      if (narrationRoot.style.position === "" || narrationRoot.style.position === "static") {
        narrationRoot.style.position = "relative";
      }
      narrationRoot.appendChild(overlay);
    }
    return overlay;
  }

  function highlightWord(charIndex, charLength) {
    var entry = findNodeForChar(charIndex);
    if (!entry) return;

    var localOffset = charIndex - entry.start;
    var nodeText = entry.node.textContent || "";
    var wordEnd = localOffset + (charLength || 0);

    if (!charLength || charLength <= 0) {
      wordEnd = localOffset;
      while (wordEnd < nodeText.length && !/\s/.test(nodeText[wordEnd])) wordEnd++;
    }
    if (wordEnd > nodeText.length) wordEnd = nodeText.length;
    if (localOffset >= nodeText.length) return;

    try {
      var range = document.createRange();
      range.setStart(entry.node, localOffset);
      range.setEnd(entry.node, wordEnd);

      var rangeRect = range.getBoundingClientRect();
      if (rangeRect.width === 0 && rangeRect.height === 0) return;

      var rootRect = narrationRoot.getBoundingClientRect();
      var ov = ensureOverlay();

      ov.style.top = (rangeRect.top - rootRect.top + narrationRoot.scrollTop) + "px";
      ov.style.left = (rangeRect.left - rootRect.left + narrationRoot.scrollLeft) + "px";
      ov.style.width = rangeRect.width + "px";
      ov.style.height = rangeRect.height + "px";
      ov.style.display = "block";

      // Auto-scroll to keep highlighted word visible
      var mainEl = document.getElementById("main");
      if (mainEl) {
        var mainRect = mainEl.getBoundingClientRect();
        if (rangeRect.top < mainRect.top + 40 || rangeRect.bottom > mainRect.bottom - 60) {
          entry.node.parentElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    } catch (e) {
      // Range errors can happen with edge-case DOM nodes
    }
  }

  function hideOverlay() {
    if (overlay) overlay.style.display = "none";
  }

  /* ── Timer Fallback ───────────────────────────────────────── */
  function startChunkTimer() {
    stopTimer();
    playStart = Date.now();
    pausedDuration = 0;
    lastTimerWord = -1;

    timerInterval = setInterval(function () {
      if (boundaryFired) { stopTimer(); return; }
      if (playState !== "playing") return;

      var elapsed = Date.now() - playStart - pausedDuration;
      var idx = -1;
      for (var i = wordSchedule.length - 1; i >= 0; i--) {
        if (wordSchedule[i].time <= elapsed) { idx = i; break; }
      }
      if (idx >= 0 && idx !== lastTimerWord) {
        lastTimerWord = idx;
        highlightWord(wordSchedule[idx].charIndex, wordSchedule[idx].charLength);
      }
    }, TIMER_INTERVAL);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  /* ── Core Playback ────────────────────────────────────────── */
  function startNarration(root, fromCharIndex) {
    if (!isSupported()) return;
    stopNarration();

    narrationRoot = root;
    textMap = buildTextMap(root);
    fullText = buildFullText(textMap);

    if (!fullText.trim()) return;

    fromCharIndex = fromCharIndex || 0;
    var textToSpeak = fullText.substring(fromCharIndex);
    if (!textToSpeak.trim()) return;

    chunks = splitIntoChunks(textToSpeak, fromCharIndex);
    currentChunk = 0;
    narrationId++;
    boundaryFired = false;
    calibratedCPM = DEFAULT_CPM;

    playState = "playing";
    updatePlayBtn();
    speakNextChunk();
  }

  function speakNextChunk() {
    if (collapsed || playState === "stopped" || currentChunk >= chunks.length) {
      onDone();
      return;
    }

    var myId = narrationId;
    var chunk = chunks[currentChunk];
    var chunkStart = Date.now();

    wordSchedule = computeWordSchedule(chunk.text, chunk.startChar);

    var utt = new SpeechSynthesisUtterance(chunk.text);
    utt.rate = rate;
    utt.pitch = 1.0;
    if (selectedVoice) utt.voice = selectedVoice;

    utt.onboundary = function (e) {
      if (myId !== narrationId) return;
      if (e.name === "word") {
        if (!boundaryFired) {
          boundaryFired = true;
          stopTimer();
        }
        highlightWord(chunk.startChar + e.charIndex, e.charLength || 0);
      }
    };

    utt.onend = function () {
      if (myId !== narrationId || collapsed) return;
      stopTimer();

      // Calibrate: measure actual duration
      var elapsed = Date.now() - chunkStart - pausedDuration;
      if (elapsed > 100 && chunk.text.length > 5) {
        calibratedCPM = chunk.text.length / elapsed;
      }

      currentChunk++;
      if (currentChunk < chunks.length) {
        speakNextChunk();
      } else {
        onDone();
      }
    };

    utt.onerror = function () {
      if (myId !== narrationId) return;
      onDone();
    };

    // Start timer fallback (in case onboundary doesn't fire)
    if (!boundaryFired) startChunkTimer();

    synth.speak(utt);
  }

  function stopNarration() {
    narrationId++;
    playState = "stopped";
    stopTimer();
    hideOverlay();
    if (synth) {
      synth.cancel();
      synth.cancel();
    }
    chunks = [];
    currentChunk = 0;
    textMap = [];
    fullText = "";
    narrationRoot = null;
    updatePlayBtn();
  }

  function onDone() {
    stopTimer();
    hideOverlay();
    playState = "stopped";
    chunks = [];
    currentChunk = 0;
    updatePlayBtn();
  }

  /* ── Public Playback Controls ─────────────────────────────── */
  function readPage() {
    if (collapsed) return;
    var main = document.getElementById("main");
    if (!main) return;
    startNarration(main, 0);
  }

  function pause() {
    if (playState !== "playing") return;
    synth.pause();
    playState = "paused";
    pauseStartTime = Date.now();
    updatePlayBtn();
  }

  function resume() {
    if (playState !== "paused") return;
    synth.resume();
    playState = "playing";
    pausedDuration += Date.now() - pauseStartTime;
    updatePlayBtn();
  }

  function togglePlayPause() {
    if (playState === "stopped") { readPage(); return; }
    if (playState === "paused") resume();
    else pause();
  }

  function stop() {
    stopNarration();
  }

  /* ── UI Updates ────────────────────────────────────────────── */
  function updatePlayBtn() {
    var btn = document.getElementById("narr-play-btn");
    if (!btn) return;
    if (playState === "playing") {
      btn.innerHTML = "&#9646;&#9646;";
      btn.title = "Pause";
    } else {
      btn.innerHTML = "&#9654;";
      btn.title = "Play";
    }
  }

  function updateBar() {
    var bar = document.getElementById("narr-bar");
    if (!bar) return;
    if (collapsed) {
      bar.classList.remove("open");
    } else {
      bar.classList.add("open");
    }
  }

  function updateToggleBtn() {
    var btn = document.getElementById("narr-toggle-btn");
    if (!btn) return;
    if (collapsed) {
      btn.classList.remove("active");
      btn.title = "Enable narration";
    } else {
      btn.classList.add("active");
      btn.title = "Disable narration";
    }
  }

  /* ── Click-to-Jump ────────────────────────────────────────── */
  function setupClickHandler() {
    removeClickHandler();
    var main = document.getElementById("main");
    if (!main || !isSupported() || collapsed) return;

    clickHandler = function (e) {
      if (collapsed) return;
      // Don't intercept clicks on interactive elements
      var tag = e.target.tagName;
      if (tag === "BUTTON" || tag === "A" || tag === "INPUT" || tag === "SELECT" ||
          tag === "TEXTAREA" || tag === "LABEL" || tag === "OPTION") return;
      if (e.target.closest("button, a, input, select, textarea, label, .sb-actions, .narr-bar")) return;

      // Hide highlight overlay before position detection — it can
      // sit on top of text and cause caretRangeFromPoint to miss
      hideOverlay();

      // Find the clicked text position
      var range = null;
      if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
      } else if (document.caretPositionFromPoint) {
        var pos = document.caretPositionFromPoint(e.clientX, e.clientY);
        if (pos && pos.offsetNode) {
          range = document.createRange();
          range.setStart(pos.offsetNode, pos.offset);
        }
      }

      if (!range || range.startContainer.nodeType !== 3) return;

      // Build text map for the main area
      var tempMap = buildTextMap(main);
      var clickedNode = range.startContainer;
      var clickedOffset = range.startOffset;

      // Find this node in the map
      var entry = null;
      for (var i = 0; i < tempMap.length; i++) {
        if (tempMap[i].node === clickedNode) { entry = tempMap[i]; break; }
      }
      if (!entry) return;

      // Calculate position in full text
      var charPos = entry.start + clickedOffset;

      // Snap to start of word
      var tempFullText = buildFullText(tempMap);
      while (charPos > 0 && !/\s/.test(tempFullText[charPos - 1])) charPos--;

      // If narration is already active, cancel first and give the
      // browser a moment before issuing a new speak() call — Chrome
      // silently drops speak() issued immediately after cancel().
      if (playState !== "stopped") {
        stopNarration();
        setTimeout(function () {
          if (!collapsed) startNarration(main, charPos);
        }, 60);
      } else {
        startNarration(main, charPos);
      }
    };

    main.addEventListener("click", clickHandler);
    main.style.cursor = "text";
  }

  function removeClickHandler() {
    var main = document.getElementById("main");
    if (main && clickHandler) {
      main.removeEventListener("click", clickHandler);
      main.style.cursor = "";
    }
    clickHandler = null;
  }

  /* ── Settings ─────────────────────────────────────────────── */
  function setVoice(name) {
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].name === name) {
        selectedVoice = voices[i];
        localStorage.setItem(STORAGE_VOICE, name);
        break;
      }
    }
  }

  function setRate(val) {
    rate = parseFloat(val) || 1.0;
    localStorage.setItem(STORAGE_RATE, String(rate));
  }

  /* ── Toggle ───────────────────────────────────────────────── */
  function toggleCollapse() {
    collapsed = !collapsed;
    localStorage.setItem(STORAGE_COLLAPSED, collapsed ? "1" : "0");

    if (collapsed) {
      stopNarration();
      removeClickHandler();
    } else {
      setupClickHandler();
    }

    updateToggleBtn();
    updateBar();
  }

  /* ── Init ──────────────────────────────────────────────────── */
  function init() {
    if (!isSupported()) return;

    var savedRate = parseFloat(localStorage.getItem(STORAGE_RATE));
    if (savedRate && !isNaN(savedRate)) rate = savedRate;

    // Restore collapsed state (default: collapsed/off)
    var saved = localStorage.getItem(STORAGE_COLLAPSED);
    collapsed = saved === null ? true : saved === "1";

    loadVoices();
    if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;

    populateRateSelect();
    updateToggleBtn();
    updateBar();

    // Wire up bar controls
    var toggleBtn = document.getElementById("narr-toggle-btn");
    if (toggleBtn) toggleBtn.addEventListener("click", toggleCollapse);

    var playBtn = document.getElementById("narr-play-btn");
    if (playBtn) playBtn.addEventListener("click", togglePlayPause);

    var stopBtn = document.getElementById("narr-stop-btn");
    if (stopBtn) stopBtn.addEventListener("click", stop);

    var voiceSel = document.getElementById("narr-voice-select");
    if (voiceSel) voiceSel.addEventListener("change", function () { setVoice(voiceSel.value); });

    var rateSel = document.getElementById("narr-rate-select");
    if (rateSel) rateSel.addEventListener("change", function () { setRate(rateSel.value); });

    if (!collapsed) setupClickHandler();
  }

  /* ── Public API ───────────────────────────────────────────── */
  OB.speech = {
    init: init,
    isSupported: isSupported,
    readPage: readPage,
    pause: pause,
    resume: resume,
    stop: stop,
    togglePlayPause: togglePlayPause,
    toggleCollapse: toggleCollapse,
    setupClickHandler: setupClickHandler,
    removeClickHandler: removeClickHandler,
    setVoice: setVoice,
    setRate: setRate
  };
})();
