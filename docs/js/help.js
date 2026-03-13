/**
 * OB -- Onboarding -- Help Guide
 * ================================
 * Renders in-app help guide with platform usage information.
 * Available in both catalog and course mode.
 * Attached to window.OB.help.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  function render() {
    var t = OB.i18n.t;
    var html = '';

    html += '<h1>' + t("help.title") + '</h1>';
    html += '<p class="text-muted text-sm mb-md">' + t("help.subtitle") + '</p>';

    // Getting Started
    html += '<h2>' + t("help.gettingStarted") + '</h2>';
    html += '<div class="card mb-md">';
    html += '<p>This platform provides interactive training courses for PTC products including Windchill, Codebeamer, and Creo. ' +
      'Each course is organized into modules containing topics, exercises, and knowledge checks.</p>';
    html += '<p>To get started, browse the <strong>Course Catalog</strong> and select a course. ' +
      'Courses marked as available will open immediately; others are coming soon.</p>';
    html += '</div>';

    // Navigating Courses
    html += '<h2>' + t("help.navigatingCourses") + '</h2>';
    html += '<div class="card mb-md">';
    html += '<p><strong>Dashboard</strong> &mdash; Each course opens to a dashboard showing all modules, your progress, and estimated time. ' +
      'Click any module card to see its topics.</p>';
    html += '<p><strong>Modules</strong> &mdash; Modules group related topics together. The module overview page lists all topics and shows your completion status.</p>';
    html += '<p><strong>Topics</strong> &mdash; Topics contain the learning content: text, tables, interactive elements, and exercises. ' +
      'Mark each topic complete when you\'re done.</p>';
    html += '<p><strong>Sidebar</strong> &mdash; The sidebar shows the full course outline with your progress. ' +
      'Click any topic or module to navigate directly. On mobile, tap the menu button (&#9776;) to open it.</p>';
    html += '</div>';

    // Topic Icons Key
    html += '<h2>' + t("help.topicIconsKey") + '</h2>';
    html += '<div class="card mb-md">';
    html += '<table class="comparison-table">';
    html += '<thead><tr><th>' + t("help.iconCol") + '</th><th>' + t("help.typeCol") + '</th><th>' + t("help.descCol") + '</th></tr></thead>';
    html += '<tbody>';
    html += '<tr><td>&#128221;</td><td>' + t("help.conceptType") + '</td><td>' + t("help.conceptDesc") + '</td></tr>';
    html += '<tr><td>&#127919;</td><td>' + t("help.interactiveType") + '</td><td>' + t("help.interactiveDesc") + '</td></tr>';
    html += '<tr><td>&#128295;</td><td>' + t("help.exerciseType") + '</td><td>' + t("help.exerciseDesc") + '</td></tr>';
    html += '</tbody></table>';
    html += '</div>';

    // Exercises
    html += '<h2>' + t("help.exercises") + '</h2>';
    html += '<div class="card mb-md">';
    html += '<p>Exercise topics provide hands-on, step-by-step tasks. Each exercise includes:</p>';
    html += '<ul style="margin:8px 0 8px 20px;line-height:1.8">';
    html += '<li><strong>Tasks</strong> &mdash; Grouped sets of steps to complete</li>';
    html += '<li><strong>Steps</strong> &mdash; Individual actions with a "Do This" instruction and "Why It Matters" explanation</li>';
    html += '<li><strong>Hints</strong> &mdash; Optional hints you can reveal for extra guidance</li>';
    html += '<li><strong>Checkboxes</strong> &mdash; Check off steps as you complete them; progress is saved automatically</li>';
    html += '</ul>';
    html += '<div class="callout callout-tip"><strong>Tip:</strong> Your exercise progress is saved automatically. ' +
      'You can leave and return to pick up where you left off.</div>';
    html += '</div>';

    // Search
    html += '<h2>' + t("help.search") + '</h2>';
    html += '<div class="card mb-md">';
    html += '<p>Use the search box in the sidebar to find topics, glossary terms, and quiz questions.</p>';
    html += '<ul style="margin:8px 0 8px 20px;line-height:1.8">';
    html += '<li><strong>Ctrl+K</strong> &mdash; Open search from anywhere</li>';
    html += '<li><strong>Course search</strong> &mdash; When inside a course, searches that course\'s content</li>';
    html += '<li><strong>Catalog search</strong> &mdash; From the catalog view, searches across all available courses</li>';
    html += '<li><strong>Fuzzy matching</strong> &mdash; Finds results even with partial or approximate terms</li>';
    html += '</ul>';
    html += '</div>';

    // Other Features
    html += '<h2>' + t("help.otherFeatures") + '</h2>';
    html += '<div class="card mb-md">';
    html += '<p><strong>&#9998; Notepad</strong> &mdash; Click the pencil button in the bottom-right corner to open a floating notepad. ' +
      'Notes are saved per-course automatically.</p>';
    html += '<p><strong>&#9790; Dark/Light Theme</strong> &mdash; Toggle between dark and light mode using the moon icon in the sidebar header.</p>';
    html += '<p><strong>Language Selector</strong> &mdash; Switch the UI language using the locale dropdown in the sidebar header. ' +
      'Course content translations are available for select courses.</p>';
    html += '<p><strong>Reset Progress</strong> &mdash; Use the "Reset Progress" button at the bottom of the sidebar to clear all progress and notes for the current course.</p>';
    html += '</div>';

    // Keyboard Shortcuts
    html += '<h2>' + t("help.keyboardShortcuts") + '</h2>';
    html += '<div class="card mb-md">';
    html += '<table class="comparison-table">';
    html += '<thead><tr><th>' + t("help.shortcutCol") + '</th><th>' + t("help.actionCol") + '</th></tr></thead>';
    html += '<tbody>';
    html += '<tr><td><code>Ctrl+K</code></td><td>' + t("help.shortcutSearch") + '</td></tr>';
    html += '</tbody></table>';
    html += '</div>';

    // Back button
    html += '<div class="nav-btns">';
    html += '<button class="btn btn-outline" data-route="#/">&#8592; ' + t("topic.backToDashboard") + '</button>';
    html += '<span></span>';
    html += '</div>';

    OB.ui.setMain(html);

    // Bind nav
    document.querySelectorAll("[data-route]").forEach(function (el) {
      el.addEventListener("click", function () {
        window.location.hash = el.getAttribute("data-route");
      });
    });
  }

  OB.help = { render: render };
})();
