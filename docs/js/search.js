/**
 * OB -- Onboarding -- In-Course Content Search
 * ===============================================
 * Builds a search index from topics, glossary, and quizzes.
 * Provides real-time substring search with snippet highlighting.
 * Renders grouped results in the sidebar, replacing the nav tree.
 * Attached to window.OB.search.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var index = null;       // flat array of search records
  var building = false;   // prevent concurrent builds
  var debounceTimer = null;
  var DEBOUNCE_MS = 150;
  var SNIPPET_RADIUS = 60;
  var MAX_RESULTS = 20;

  // ── Text extraction ──────────────────────────────────────────

  /**
   * Strip HTML tags to plain text using DOMParser.
   */
  function stripHtml(str) {
    if (!str) return "";
    if (str.indexOf("<") === -1) return str;
    var doc = new DOMParser().parseFromString(str, "text/html");
    return doc.body.textContent || "";
  }

  /**
   * Extract searchable text strings from a content block.
   * Returns an array of plain-text strings.
   */
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

  // ── Index building ────────────────────────────────────────────

  /**
   * Build the search index from all course content.
   * Returns a Promise that resolves when the index is ready.
   */
  function buildIndex() {
    if (index) return Promise.resolve(index);
    if (building) return Promise.resolve([]);
    building = true;

    var records = [];

    return Promise.all([
      OB.content.loadAllModules(),
      OB.content.getCourse(),
      OB.content.getGlossary().catch(function () { return { terms: [] }; }),
    ]).then(function (results) {
      var allModules = results[0];
      var course = results[1];
      var glossary = results[2];

      // Index topic content
      allModules.forEach(function (mod) {
        if (!mod || !mod.topics) return;
        mod.topics.forEach(function (topic) {
          // Topic title
          addRecord(records, topic.title, "topic", mod.id, topic.id, topic.title, "title",
            "#/topic/" + topic.id);

          // Key takeaways
          if (topic.keyTakeaways) {
            topic.keyTakeaways.forEach(function (kt) {
              addRecord(records, kt, "topic", mod.id, topic.id, topic.title, "takeaway",
                "#/topic/" + topic.id);
            });
          }

          // Content blocks
          if (topic.content) {
            topic.content.forEach(function (block) {
              var texts = extractBlockTexts(block);
              texts.forEach(function (text) {
                addRecord(records, text, "topic", mod.id, topic.id, topic.title, block.type,
                  "#/topic/" + topic.id);
              });
            });
          }
        });
      });

      // Index glossary terms
      if (glossary && glossary.terms) {
        glossary.terms.forEach(function (term) {
          var combined = term.term + " — " + term.definition;
          addRecord(records, combined, "glossary", null, null, term.term, "glossary",
            "#/glossary");
        });
      }

      // Index quiz questions
      var quizPromises = course.modules
        .filter(function (m) { return !m.comingSoon && m.quizFile; })
        .map(function (m) {
          return OB.content.getQuiz(m.id).then(function (quiz) {
            if (!quiz || !quiz.questions) return;
            quiz.questions.forEach(function (q) {
              var text = q.question;
              if (q.options) text += " " + q.options.join(" ");
              if (q.rationale) text += " " + q.rationale;
              addRecord(records, stripHtml(text), "quiz", quiz.moduleId || m.id, null,
                q.question, "quiz", "#/quiz/" + m.id);
            });
          }).catch(function () { /* skip unavailable quizzes */ });
        });

      return Promise.all(quizPromises).then(function () {
        index = records;
        building = false;
        return index;
      });
    }).catch(function () {
      building = false;
      return [];
    });
  }

  function addRecord(records, text, type, moduleId, topicId, title, blockType, route) {
    if (!text || !text.trim()) return;
    records.push({
      text: text,
      textLower: text.toLowerCase(),
      type: type,
      moduleId: moduleId,
      topicId: topicId,
      title: title,
      blockType: blockType,
      route: route
    });
  }

  // ── Search ────────────────────────────────────────────────────

  /**
   * Search the index for a query string.
   * Returns { topics: [], glossary: [], quiz: [] } with results.
   */
  function search(query) {
    if (!index || !query) return { topics: [], glossary: [], quiz: [] };

    var q = query.toLowerCase();
    var topicMap = {};   // dedupe by topicId
    var glossaryMap = {}; // dedupe by term
    var quizMap = {};    // dedupe by question

    for (var i = 0; i < index.length; i++) {
      var rec = index[i];
      var pos = rec.textLower.indexOf(q);
      if (pos === -1) continue;

      var result = {
        text: rec.text,
        title: rec.title,
        route: rec.route,
        moduleId: rec.moduleId,
        topicId: rec.topicId,
        blockType: rec.blockType,
        matchPos: pos,
        query: query
      };

      if (rec.type === "topic") {
        // One result per topic — prefer title matches, then first match
        if (!topicMap[rec.topicId] || rec.blockType === "title") {
          topicMap[rec.topicId] = result;
        }
      } else if (rec.type === "glossary") {
        if (!glossaryMap[rec.title]) glossaryMap[rec.title] = result;
      } else if (rec.type === "quiz") {
        if (!quizMap[rec.title]) quizMap[rec.title] = result;
      }
    }

    function mapToArray(map) {
      var arr = [];
      var keys = Object.keys(map);
      for (var k = 0; k < keys.length && k < MAX_RESULTS; k++) {
        arr.push(map[keys[k]]);
      }
      return arr;
    }

    return {
      topics: mapToArray(topicMap),
      glossary: mapToArray(glossaryMap),
      quiz: mapToArray(quizMap)
    };
  }

  // ── Snippet generation ────────────────────────────────────────

  function makeSnippet(text, matchPos, query) {
    var esc = OB.ui.esc;
    var start = Math.max(0, matchPos - SNIPPET_RADIUS);
    var end = Math.min(text.length, matchPos + query.length + SNIPPET_RADIUS);

    // Expand to word boundaries
    if (start > 0) {
      var sp = text.indexOf(" ", start);
      if (sp !== -1 && sp < matchPos) start = sp + 1;
    }
    if (end < text.length) {
      var sp2 = text.lastIndexOf(" ", end);
      if (sp2 > matchPos + query.length) end = sp2;
    }

    var before = text.substring(start, matchPos);
    var match = text.substring(matchPos, matchPos + query.length);
    var after = text.substring(matchPos + query.length, end);

    var snippet = "";
    if (start > 0) snippet += "...";
    snippet += esc(before) + "<mark>" + esc(match) + "</mark>" + esc(after);
    if (end < text.length) snippet += "...";

    return snippet;
  }

  // ── UI Rendering ──────────────────────────────────────────────

  function renderSearchBox() {
    var container = document.getElementById("sb-search");
    if (!container) return;

    // If search box already exists with a query, preserve it and keep
    // the results panel visible — the user is clicking through results.
    var existing = document.getElementById("sb-search-input");
    if (existing && existing.value.trim()) {
      // Keep results visible, keep nav hidden
      var nav = document.getElementById("nav");
      var resultsPanel = document.getElementById("sb-search-results");
      if (resultsPanel && resultsPanel.style.display !== "none") {
        if (nav) nav.style.display = "none";
      }
      container.style.display = "";
      return;
    }

    var t = OB.i18n.t;
    container.innerHTML =
      '<div class="sb-search-wrap">' +
        '<input type="text" class="sb-search-input" id="sb-search-input" ' +
          'placeholder="' + OB.ui.esc(t("search.placeholder")) + '" autocomplete="off">' +
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
        hideResults();
        input.blur();
      }
    });

    clearBtn.addEventListener("click", function () {
      input.value = "";
      clearBtn.style.display = "none";
      shortcutHint.style.display = "";
      hideResults();
      input.focus();
    });

    // Global Ctrl+K / Cmd+K shortcut (only bind once)
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
  }

  function hideSearchBox() {
    var container = document.getElementById("sb-search");
    if (container) container.style.display = "none";
    hideResults();
  }

  function doSearch(query) {
    buildIndex().then(function () {
      var results = search(query);
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

    // On mobile, close the sidebar overlay so the user sees the content.
    // Results and search text are preserved for further clicks.
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
    var breadcrumb = "";
    if (r.moduleId) {
      var modNum = r.moduleId.replace("m", "");
      breadcrumb = "M" + modNum;
      if (r.topicId) breadcrumb += " &rsaquo; " + esc(r.title);
    } else {
      breadcrumb = esc(r.title);
    }

    return '<a class="sb-search-result" href="' + esc(r.route) + '">' +
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
    index = null;
    building = false;
  }

  OB.search = {
    renderSearchBox: renderSearchBox,
    hideSearchBox: hideSearchBox,
    clearIndex: clearIndex,
    clearSearch: clearSearch,
  };
})();
