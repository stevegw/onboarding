/**
 * OB -- Onboarding -- Sidebar Navigation
 * =========================================
 * Renders module/topic navigation tree with progress indicators.
 * Attached to window.OB.sidebar.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var expandedModules = {};

  function render(course, activeRoute) {
    var nav = document.getElementById("nav");
    if (!nav) return;

    var html = "";

    // Dashboard link
    var dashActive = (!activeRoute || activeRoute === "#/" || activeRoute === "") ? " active" : "";
    html += '<div class="sb-nav-item' + dashActive + '" data-route="#/">';
    html += '<span class="nav-icon">&#9776;</span>';
    html += '<span class="nav-label">Dashboard</span>';
    html += '</div>';

    // Modules
    html += '<div class="sb-nav-section">Modules</div>';

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
      var progressText = mod.comingSoon ? "Coming soon" : progress.done + "/" + progress.total;

      html += '<div class="sb-module-group">';
      html += '<div class="sb-module-header' + (isExpanded ? " expanded" : "") + '" data-module="' + mod.id + '">';
      html += '<span class="module-arrow">&#9654;</span>';
      html += '<span class="nav-label">M' + modNum + ': ' + OB.ui.esc(mod.title) + '</span>';
      html += '<span class="module-progress">' + progressText + '</span>';
      html += '</div>';

      if (!mod.comingSoon) {
        var exStart = mod.exerciseTopicStart || (mod.topicCount + 1);
        html += '<div class="sb-module-topics' + (isExpanded ? " open" : "") + '" data-topics="' + mod.id + '">';
        for (var t = 1; t <= mod.topicCount; t++) {
          var topicId = mod.id + "t" + t;
          var topicRoute = "#/topic/" + topicId;
          var isTopicActive = activeRoute === topicRoute;
          var isDone = OB.state.isTopicCompleted(topicId);
          var isExercise = t >= exStart;
          html += '<div class="sb-nav-item' + (isTopicActive ? " active" : "") + '" data-route="' + topicRoute + '">';
          html += '<span class="nav-check' + (isDone ? " done" : "") + '">&#10003;</span>';
          if (isExercise) {
            html += '<span class="nav-label">&#128295; Exercise ' + (t - exStart + 1) + '</span>';
          } else {
            html += '<span class="nav-label">Topic ' + modNum + '.' + t + '</span>';
          }
          html += '</div>';
        }
        // Quiz link
        var quizRoute = "#/quiz/" + mod.id;
        var isQuizActive = activeRoute === quizRoute;
        html += '<div class="sb-nav-item' + (isQuizActive ? " active" : "") + '" data-route="' + quizRoute + '">';
        html += '<span class="nav-icon" style="font-size:12px">&#9997;</span>';
        html += '<span class="nav-label">Knowledge Check</span>';
        html += '</div>';
        html += '</div>';
      }

      html += '</div>';
    });

    // Glossary
    var glossActive = activeRoute === "#/glossary" ? " active" : "";
    html += '<div class="sb-nav-section">Resources</div>';
    html += '<div class="sb-nav-item' + glossActive + '" data-route="#/glossary">';
    html += '<span class="nav-icon">&#128218;</span>';
    html += '<span class="nav-label">Glossary</span>';
    html += '</div>';

    nav.innerHTML = html;

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
    if (label) label.textContent = "Course Progress: " + pct + "%";
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
    updateProgress: updateProgress,
    initMobile: initMobile,
    openMobile: openMobile,
    closeMobile: closeMobile,
  };
})();
