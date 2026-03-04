/**
 * OB -- Onboarding -- Router
 * ============================
 * Hash-based SPA routing. Dispatches to view renderers.
 * Reads ?course=xxx query param to set course context.
 * No course param → catalog view.
 * Must be loaded last.
 * Attached to window.OB.router.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  /**
   * Read the ?course= query parameter.
   */
  function getCourseParam() {
    var params = new URLSearchParams(window.location.search);
    return params.get("course") || null;
  }

  /**
   * Navigate to a course (sets ?course= param).
   */
  function goToCourse(courseId) {
    var params = new URLSearchParams(window.location.search);
    params.set("course", courseId);
    // Preserve lang param if present
    var url = window.location.pathname + "?" + params.toString() + "#/";
    window.location.href = url;
  }

  /**
   * Return to catalog (remove course param).
   */
  function goToCatalog() {
    var params = new URLSearchParams(window.location.search);
    params.delete("course");
    var qs = params.toString();
    var url = window.location.pathname + (qs ? "?" + qs : "") + "#/";
    window.location.href = url;
  }

  function init() {
    // Init subsystems
    OB.theme.init();
    OB.notepad.init();

    var courseId = getCourseParam();

    if (!courseId) {
      // Catalog mode — no course selected
      initCatalogMode();
      return;
    }

    // Course mode — set context and proceed
    OB.content.setCourse(courseId);
    OB.state.setCourse(courseId);

    // Load course-specific bundles, then init
    OB.i18n.loadCourseBundle(courseId).then(function () {
      OB.sidebar.initMobile();
      OB.notepad.loadNotes();

      // Reset button
      var resetBtn = document.getElementById("reset-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          if (confirm(OB.i18n.t("app.resetConfirm"))) {
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
    });
  }

  function initCatalogMode() {
    // Hide course-specific UI
    var sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.add("catalog-mode");

    OB.sidebar.initMobile();

    // Render catalog
    OB.content.loadCatalog().then(function (catalog) {
      OB.sidebar.renderCatalog(catalog);
      OB.dashboard.renderCatalog(catalog);
    }).catch(function (err) {
      OB.ui.setMain('<div class="card"><h2>' + OB.i18n.t("error.loadingContent") + '</h2><p class="text-muted">' +
        OB.ui.esc(err.message) + '</p></div>');
    });
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
      OB.ui.setMain('<div class="card"><h2>' + OB.i18n.t("error.loadingContent") + '</h2><p class="text-muted">' +
        OB.ui.esc(err.message) +
        '</p><p class="text-muted text-sm">' + OB.i18n.t("error.serverRequired") + '</p></div>');
    });
  }

  function routeModule(moduleId) {
    if (!moduleId) { window.location.hash = "#/"; return; }
    OB.content.getModule(moduleId).then(function (data) {
      OB.topic.renderModuleOverview(data);
    }).catch(function () {
      OB.ui.setMain('<p>' + OB.i18n.t("quiz.moduleNotFound") + '</p>');
    });
  }

  function routeTopic(topicId) {
    if (!topicId) { window.location.hash = "#/"; return; }
    // Extract module ID from topic ID (e.g., "m1t2" -> "m1")
    var moduleId = topicId.replace(/t\d+$/, "");
    OB.content.getModule(moduleId).then(function (data) {
      OB.topic.render(data, topicId);
    }).catch(function () {
      OB.ui.setMain('<p>' + OB.i18n.t("quiz.topicNotFound") + '</p>');
    });
  }

  function routeQuiz(moduleId) {
    if (!moduleId) { window.location.hash = "#/"; return; }
    OB.quiz.render(moduleId);
  }

  OB.router = {
    init: init,
    navigate: navigate,
    goToCourse: goToCourse,
    goToCatalog: goToCatalog,
    getCourseParam: getCourseParam,
  };
})();
