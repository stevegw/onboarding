/**
 * OB -- Onboarding -- Dashboard View
 * =====================================
 * Course overview with module cards, progress, and continue banner.
 * Attached to window.OB.dashboard.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  function render(course) {
    var esc = OB.ui.esc;
    var html = "";

    // Header
    html += '<div class="dashboard-header">';
    html += '<h1>' + esc(course.title) + '</h1>';
    html += '<p class="subtitle">' + esc(course.description) + '</p>';
    html += '</div>';

    // Continue banner
    var lastRoute = OB.state.getLastRoute();
    if (lastRoute && lastRoute !== "#/" && lastRoute !== "") {
      var label = routeToLabel(lastRoute);
      if (label) {
        html += '<div class="continue-banner" id="continue-banner">';
        html += '<span class="continue-icon">&#9654;</span>';
        html += '<div class="continue-text">';
        html += '<div class="continue-label">Continue where you left off</div>';
        html += '<div class="continue-title">' + esc(label) + '</div>';
        html += '</div>';
        html += '</div>';
      }
    }

    // Stats
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
    var totalMin = 0;
    course.modules.forEach(function (m) { totalMin += m.estimatedMinutes || 0; });

    html += '<div class="dashboard-stats">';
    html += '<div class="stat-card"><div class="stat-value">' + pct + '%</div><div class="stat-label">Complete</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + prog.done + '/' + prog.total + '</div><div class="stat-label">Topics</div></div>';
    html += '<div class="stat-card"><div class="stat-value">~' + totalMin + 'm</div><div class="stat-label">Estimated</div></div>';
    html += '</div>';

    // Module cards
    html += '<h2 class="mb-md">Modules</h2>';
    html += '<div class="module-grid stagger">';
    course.modules.forEach(function (mod, idx) {
      var modNum = idx + 1;
      var topicIds = [];
      if (!mod.comingSoon) {
        for (var i = 1; i <= mod.topicCount; i++) {
          topicIds.push(mod.id + "t" + i);
        }
      }
      var mp = OB.state.getModuleProgress(mod.id, topicIds);
      var mpPct = mp.total > 0 ? Math.round((mp.done / mp.total) * 100) : 0;

      html += '<div class="module-card' + (mod.comingSoon ? "" : " card-clickable") + '" data-module="' + modNum + '"' + (mod.comingSoon ? "" : ' data-route="#/module/' + mod.id + '"') + '>';
      html += '<div class="module-num">Module ' + modNum + (mod.comingSoon ? " - Coming Soon" : "") + '</div>';
      html += '<div class="module-title">' + esc(mod.title) + '</div>';
      html += '<div class="module-desc">' + esc(mod.description) + '</div>';
      html += '<div class="module-meta">';
      if (!mod.comingSoon) {
        html += '<span>' + mp.done + '/' + mp.total + ' topics</span>';
        html += '<div class="module-progress-bar"><div class="module-progress-fill" style="width:' + mpPct + '%"></div></div>';
      }
      html += '<span>~' + (mod.estimatedMinutes || 0) + ' min</span>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';

    OB.ui.setMain(html);

    // Bind clicks
    document.querySelectorAll("[data-route]").forEach(function (el) {
      el.addEventListener("click", function () {
        window.location.hash = el.getAttribute("data-route");
      });
    });

    var banner = document.getElementById("continue-banner");
    if (banner) {
      banner.addEventListener("click", function () {
        window.location.hash = lastRoute;
      });
    }
  }

  function routeToLabel(hash) {
    if (!hash) return null;
    var parts = hash.replace("#/", "").split("/");
    if (parts[0] === "topic") return "Topic " + (parts[1] || "").replace("m", "M").replace("t", ".");
    if (parts[0] === "module") return "Module " + (parts[1] || "").replace("m", "M");
    if (parts[0] === "quiz") return "Quiz " + (parts[1] || "").replace("m", "M");
    if (parts[0] === "glossary") return "Glossary";
    return null;
  }

  OB.dashboard = { render: render };
})();
