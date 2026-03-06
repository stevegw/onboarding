/**
 * OB -- Onboarding -- Glossary View
 * ====================================
 * Renders searchable terminology reference.
 * Attached to window.OB.glossary.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  function render() {
    OB.content.getGlossary().then(function (data) {
      renderTerms(data.terms, "");
    }).catch(function () {
      OB.ui.setMain('<p>' + OB.i18n.t("glossary.notAvailable") + '</p>');
    });
  }

  function renderTerms(terms, filter) {
    var esc = OB.ui.esc;

    var filtered = terms;
    if (filter) {
      var lc = filter.toLowerCase();
      filtered = terms.filter(function (t) {
        return t.term.toLowerCase().indexOf(lc) > -1 ||
               t.definition.toLowerCase().indexOf(lc) > -1;
      });
    }

    // Sort alphabetically
    filtered.sort(function (a, b) { return a.term.localeCompare(b.term); });

    var t = OB.i18n.t;
    var editMode = OB.author && OB.author.isEditMode && OB.author.isEditMode();
    var html = '';
    html += '<h1>' + t("glossary.title") + '</h1>';
    html += '<p class="text-muted text-sm mb-md">' + t("glossary.subtitle", { count: terms.length }) + '</p>';
    if (editMode) {
      html += '<button class="author-list-add" id="glossary-add-term" style="margin-bottom:12px">+ Add Term</button>';
    }
    html += '<input class="glossary-search" id="glossary-search" type="text" placeholder="' + esc(t("glossary.searchPlaceholder")) + '" value="' + esc(filter) + '">';

    if (filtered.length === 0) {
      html += '<p class="text-muted text-sm">' + t("glossary.noResults") + '</p>';
    } else {
      html += '<div class="card">';
      filtered.forEach(function (item, idx) {
        // Find the original index in the full terms array
        var origIdx = terms.indexOf(item);
        html += '<div class="glossary-item">';
        html += '<div class="glossary-term">' + esc(item.term);
        if (editMode) {
          html += ' <button class="author-block-action author-edit-btn author-inline-edit" data-edit-term="' + origIdx + '" title="Edit term">&#9998;</button>';
          html += ' <button class="author-block-action author-inline-edit" data-delete-term="' + origIdx + '" title="Delete term" style="color:var(--c-warning)">&#10005;</button>';
        }
        html += '</div>';
        html += '<div class="glossary-def">' + esc(item.definition) + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Back button
    html += '<div class="nav-btns">';
    html += '<button class="btn btn-outline" data-route="#/">&#8592; ' + t("topic.backToDashboard") + '</button>';
    html += '<span></span>';
    html += '</div>';

    OB.ui.setMain(html);

    // Bind search
    var search = document.getElementById("glossary-search");
    if (search) {
      search.addEventListener("input", function () {
        renderTerms(terms, search.value);
        // Refocus and restore cursor
        var newSearch = document.getElementById("glossary-search");
        if (newSearch) {
          newSearch.focus();
          newSearch.selectionStart = newSearch.selectionEnd = newSearch.value.length;
        }
      });
    }

    // Bind nav
    document.querySelectorAll("[data-route]").forEach(function (el) {
      el.addEventListener("click", function () {
        window.location.hash = el.getAttribute("data-route");
      });
    });

    // Bind glossary edit buttons
    if (editMode) {
      document.querySelectorAll("[data-edit-term]").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var idx = parseInt(btn.getAttribute("data-edit-term"), 10);
          OB.author.openGlossaryEditModal(idx, terms[idx]);
        });
      });
      document.querySelectorAll("[data-delete-term]").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var idx = parseInt(btn.getAttribute("data-delete-term"), 10);
          OB.author.deleteGlossaryTerm(idx);
        });
      });
      var addBtn = document.getElementById("glossary-add-term");
      if (addBtn) addBtn.addEventListener("click", function () {
        OB.author.openGlossaryEditModal(-1, { term: "", definition: "" });
      });
    }
  }

  OB.glossary = { render: render };
})();
