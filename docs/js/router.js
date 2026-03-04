/**
 * OB -- Onboarding -- Router
 * ============================
 * Hash-based SPA routing. Dispatches to view renderers.
 * Must be loaded last.
 * Attached to window.OB.router.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  function init() {
    // Init subsystems
    OB.theme.init();
    OB.sidebar.initMobile();
    OB.notepad.init();

    // Reset button
    var resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (confirm("Reset all progress and notes?")) {
          OB.state.resetAll();
          OB.notepad.clearNotes();
          window.location.hash = "#/";
          navigate();
        }
      });
    }

    // Listen for hash changes
    window.addEventListener("hashchange", navigate);

    // Initial navigation
    navigate();
  }

  function navigate() {
    var hash = window.location.hash || "#/";
    var parts = hash.replace("#/", "").split("/");
    var view = parts[0] || "";
    var param = parts[1] || "";

    // Save route for "continue where you left off" (except dashboard)
    if (hash !== "#/" && hash !== "") {
      OB.state.saveRoute(hash);
    }

    // Load course data first, then render
    OB.content.getCourse().then(function (course) {
      // Also preload module content for progress tracking
      OB.content.loadAllModules().then(function () {
        // Update sidebar
        OB.sidebar.render(course, hash);

        // Route to view
        switch (view) {
          case "module":
            routeModule(param);
            break;
          case "topic":
            routeTopic(param);
            break;
          case "quiz":
            routeQuiz(param);
            break;
          case "glossary":
            OB.glossary.render();
            break;
          default:
            OB.dashboard.render(course);
        }
      });
    }).catch(function (err) {
      OB.ui.setMain('<div class="card"><h2>Error Loading Content</h2><p class="text-muted">' +
        OB.ui.esc(err.message) +
        '</p><p class="text-muted text-sm">Make sure you are serving this from an HTTP server (e.g., <code>python -m http.server</code>). ' +
        'The <code>fetch()</code> API does not work with <code>file://</code> URLs.</p></div>');
    });
  }

  function routeModule(moduleId) {
    if (!moduleId) { window.location.hash = "#/"; return; }
    OB.content.getModule(moduleId).then(function (data) {
      OB.topic.renderModuleOverview(data);
    }).catch(function () {
      OB.ui.setMain('<p>Module not found.</p>');
    });
  }

  function routeTopic(topicId) {
    if (!topicId) { window.location.hash = "#/"; return; }
    // Extract module ID from topic ID (e.g., "m1t2" -> "m1")
    var moduleId = topicId.replace(/t\d+$/, "");
    OB.content.getModule(moduleId).then(function (data) {
      OB.topic.render(data, topicId);
    }).catch(function () {
      OB.ui.setMain('<p>Topic not found.</p>');
    });
  }

  function routeQuiz(moduleId) {
    if (!moduleId) { window.location.hash = "#/"; return; }
    OB.quiz.render(moduleId);
  }

  OB.router = { init: init, navigate: navigate };
})();
