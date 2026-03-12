/**
 * OB -- Onboarding -- Content Search (Enhanced)
 * ===============================================
 * Phase 1: Cross-course search from catalog view
 * Phase 2: Token-based scoring with Porter stemmer + synonym expansion
 * Phase 3: Tag support (infrastructure ready, content tags optional)
 *
 * Builds a search index from topics, glossary, and quizzes.
 * In catalog mode, builds a global index across all courses.
 * Provides fuzzy, tokenized search with relevance scoring.
 * Renders grouped results in the sidebar.
 * Attached to window.OB.search.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  // ── Constants ──────────────────────────────────────────────────

  var DEBOUNCE_MS = 150;
  var SNIPPET_RADIUS = 60;
  var MAX_RESULTS = 20;

  // Scoring weights
  var W_TITLE    = 10;
  var W_HEADING  = 5;
  var W_TAKEAWAY = 3;
  var W_BODY     = 1;
  var W_EXACT    = 3;   // bonus multiplier for exact full-query substring match
  var W_TOKEN    = 1;   // per-token stem match

  // ── State ──────────────────────────────────────────────────────

  var courseIndex   = null;  // per-course index
  var globalIndex   = null;  // cross-course index (catalog mode)
  var building      = false;
  var debounceTimer = null;
  var isGlobalMode  = false;
  var isCatalogPage = false; // true when on catalog view (no ?course=)
  var synonymLookup = null;  // stem → [related stems]
  var SESSION_KEY   = "ob_globalSearch";

  // ── Porter Stemmer ─────────────────────────────────────────────

  var stemCache = {};

  function stem(word) {
    if (word.length < 3) return word;
    if (stemCache[word]) return stemCache[word];
    var w = word;

    function vow(c) { return "aeiou".indexOf(c) !== -1; }
    function con(s, i) { return !vow(s[i]); }
    function measure(s) {
      var n = 0, i = 0, len = s.length;
      while (i < len && con(s, i)) i++;
      while (i < len) {
        while (i < len && !con(s, i)) i++;
        if (i >= len) break;
        while (i < len && con(s, i)) i++;
        n++;
      }
      return n;
    }
    function hasVowel(s) {
      for (var i = 0; i < s.length; i++) if (vow(s[i])) return true;
      return false;
    }
    function ew(s, sfx) {
      return s.length >= sfx.length && s.slice(-sfx.length) === sfx;
    }
    function dbl(s) {
      return s.length >= 2 && s[s.length - 1] === s[s.length - 2] && con(s, s.length - 1);
    }
    function cvc(s) {
      var l = s.length;
      return l >= 3 && con(s, l - 1) && !con(s, l - 2) && con(s, l - 3) &&
        "wxy".indexOf(s[l - 1]) === -1;
    }

    // Step 1a
    if (ew(w, "sses")) w = w.slice(0, -2);
    else if (ew(w, "ies")) w = w.slice(0, -2);
    else if (!ew(w, "ss") && ew(w, "s")) w = w.slice(0, -1);

    // Step 1b
    var s1b = false;
    if (ew(w, "eed")) {
      if (measure(w.slice(0, -3)) > 0) w = w.slice(0, -1);
    } else if (ew(w, "ed") && hasVowel(w.slice(0, -2))) {
      w = w.slice(0, -2); s1b = true;
    } else if (ew(w, "ing") && hasVowel(w.slice(0, -3))) {
      w = w.slice(0, -3); s1b = true;
    }
    if (s1b) {
      if (ew(w, "at") || ew(w, "bl") || ew(w, "iz")) w += "e";
      else if (dbl(w) && "lsz".indexOf(w[w.length - 1]) === -1) w = w.slice(0, -1);
      else if (measure(w) === 1 && cvc(w)) w += "e";
    }

    // Step 1c
    if (ew(w, "y") && hasVowel(w.slice(0, -1))) w = w.slice(0, -1) + "i";

    // Step 2
    var s2 = {
      ational: "ate", tional: "tion", enci: "ence", anci: "ance", izer: "ize",
      abli: "able", alli: "al", entli: "ent", eli: "e", ousli: "ous",
      ization: "ize", ation: "ate", ator: "ate", alism: "al", iveness: "ive",
      fulness: "ful", ousness: "ous", aliti: "al", iviti: "ive", biliti: "ble"
    };
    for (var k2 in s2) {
      if (ew(w, k2)) {
        var b2 = w.slice(0, -k2.length);
        if (measure(b2) > 0) w = b2 + s2[k2];
        break;
      }
    }

    // Step 3
    var s3 = { icate: "ic", ative: "", alize: "al", iciti: "ic", ical: "ic", ful: "", ness: "" };
    for (var k3 in s3) {
      if (ew(w, k3)) {
        var b3 = w.slice(0, -k3.length);
        if (measure(b3) > 0) w = b3 + s3[k3];
        break;
      }
    }

    // Step 4
    var s4 = ["al", "ance", "ence", "er", "ic", "able", "ible", "ant", "ement",
              "ment", "ent", "ion", "ou", "ism", "ate", "iti", "ous", "ive", "ize"];
    for (var i4 = 0; i4 < s4.length; i4++) {
      if (ew(w, s4[i4])) {
        var b4 = w.slice(0, -s4[i4].length);
        if (measure(b4) > 1) {
          if (s4[i4] === "ion") {
            if (b4.length > 0 && "st".indexOf(b4[b4.length - 1]) !== -1) w = b4;
          } else { w = b4; }
        }
        break;
      }
    }

    // Step 5a
    if (ew(w, "e")) {
      var b5 = w.slice(0, -1);
      if (measure(b5) > 1 || (measure(b5) === 1 && !cvc(b5))) w = b5;
    }

    // Step 5b
    if (measure(w) > 1 && dbl(w) && w[w.length - 1] === "l") w = w.slice(0, -1);

    stemCache[word] = w;
    return w;
  }

  // ── Tokenization ───────────────────────────────────────────────

  function tokenize(text) {
    return text.toLowerCase().split(/[^a-z0-9]+/).filter(function (w) { return w.length > 1; });
  }

  function stemTokens(tokens) {
    var seen = {};
    var result = [];
    for (var i = 0; i < tokens.length; i++) {
      var s = stem(tokens[i]);
      if (!seen[s]) { seen[s] = true; result.push(s); }
    }
    return result;
  }

  // ── Synonym expansion ─────────────────────────────────────────

  function loadSynonyms() {
    if (synonymLookup) return Promise.resolve();
    return fetch("content/synonyms.json")
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (groups) { buildSynonymLookup(groups); })
      .catch(function () { synonymLookup = {}; });
  }

  function buildSynonymLookup(groups) {
    synonymLookup = {};
    if (!Array.isArray(groups)) return;
    groups.forEach(function (group) {
      var allStems = [];
      group.forEach(function (term) {
        tokenize(term).forEach(function (tok) {
          var s = stem(tok);
          if (allStems.indexOf(s) === -1) allStems.push(s);
        });
      });
      allStems.forEach(function (s) {
        if (!synonymLookup[s]) synonymLookup[s] = [];
        allStems.forEach(function (s2) {
          if (s2 !== s && synonymLookup[s].indexOf(s2) === -1) {
            synonymLookup[s].push(s2);
          }
        });
      });
    });
  }

  function expandStems(stems) {
    if (!synonymLookup) return stems;
    var expanded = stems.slice();
    for (var i = 0; i < stems.length; i++) {
      var related = synonymLookup[stems[i]];
      if (related) {
        for (var j = 0; j < related.length; j++) {
          if (expanded.indexOf(related[j]) === -1) expanded.push(related[j]);
        }
      }
    }
    return expanded;
  }

  // ── Text extraction ────────────────────────────────────────────

  function stripHtml(str) {
    if (!str) return "";
    if (str.indexOf("<") === -1) return str;
    var doc = new DOMParser().parseFromString(str, "text/html");
    return doc.body.textContent || "";
  }

  function extractBlockTexts(block) {
    if (!block || !block.type) return [];
    var texts = [];
    switch (block.type) {
      case "heading":
        if (block.text) texts.push(stripHtml(block.text));
        break;
      case "paragraph":
        if (block.text) texts.push(stripHtml(block.text));
        break;
      case "callout":
        if (block.text) texts.push(stripHtml(block.text));
        break;
      case "comparison-table":
        if (block.headers) texts.push(block.headers.join(" "));
        if (block.rows) {
          block.rows.forEach(function (row) {
            texts.push(row.map(function (cell) { return stripHtml(cell); }).join(" "));
          });
        }
        break;
      case "reveal-cards":
        if (block.cards) {
          block.cards.forEach(function (card) {
            if (card.front) texts.push(stripHtml(card.front));
            if (card.back) texts.push(stripHtml(card.back));
          });
        }
        break;
      case "interactive-match":
        if (block.prompt) texts.push(stripHtml(block.prompt));
        if (block.pairs) {
          block.pairs.forEach(function (pair) {
            if (pair.left) texts.push(stripHtml(pair.left));
            if (pair.right) texts.push(stripHtml(pair.right));
          });
        }
        break;
      case "interactive-sort":
        if (block.prompt) texts.push(stripHtml(block.prompt));
        if (block.items) {
          block.items.forEach(function (item) {
            texts.push(stripHtml(item));
          });
        }
        break;
      case "exercise":
        if (block.title) texts.push(stripHtml(block.title));
        if (block.objective) texts.push(stripHtml(block.objective));
        if (block.tasks) {
          block.tasks.forEach(function (task) {
            if (task.title) texts.push(stripHtml(task.title));
            if (task.steps) {
              task.steps.forEach(function (step) {
                if (step.action) texts.push(stripHtml(step.action));
                if (step.detail) texts.push(stripHtml(step.detail));
              });
            }
          });
        }
        break;
      case "image":
        if (block.alt) texts.push(block.alt);
        if (block.caption) texts.push(stripHtml(block.caption));
        break;
    }
    return texts;
  }

  // ── Record creation ────────────────────────────────────────────

  function pushRecord(records, text, type, moduleId, topicId, title, blockType, route, ctx) {
    if (!text || !text.trim()) return;
    var rec = {
      text: text,
      textLower: text.toLowerCase(),
      stems: stemTokens(tokenize(text)),
      type: type,
      moduleId: moduleId,
      topicId: topicId,
      title: title,
      blockType: blockType,
      route: route
    };
    if (ctx) {
      rec.courseId = ctx.courseId;
      rec.courseTitle = ctx.courseTitle;
      rec.familyId = ctx.familyId;
      rec.familyName = ctx.familyName;
      rec.familyColor = ctx.familyColor;
    }
    records.push(rec);
  }

  // ── Shared indexing helpers ────────────────────────────────────

  function indexModules(records, modules, ctx) {
    modules.forEach(function (mod) {
      if (!mod || !mod.topics) return;
      mod.topics.forEach(function (topic) {
        var route = "#/topic/" + topic.id;
        pushRecord(records, topic.title, "topic", mod.id, topic.id, topic.title, "title", route, ctx);

        if (topic.keyTakeaways) {
          topic.keyTakeaways.forEach(function (kt) {
            pushRecord(records, kt, "topic", mod.id, topic.id, topic.title, "takeaway", route, ctx);
          });
        }

        // Phase 3: tag support (topics can optionally have a tags array)
        if (topic.tags) {
          pushRecord(records, topic.tags.join(" "), "topic", mod.id, topic.id, topic.title, "tags", route, ctx);
        }

        if (topic.content) {
          topic.content.forEach(function (block) {
            extractBlockTexts(block).forEach(function (text) {
              pushRecord(records, text, "topic", mod.id, topic.id, topic.title, block.type, route, ctx);
            });
          });
        }
      });
    });
  }

  function indexGlossary(records, glossary, ctx) {
    if (!glossary || !glossary.terms) return;
    glossary.terms.forEach(function (term) {
      var combined = term.term + " \u2014 " + term.definition;
      pushRecord(records, combined, "glossary", null, null, term.term, "glossary", "#/glossary", ctx);
    });
  }

  function indexQuiz(records, quiz, moduleId, ctx) {
    if (!quiz || !quiz.questions) return;
    quiz.questions.forEach(function (q) {
      var text = q.question;
      if (q.options) text += " " + q.options.join(" ");
      if (q.rationale) text += " " + q.rationale;
      pushRecord(records, stripHtml(text), "quiz", quiz.moduleId || moduleId, null,
        q.question, "quiz", "#/quiz/" + (quiz.moduleId || moduleId), ctx);
    });
  }

  // ── Index building (per-course) ────────────────────────────────

  function buildCourseIndex() {
    if (courseIndex) return Promise.resolve(courseIndex);
    if (building) return Promise.resolve([]);
    building = true;

    return Promise.all([
      OB.content.loadAllModules(),
      OB.content.getCourse(),
      OB.content.getGlossary().catch(function () { return { terms: [] }; }),
      loadSynonyms()
    ]).then(function (results) {
      var allModules = results[0];
      var course = results[1];
      var glossary = results[2];
      var records = [];

      indexModules(records, allModules, null);
      indexGlossary(records, glossary, null);

      var quizPromises = course.modules
        .filter(function (m) { return !m.comingSoon && m.quizFile; })
        .map(function (m) {
          return OB.content.getQuiz(m.id).then(function (quiz) {
            indexQuiz(records, quiz, m.id, null);
          }).catch(function () {});
        });

      return Promise.all(quizPromises).then(function () {
        courseIndex = records;
        building = false;
        return courseIndex;
      });
    }).catch(function () {
      building = false;
      return [];
    });
  }

  // ── Index building (global / cross-course) ─────────────────────

  function buildGlobalIndex() {
    if (globalIndex) return Promise.resolve(globalIndex);
    if (building) return Promise.resolve([]);
    building = true;

    return Promise.all([
      OB.content.loadCatalog(),
      loadSynonyms()
    ]).then(function (results) {
      var catalog = results[0];
      var records = [];
      var coursePromises = [];

      catalog.families.forEach(function (family) {
        family.courses.forEach(function (course) {
          if (course.comingSoon) return;
          var ctx = {
            courseId: course.id,
            courseTitle: course.title,
            familyId: family.id,
            familyName: family.name,
            familyColor: family.color
          };
          coursePromises.push(loadCourseContent(course.id, ctx, records));
        });
      });

      return Promise.all(coursePromises).then(function () {
        globalIndex = records;
        building = false;
        return globalIndex;
      });
    }).catch(function () {
      building = false;
      return [];
    });
  }

  function loadCourseContent(courseId, ctx, records) {
    var base = "courses/" + courseId + "/";
    return fetch(base + "course.json")
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (courseData) {
        var promises = [];

        courseData.modules.forEach(function (mod) {
          if (mod.comingSoon || !mod.contentFile) return;
          promises.push(
            fetch(base + mod.contentFile)
              .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
              .then(function (modData) { indexModules(records, [modData], ctx); })
              .catch(function () {})
          );
          if (mod.quizFile) {
            promises.push(
              fetch(base + mod.quizFile)
                .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
                .then(function (quiz) { indexQuiz(records, quiz, mod.id, ctx); })
                .catch(function () {})
            );
          }
        });

        promises.push(
          fetch(base + "glossary.json")
            .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
            .then(function (glossary) { indexGlossary(records, glossary, ctx); })
            .catch(function () {})
        );

        return Promise.all(promises);
      })
      .catch(function () { /* course content unavailable */ });
  }

  // ── Search + Scoring ───────────────────────────────────────────

  function getBlockWeight(blockType) {
    switch (blockType) {
      case "title": return W_TITLE;
      case "heading": return W_HEADING;
      case "takeaway": case "tags": return W_TAKEAWAY;
      default: return W_BODY;
    }
  }

  function searchIndex(query) {
    var idx = isGlobalMode ? globalIndex : courseIndex;
    if (!idx || !query) return { topics: [], glossary: [], quiz: [] };

    var queryLower = query.toLowerCase().trim();
    var queryTokens = tokenize(query);
    var queryStems = stemTokens(queryTokens);
    var expandedStems = expandStems(queryStems);

    var scored = [];
    for (var i = 0; i < idx.length; i++) {
      var rec = idx[i];
      var score = 0;
      var weight = getBlockWeight(rec.blockType);

      // Exact full-query substring match
      if (rec.textLower.indexOf(queryLower) !== -1) {
        score += weight * W_EXACT;
      }

      // Token/stem matching with synonym expansion
      var matched = 0;
      for (var j = 0; j < expandedStems.length; j++) {
        if (rec.stems.indexOf(expandedStems[j]) !== -1) matched++;
      }
      if (matched > 0) {
        var coverage = matched / Math.max(queryStems.length, 1);
        score += weight * W_TOKEN * coverage;
      }

      if (score > 0) scored.push({ rec: rec, score: score });
    }

    scored.sort(function (a, b) { return b.score - a.score; });

    // Deduplicate: best result per topic/term/question (per course in global mode)
    var topicMap = {};
    var glossaryMap = {};
    var quizMap = {};

    for (var s = 0; s < scored.length; s++) {
      var item = scored[s];
      var r = item.rec;
      var prefix = r.courseId ? r.courseId + ":" : "";
      var result = {
        text: r.text,
        title: r.title,
        route: r.route,
        moduleId: r.moduleId,
        topicId: r.topicId,
        blockType: r.blockType,
        score: item.score,
        query: query,
        courseId: r.courseId || null,
        courseTitle: r.courseTitle || null,
        familyName: r.familyName || null,
        familyColor: r.familyColor || null,
        matchPos: findMatchPos(r.textLower, queryLower, queryTokens)
      };

      if (r.type === "topic") {
        var tk = prefix + r.topicId;
        if (!topicMap[tk] || item.score > topicMap[tk].score) topicMap[tk] = result;
      } else if (r.type === "glossary") {
        var gk = prefix + r.title;
        if (!glossaryMap[gk]) glossaryMap[gk] = result;
      } else if (r.type === "quiz") {
        var qk = prefix + r.title;
        if (!quizMap[qk]) quizMap[qk] = result;
      }
    }

    function toArray(map) {
      return Object.keys(map)
        .map(function (k) { return map[k]; })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, MAX_RESULTS);
    }

    return {
      topics: toArray(topicMap),
      glossary: toArray(glossaryMap),
      quiz: toArray(quizMap)
    };
  }

  function findMatchPos(textLower, queryLower, queryTokens) {
    var pos = textLower.indexOf(queryLower);
    if (pos !== -1) return pos;
    for (var i = 0; i < queryTokens.length; i++) {
      pos = textLower.indexOf(queryTokens[i]);
      if (pos !== -1) return pos;
    }
    return 0;
  }

  // ── Snippet generation ─────────────────────────────────────────

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function makeSnippet(text, matchPos, query) {
    var esc = OB.ui.esc;
    var start = Math.max(0, matchPos - SNIPPET_RADIUS);
    var end = Math.min(text.length, matchPos + Math.max(query.length, 20) + SNIPPET_RADIUS);

    // Expand to word boundaries
    if (start > 0) {
      var sp = text.indexOf(" ", start);
      if (sp !== -1 && sp < matchPos) start = sp + 1;
    }
    if (end < text.length) {
      var sp2 = text.lastIndexOf(" ", end);
      if (sp2 > matchPos + 10) end = sp2;
    }

    var snippet = text.substring(start, end);
    var snippetEsc = esc(snippet);

    // Highlight query tokens in the snippet
    var tokens = tokenize(query);
    if (tokens.length > 0) {
      var pattern = tokens.map(escapeRegex).join("|");
      snippetEsc = snippetEsc.replace(new RegExp("(" + pattern + ")", "gi"), "<mark>$1</mark>");
    }

    return (start > 0 ? "..." : "") + snippetEsc + (end < text.length ? "..." : "");
  }

  // ── UI Rendering ───────────────────────────────────────────────

  function renderSearchBox(opts) {
    var container = document.getElementById("sb-search");
    if (!container) return;

    isCatalogPage = !!(opts && opts.global);

    // Check sessionStorage for a saved global search to restore
    var savedQuery = null;
    try { savedQuery = sessionStorage.getItem(SESSION_KEY); } catch (e) {}

    // Global mode if on catalog page OR restoring a cross-course search
    isGlobalMode = isCatalogPage || !!savedQuery;

    // Preserve existing search with active query (sidebar re-renders on hash change)
    var existing = document.getElementById("sb-search-input");
    if (existing && existing.value.trim()) {
      var nav = document.getElementById("nav");
      var resultsPanel = document.getElementById("sb-search-results");
      if (resultsPanel && resultsPanel.style.display !== "none") {
        if (nav) nav.style.display = "none";
      }
      container.style.display = "";
      return;
    }

    var t = OB.i18n.t;
    var placeholder = isGlobalMode ? t("search.placeholderGlobal") : t("search.placeholder");

    container.innerHTML =
      '<div class="sb-search-wrap">' +
        '<input type="text" class="sb-search-input" id="sb-search-input" ' +
          'placeholder="' + OB.ui.esc(placeholder) + '" autocomplete="off">' +
        '<button class="sb-search-clear" id="sb-search-clear" style="display:none">&times;</button>' +
        '<span class="sb-search-shortcut" id="sb-search-shortcut">Ctrl+K</span>' +
      '</div>';

    var input = document.getElementById("sb-search-input");
    var clearBtn = document.getElementById("sb-search-clear");
    var shortcutHint = document.getElementById("sb-search-shortcut");

    input.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      var val = input.value.trim();
      clearBtn.style.display = val ? "" : "none";
      shortcutHint.style.display = val ? "none" : "";
      if (!val) {
        clearGlobalSession();
        hideResults();
        return;
      }
      debounceTimer = setTimeout(function () {
        doSearch(val);
      }, DEBOUNCE_MS);
    });

    input.addEventListener("focus", function () {
      shortcutHint.style.display = input.value.trim() ? "none" : "";
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        input.value = "";
        clearBtn.style.display = "none";
        shortcutHint.style.display = "";
        clearGlobalSession();
        hideResults();
        input.blur();
      }
    });

    clearBtn.addEventListener("click", function () {
      input.value = "";
      clearBtn.style.display = "none";
      shortcutHint.style.display = "";
      clearGlobalSession();
      hideResults();
      input.focus();
    });

    // Global Ctrl+K / Cmd+K (bind once)
    if (!OB.search._kbBound) {
      OB.search._kbBound = true;
      document.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
          e.preventDefault();
          var inp = document.getElementById("sb-search-input");
          if (inp) { inp.focus(); inp.select(); }
        }
      });
    }

    container.style.display = "";

    // Restore saved global search after rendering the input
    if (savedQuery) {
      input.value = savedQuery;
      clearBtn.style.display = "";
      shortcutHint.style.display = "none";
      setTimeout(function () { doSearch(savedQuery); }, 0);
    }
  }

  function clearGlobalSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    isGlobalMode = isCatalogPage;
  }

  function hideSearchBox() {
    var container = document.getElementById("sb-search");
    if (container) container.style.display = "none";
    hideResults();
  }

  function doSearch(query) {
    // Persist global searches so they survive page navigation
    if (isGlobalMode) {
      try { sessionStorage.setItem(SESSION_KEY, query); } catch (e) {}
    }

    var builder = isGlobalMode ? buildGlobalIndex : buildCourseIndex;
    var idx = isGlobalMode ? globalIndex : courseIndex;

    // Show loading state on first build
    if (!idx) {
      var panel = ensureResultsPanel();
      if (panel) {
        var t = OB.i18n.t;
        panel.innerHTML = '<div class="sb-search-empty">' + OB.ui.esc(t("search.building")) + '</div>';
        panel.style.display = "";
        var nav = document.getElementById("nav");
        if (nav) nav.style.display = "none";
      }
    }

    builder().then(function () {
      var results = searchIndex(query);
      renderResults(results, query);
    });
  }

  function ensureResultsPanel() {
    var panel = document.getElementById("sb-search-results");
    if (panel) return panel;

    var nav = document.getElementById("nav");
    if (!nav) return null;

    panel = document.createElement("div");
    panel.id = "sb-search-results";
    panel.className = "sb-search-results";
    nav.parentNode.insertBefore(panel, nav);

    panel.addEventListener("click", function (e) {
      var link = e.target;
      while (link && link !== panel) {
        if (link.tagName === "A") {
          setTimeout(function () { OB.sidebar.closeMobile(); }, 0);
          return;
        }
        link = link.parentElement;
      }
    });

    return panel;
  }

  function renderResults(results, query) {
    var nav = document.getElementById("nav");
    var resultsPanel = ensureResultsPanel();
    if (!resultsPanel) return;

    var t = OB.i18n.t;
    var esc = OB.ui.esc;
    var totalCount = results.topics.length + results.glossary.length + results.quiz.length;

    if (totalCount === 0) {
      resultsPanel.innerHTML =
        '<div class="sb-search-empty">' + esc(t("search.noResults")) + '</div>';
      nav.style.display = "none";
      resultsPanel.style.display = "";
      return;
    }

    var html = '<div class="sb-search-count">' +
      esc(t("search.resultCount", { count: totalCount })) + '</div>';

    // Topics
    if (results.topics.length) {
      html += '<div class="sb-search-group">';
      html += '<div class="sb-search-group-title">' +
        '<span class="sb-search-group-icon">&#128196;</span>' +
        esc(t("search.topicResults")) + '</div>';
      results.topics.forEach(function (r) {
        html += renderResultItem(r);
      });
      html += '</div>';
    }

    // Glossary
    if (results.glossary.length) {
      html += '<div class="sb-search-group">';
      html += '<div class="sb-search-group-title">' +
        '<span class="sb-search-group-icon">&#128218;</span>' +
        esc(t("search.glossaryResults")) + '</div>';
      results.glossary.forEach(function (r) {
        html += renderResultItem(r);
      });
      html += '</div>';
    }

    // Quiz
    if (results.quiz.length) {
      html += '<div class="sb-search-group">';
      html += '<div class="sb-search-group-title">' +
        '<span class="sb-search-group-icon">&#9997;</span>' +
        esc(t("search.quizResults")) + '</div>';
      results.quiz.forEach(function (r) {
        html += renderResultItem(r);
      });
      html += '</div>';
    }

    resultsPanel.innerHTML = html;
    nav.style.display = "none";
    resultsPanel.style.display = "";
  }

  function renderResultItem(r) {
    var esc = OB.ui.esc;
    var snippet = makeSnippet(r.text, r.matchPos, r.query);

    // Build href
    var href;
    if (r.courseId) {
      var params = new URLSearchParams(window.location.search);
      params.set("course", r.courseId);
      params.delete("edit");
      href = window.location.pathname + "?" + params.toString() + r.route;
    } else {
      href = r.route;
    }

    // Build breadcrumb
    var breadcrumb = "";
    if (r.courseId) {
      breadcrumb += '<span class="sb-search-course-dot" style="background:' +
        (r.familyColor || "var(--c-accent)") + '"></span>';
      breadcrumb += esc(r.courseTitle);
      if (r.moduleId) {
        breadcrumb += " &rsaquo; M" + r.moduleId.replace("m", "");
      }
    } else {
      if (r.moduleId) {
        var modNum = r.moduleId.replace("m", "");
        breadcrumb = "M" + modNum;
        if (r.topicId) breadcrumb += " &rsaquo; " + esc(r.title);
      } else {
        breadcrumb = esc(r.title);
      }
    }

    return '<a class="sb-search-result" href="' + esc(href) + '">' +
      '<div class="sb-search-result-title">' + esc(r.title) + '</div>' +
      '<div class="sb-search-result-snippet">' + snippet + '</div>' +
      '<div class="sb-search-result-breadcrumb">' + breadcrumb + '</div>' +
    '</a>';
  }

  function hideResults() {
    var nav = document.getElementById("nav");
    var resultsPanel = document.getElementById("sb-search-results");
    if (nav) nav.style.display = "";
    if (resultsPanel) resultsPanel.style.display = "none";
  }

  function clearSearch() {
    var input = document.getElementById("sb-search-input");
    var clearBtn = document.getElementById("sb-search-clear");
    var shortcutHint = document.getElementById("sb-search-shortcut");
    if (input) input.value = "";
    if (clearBtn) clearBtn.style.display = "none";
    if (shortcutHint) shortcutHint.style.display = "";
    hideResults();
  }

  function clearIndex() {
    courseIndex = null;
    building = false;
  }

  OB.search = {
    renderSearchBox: renderSearchBox,
    hideSearchBox: hideSearchBox,
    clearIndex: clearIndex,
    clearSearch: clearSearch,
  };
})();
