/**
 * OB -- Onboarding -- Dashboard View
 * =====================================
 * Course overview with module cards, progress, and continue banner.
 * Also renders the multi-course catalog when no course is selected.
 * Attached to window.OB.dashboard.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  /* ============================================================
     Catalog View (no course selected)
     ============================================================ */
  function renderCatalog(catalog) {
    var esc = OB.ui.esc;
    var t = OB.i18n.t;
    var html = "";

    // Header
    html += '<div class="catalog-header">';
    html += '<h1>' + esc(t("catalog.title")) + '</h1>';
    html += '<p class="subtitle">' + esc(t("catalog.subtitle")) + '</p>';
    html += '</div>';

    // Product families
    catalog.families.forEach(function (family) {
      html += '<div class="catalog-family" data-family="' + family.id + '">';
      html += '<div class="catalog-family-header">';
      html += '<span class="catalog-family-icon" style="color:' + family.color + '">' + family.icon + '</span>';
      html += '<h2>' + esc(family.name) + '</h2>';
      html += '<span class="catalog-family-count">' + t("catalog.courses", { count: family.courses.length }) + '</span>';
      html += '<button class="catalog-import-link" data-import-family="' + family.id + '" title="Import SCORM package">&#128229; Import</button>';
      html += '<button class="catalog-manage-link" data-manage-family="' + family.id + '" title="Manage courses">&#9881; Manage</button>';
      html += '</div>';

      html += '<div class="catalog-grid">';
      family.courses.forEach(function (course) {
        var isComingSoon = course.comingSoon;
        html += '<div class="catalog-card' + (isComingSoon ? " coming-soon" : " card-clickable") + '"' +
          (isComingSoon ? "" : ' data-course="' + course.id + '"') + '>';

        // Card header with family accent
        html += '<div class="catalog-card-header" style="border-color:' + family.color + '">';
        html += '<span class="catalog-card-title">' + esc(course.title) + '</span>';
        if (isComingSoon) {
          html += '<span class="catalog-badge coming-soon-badge">' + t("catalog.comingSoon") + '</span>';
        }
        html += '</div>';

        // Description
        html += '<p class="catalog-card-desc">' + esc(course.description) + '</p>';

        // Meta
        html += '<div class="catalog-card-meta">';
        if (course.modules > 0) {
          html += '<span>' + course.modules + ' ' + t("sidebar.modules").toLowerCase() + '</span>';
        }
        html += '<span>~' + course.estimatedHours + 'h</span>';
        if (course.locales && course.locales.length > 1) {
          html += '<span>' + course.locales.length + ' ' + t("catalog.languages") + '</span>';
        }
        html += '</div>';

        // Prerequisite badge
        if (course.prerequisite) {
          html += '<div class="catalog-card-prereq">';
          html += '<span class="prereq-label">' + t("catalog.prerequisite") + ':</span> ';
          html += '<span class="prereq-course">' + esc(getCourseTitleById(catalog, course.prerequisite)) + '</span>';
          html += '</div>';
        }

        // Author mode link + Export link
        if (!isComingSoon) {
          html += '<div class="catalog-card-actions">';
          var editUrl = window.location.origin + window.location.pathname + '?course=' + course.id + '&edit=true';
          html += '<a class="catalog-author-link" href="' + editUrl + '" target="_blank" title="Open in author mode">&#9998; Author</a>';
          html += '<button class="catalog-export-link" data-export-course="' + course.id + '" title="Export as standalone app">&#128230; Export</button>';
          html += '</div>';
        }

        html += '</div>';
      });
      html += '</div>';
      html += '</div>';
    });

    // Reference link
    html += '<a class="catalog-reference" href="windchill-ai-journey.html" target="_blank">';
    html += '<span class="catalog-ref-icon">&#128218;</span>';
    html += '<div class="catalog-ref-body">';
    html += '<span class="catalog-ref-title">Exploring AI for Windchill Enablement</span>';
    html += '<span class="catalog-ref-desc">The journey, approach, and lessons learned from building AI-powered training content</span>';
    html += '</div>';
    html += '<span class="catalog-ref-arrow">&#8594;</span>';
    html += '</a>';

    OB.ui.setMain(html);

    // Stop author/export link clicks from triggering card navigation
    document.querySelectorAll(".catalog-author-link").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    });

    // Export link click → open export modal
    document.querySelectorAll(".catalog-export-link").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var courseId = btn.getAttribute("data-export-course");
        if (OB["export"]) OB["export"].openModal({ courseId: courseId });
      });
    });

    // Import link click → open import modal
    document.querySelectorAll(".catalog-import-link").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var familyId = btn.getAttribute("data-import-family");
        if (OB["import"]) OB["import"].openModal({ familyId: familyId });
      });
    });

    // Manage link click → open catalog manager
    document.querySelectorAll(".catalog-manage-link").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var familyId = btn.getAttribute("data-manage-family");
        if (OB.catalogManager) OB.catalogManager.open(familyId);
      });
    });

    // Bind card clicks
    document.querySelectorAll("[data-course]").forEach(function (el) {
      el.addEventListener("click", function () {
        OB.router.goToCourse(el.getAttribute("data-course"));
      });
    });
  }

  /**
   * Find a course title by ID across all families.
   */
  function getCourseTitleById(catalog, courseId) {
    for (var i = 0; i < catalog.families.length; i++) {
      var fam = catalog.families[i];
      for (var j = 0; j < fam.courses.length; j++) {
        if (fam.courses[j].id === courseId) return fam.courses[j].title;
      }
    }
    return courseId;
  }

  /* ============================================================
     Course Dashboard View (course selected)
     ============================================================ */
  function render(course) {
    var esc = OB.ui.esc;
    var t = OB.i18n.t;
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
        html += '<div class="continue-label">' + t("dashboard.continueLabel") + '</div>';
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
    html += '<div class="stat-card"><div class="stat-value">' + pct + '%</div><div class="stat-label">' + t("dashboard.statComplete") + '</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + prog.done + '/' + prog.total + '</div><div class="stat-label">' + t("dashboard.statTopics") + '</div></div>';
    html += '<div class="stat-card"><div class="stat-value">~' + totalMin + 'm</div><div class="stat-label">' + t("dashboard.statEstimated") + '</div></div>';
    html += '</div>';

    // Engagement section (badges, streak, activity)
    if (OB.celebrate) {
      html += OB.celebrate.renderDashboardSection(course);
    }

    // Module cards
    html += '<h2 class="mb-md">' + t("dashboard.modules") + '</h2>';
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
      html += '<div class="module-num">' + (mod.comingSoon ? t("dashboard.moduleComingSoon", { num: modNum }) : t("dashboard.moduleNum", { num: modNum })) + '</div>';
      html += '<div class="module-title">' + esc(mod.title) + '</div>';
      html += '<div class="module-desc">' + esc(mod.description) + '</div>';
      html += '<div class="module-meta">';
      if (!mod.comingSoon) {
        html += '<span>' + t("dashboard.topicsProgress", { done: mp.done, total: mp.total }) + '</span>';
        html += '<div class="module-progress-bar"><div class="module-progress-fill" style="width:' + mpPct + '%"></div></div>';
      }
      html += '<span>' + t("dashboard.estimatedMin", { min: mod.estimatedMinutes || 0 }) + '</span>';
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
    var t = OB.i18n.t;
    var parts = hash.replace("#/", "").split("/");
    if (parts[0] === "topic") {
      var tLabel = (parts[1] || "").replace("m", "M").replace("t", ".");
      return t("dashboard.routeTopic", { label: tLabel });
    }
    if (parts[0] === "module") {
      var mLabel = (parts[1] || "").replace("m", "M");
      return t("dashboard.routeModule", { label: mLabel });
    }
    if (parts[0] === "quiz") {
      var qLabel = (parts[1] || "").replace("m", "M");
      return t("dashboard.routeQuiz", { label: qLabel });
    }
    if (parts[0] === "glossary") return t("dashboard.routeGlossary");
    return null;
  }

  OB.dashboard = { render: render, renderCatalog: renderCatalog };
})();
