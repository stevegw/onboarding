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
      OB.ui.setMain('<p>Glossary not available.</p>');
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

    var html = '';
    html += '<h1>Glossary</h1>';
    html += '<p class="text-muted text-sm mb-md">Options and Configurable Products terminology (' + terms.length + ' terms)</p>';
    html += '<input class="glossary-search" id="glossary-search" type="text" placeholder="Search terms..." value="' + esc(filter) + '">';

    if (filtered.length === 0) {
      html += '<p class="text-muted text-sm">No terms match your search.</p>';
    } else {
      html += '<div class="card">';
      filtered.forEach(function (t) {
        html += '<div class="glossary-item">';
        html += '<div class="glossary-term">' + esc(t.term) + '</div>';
        html += '<div class="glossary-def">' + esc(t.definition) + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Back button
    html += '<div class="nav-btns">';
    html += '<button class="btn btn-outline" data-route="#/">&#8592; Dashboard</button>';
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
  }

  OB.glossary = { render: render };
})();
