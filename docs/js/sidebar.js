/**
 * OB -- Onboarding -- Sidebar Navigation
 * =========================================
 * Renders module/topic navigation tree with progress indicators.
 * In catalog mode, shows minimal sidebar with catalog info.
 * Attached to window.OB.sidebar.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var expandedModules = {};

  /**
   * Render sidebar for catalog mode (no course selected).
   */
  function renderCatalog(catalog) {
    var nav = document.getElementById("nav");
    if (!nav) return;

    var t = OB.i18n.t;
    var html = "";

    html += '<div class="sb-nav-item active" data-route="#/">';
    html += '<span class="nav-icon">&#128218;</span>';
    html += '<span class="nav-label">' + t("catalog.title") + '</span>';
    html += '</div>';

    // Show family sections
    html += '<div class="sb-nav-section">' + t("catalog.productFamilies") + '</div>';
    catalog.families.forEach(function (family) {
      var activeCount = family.courses.filter(function (c) { return !c.comingSoon; }).length;
      html += '<div class="sb-nav-item">';
      html += '<span class="nav-icon" style="color:' + family.color + '">' + family.icon + '</span>';
      html += '<span class="nav-label">' + OB.ui.esc(family.name) + '</span>';
      html += '<span class="module-progress">' + activeCount + '/' + family.courses.length + '</span>';
      html += '</div>';
    });

    nav.innerHTML = html;

    // Hide course-specific progress bar
    var progressSection = document.querySelector(".sb-progress");
    if (progressSection) progressSection.style.display = "none";

    // Hide reset button in catalog mode
    var resetSection = document.querySelector(".sb-actions");
    if (resetSection) resetSection.style.display = "none";

    // Update logo text for catalog
    var logoTitle = document.querySelector(".sb-logo-text h2");
    var logoSub = document.querySelector(".sb-logo-text p");
    if (logoTitle) logoTitle.textContent = t("catalog.platformTitle");
    if (logoSub) logoSub.textContent = t("catalog.platformSubtitle");
  }

  /**
   * Render sidebar for course mode (course selected).
   */
  function render(course, activeRoute, allModules) {
    // Build topic title lookup from loaded module content
    var topicTitles = {};
    if (allModules) {
      allModules.forEach(function (mod) {
        if (mod && mod.topics) {
          mod.topics.forEach(function (t) { topicTitles[t.id] = t.title; });
        }
      });
    }
    var nav = document.getElementById("nav");
    if (!nav) return;

    var t = OB.i18n.t;
    var html = "";

    // "All Courses" back link
    html += '<div class="sb-nav-item sb-back-link" id="back-to-catalog">';
    html += '<span class="nav-icon">&#8592;</span>';
    html += '<span class="nav-label">' + t("catalog.backToCatalog") + '</span>';
    html += '</div>';

    // Dashboard link
    var dashActive = (!activeRoute || activeRoute === "#/" || activeRoute === "") ? " active" : "";
    html += '<div class="sb-nav-item' + dashActive + '" data-route="#/">';
    html += '<span class="nav-icon">&#9776;</span>';
    html += '<span class="nav-label">' + t("sidebar.dashboard") + '</span>';
    html += '</div>';

    // Modules
    html += '<div class="sb-nav-section">' + t("sidebar.modules") + '</div>';

    course.modules.forEach(function (mod, idx) {
      var modNum = idx + 1;
      var modRoute = "#/module/" + mod.id;
      var isModActive = activeRoute === modRoute;
      var isExpanded = expandedModules[mod.id] || isModActive || (activeRoute && activeRoute.indexOf(mod.id) > -1);

      // Module progress
      var topicIds = [];
      if (!mod.comingSoon) {
        for (var i = 1; i <= mod.topicCount; i++) {
          topicIds.push(mod.id + "t" + i);
        }
      }
      var progress = OB.state.getModuleProgress(mod.id, topicIds);
      var progressText = mod.comingSoon ? t("sidebar.comingSoon") : progress.done + "/" + progress.total;

      html += '<div class="sb-module-group">';
      html += '<div class="sb-module-header' + (isExpanded ? " expanded" : "") + '" data-module="' + mod.id + '">';
      html += '<span class="module-arrow">&#9654;</span>';
      html += '<span class="nav-label">M' + modNum + ': ' + OB.ui.esc(mod.title) + '</span>';
      html += '<span class="module-progress">' + progressText + '</span>';
      html += '</div>';

      if (!mod.comingSoon) {
        var exStart = mod.exerciseTopicStart || (mod.topicCount + 1);
        html += '<div class="sb-module-topics' + (isExpanded ? " open" : "") + '" data-topics="' + mod.id + '">';
        for (var ti = 1; ti <= mod.topicCount; ti++) {
          var topicId = mod.id + "t" + ti;
          var topicRoute = "#/topic/" + topicId;
          var isTopicActive = activeRoute === topicRoute;
          var isDone = OB.state.isTopicCompleted(topicId);
          var isExercise = ti >= exStart;
          html += '<div class="sb-nav-item' + (isTopicActive ? " active" : "") + '" data-route="' + topicRoute + '">';
          html += '<span class="nav-check' + (isDone ? " done" : "") + '">&#10003;</span>';
          var topicTitle = topicTitles[topicId];
          if (topicTitle) {
            var prefix = isExercise ? '&#128295; ' : '';
            html += '<span class="nav-label">' + prefix + OB.ui.esc(topicTitle) + '</span>';
          } else if (isExercise) {
            html += '<span class="nav-label">&#128295; ' + t("sidebar.exerciseLabel", { num: ti - exStart + 1 }) + '</span>';
          } else {
            html += '<span class="nav-label">' + t("sidebar.topicLabel", { mod: modNum, topic: ti }) + '</span>';
          }
          html += '</div>';
        }
        // Quiz link
        var quizRoute = "#/quiz/" + mod.id;
        var isQuizActive = activeRoute === quizRoute;
        html += '<div class="sb-nav-item' + (isQuizActive ? " active" : "") + '" data-route="' + quizRoute + '">';
        html += '<span class="nav-icon" style="font-size:12px">&#9997;</span>';
        html += '<span class="nav-label">' + t("sidebar.knowledgeCheck") + '</span>';
        html += '</div>';
        html += '</div>';
      }

      html += '</div>';
    });

    // Glossary
    var glossActive = activeRoute === "#/glossary" ? " active" : "";
    html += '<div class="sb-nav-section">' + t("sidebar.resources") + '</div>';
    html += '<div class="sb-nav-item' + glossActive + '" data-route="#/glossary">';
    html += '<span class="nav-icon">&#128218;</span>';
    html += '<span class="nav-label">' + t("sidebar.glossary") + '</span>';
    html += '</div>';

    nav.innerHTML = html;

    // Show course-specific sections
    var progressSection = document.querySelector(".sb-progress");
    if (progressSection) progressSection.style.display = "";
    var resetSection = document.querySelector(".sb-actions");
    if (resetSection) resetSection.style.display = "";

    // Update logo text for course
    var logoTitle = document.querySelector(".sb-logo-text h2");
    var logoSub = document.querySelector(".sb-logo-text p");
    if (logoTitle) logoTitle.textContent = course.title;
    if (logoSub) logoSub.textContent = OB.i18n.t("app.subtitle");

    // Bind clicks
    nav.querySelectorAll("[data-route]").forEach(function (el) {
      el.addEventListener("click", function () {
        window.location.hash = el.getAttribute("data-route");
        closeMobile();
      });
    });

    nav.querySelectorAll(".sb-module-header").forEach(function (el) {
      el.addEventListener("click", function () {
        var modId = el.getAttribute("data-module");
        expandedModules[modId] = !expandedModules[modId];
        var topics = nav.querySelector('[data-topics="' + modId + '"]');
        if (topics) topics.classList.toggle("open");
        el.classList.toggle("expanded");
      });
    });

    // Back to catalog link
    var backLink = document.getElementById("back-to-catalog");
    if (backLink) {
      backLink.addEventListener("click", function () {
        closeMobile();
        OB.router.goToCatalog();
      });
    }

    updateProgress(course);
  }

  function updateProgress(course) {
    var allIds = [];
    course.modules.forEach(function (mod) {
      if (!mod.comingSoon) {
        for (var i = 1; i <= mod.topicCount; i++) {
          allIds.push(mod.id + "t" + i);
        }
      }
    });
    var prog = OB.state.getCourseProgress(allIds);
    var pct = prog.total > 0 ? Math.round((prog.done / prog.total) * 100) : 0;
    var fill = document.getElementById("progress-fill");
    if (fill) fill.style.width = pct + "%";
    var label = document.querySelector(".sb-progress p");
    if (label) label.textContent = OB.i18n.t("app.courseProgressPct", { pct: pct });
  }

  /* Mobile sidebar */
  function openMobile() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.add("mobile-open");
    if (overlay) overlay.classList.add("active");
  }

  function closeMobile() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (overlay) overlay.classList.remove("active");
  }

  function initMobile() {
    var btn = document.getElementById("mobile-menu-btn");
    var overlay = document.getElementById("sidebar-overlay");
    if (btn) btn.addEventListener("click", openMobile);
    if (overlay) overlay.addEventListener("click", closeMobile);
  }

  OB.sidebar = {
    render: render,
    renderCatalog: renderCatalog,
    updateProgress: updateProgress,
    initMobile: initMobile,
    openMobile: openMobile,
    closeMobile: closeMobile,
  };
})();
