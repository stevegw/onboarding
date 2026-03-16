/**
 * OB -- Onboarding -- Celebration & Engagement System
 * =====================================================
 * Badges, streaks, particle bursts, toasts, and completion modals.
 * Attached to window.OB.celebrate.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  /* Badge definitions */
  var BADGES = [
    { id: "first-topic",    icon: "\uD83C\uDFC1", name: "First Step" },
    { id: "five-topics",    icon: "\u2B50",        name: "Getting Going" },
    { id: "halfway",        icon: "\uD83D\uDCC8", name: "Halfway There" },
    { id: "module-master",  icon: "\uD83C\uDFC6", name: "Module Master" },
    { id: "perfect-quiz",   icon: "\uD83D\uDCAF", name: "Perfect Score" },
    { id: "all-quizzes",    icon: "\uD83D\uDE80", name: "Quiz Champion" },
    { id: "course-complete", icon: "\uD83C\uDF93", name: "Graduate" },
    { id: "streak-3",       icon: "\uD83D\uDD25", name: "On Fire" },
    { id: "streak-7",       icon: "\u26A1",        name: "Week Warrior" },
  ];

  var STREAK_KEY = "ob_streaks";
  var activeToast = null;
  var toastTimer = null;

  /* ============================================================
     State helpers
     ============================================================ */
  function getStreakData() {
    return OB.state.load(STREAK_KEY) || { lastActiveDate: null, currentStreak: 0, longestStreak: 0 };
  }

  function saveStreakData(data) {
    OB.state.save(STREAK_KEY, data);
  }

  function getBadges() {
    return OB.state.load(OB.state.GLOBAL_KEYS ? undefined : null) || {};
  }

  // Per-course badges using the state key helper
  function getBadgesForCourse() {
    var k = courseKey("badges");
    return OB.state.load(k) || {};
  }

  function saveBadgesForCourse(badges) {
    OB.state.save(courseKey("badges"), badges);
  }

  function getActivity() {
    var k = courseKey("activity");
    return OB.state.load(k) || { todayTopics: 0, todayDate: null };
  }

  function saveActivity(act) {
    OB.state.save(courseKey("activity"), act);
  }

  // Build the per-course localStorage key (mirrors state.js key() logic)
  function courseKey(name) {
    var courseId = OB.content.getCourseId ? OB.content.getCourseId() : null;
    var prefix = courseId ? ("ob_" + courseId + "_") : "ob_";
    return prefix + name;
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  /* ============================================================
     Init
     ============================================================ */
  function init() {
    var streak = getStreakData();
    var today = todayStr();

    // If new day, update streak
    if (streak.lastActiveDate && streak.lastActiveDate !== today) {
      var last = new Date(streak.lastActiveDate);
      var now = new Date(today);
      var diffMs = now.getTime() - last.getTime();
      var diffDays = Math.round(diffMs / 86400000);
      if (diffDays === 1) {
        // Consecutive day — streak continues (will be incremented on first topic complete)
      } else if (diffDays > 1) {
        // Streak broken
        streak.currentStreak = 0;
      }
      saveStreakData(streak);
    }

    // Reset daily counter if new day
    var act = getActivity();
    if (act.todayDate !== today) {
      act.todayTopics = 0;
      act.todayDate = today;
      saveActivity(act);
    }
  }

  /* ============================================================
     Topic completion handler
     ============================================================ */
  function onTopicComplete(topicId, course) {
    var today = todayStr();
    var badges = getBadgesForCourse();
    var streak = getStreakData();
    var newBadges = [];

    // Update streak
    if (streak.lastActiveDate !== today) {
      if (streak.lastActiveDate) {
        var last = new Date(streak.lastActiveDate);
        var now = new Date(today);
        var diffDays = Math.round((now.getTime() - last.getTime()) / 86400000);
        if (diffDays === 1) {
          streak.currentStreak++;
        } else {
          streak.currentStreak = 1;
        }
      } else {
        streak.currentStreak = 1;
      }
      streak.lastActiveDate = today;
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
      saveStreakData(streak);
    }

    // Update daily activity
    var act = getActivity();
    if (act.todayDate !== today) {
      act.todayTopics = 0;
      act.todayDate = today;
    }
    act.todayTopics++;
    saveActivity(act);

    // Count completed topics
    var allIds = [];
    course.modules.forEach(function (mod) {
      if (!mod.comingSoon) {
        for (var i = 1; i <= mod.topicCount; i++) {
          allIds.push(mod.id + "t" + i);
        }
      }
    });
    var topics = OB.state.getTopics();
    var completedCount = 0;
    allIds.forEach(function (id) {
      if (topics[id] && topics[id].completed) completedCount++;
    });

    // Check badges
    if (!badges["first-topic"] && completedCount >= 1) {
      badges["first-topic"] = new Date().toISOString();
      newBadges.push(findBadge("first-topic"));
    }
    if (!badges["five-topics"] && completedCount >= 5) {
      badges["five-topics"] = new Date().toISOString();
      newBadges.push(findBadge("five-topics"));
    }
    if (!badges["halfway"] && completedCount >= Math.ceil(allIds.length / 2)) {
      badges["halfway"] = new Date().toISOString();
      newBadges.push(findBadge("halfway"));
    }

    // Check streak badges
    if (!badges["streak-3"] && streak.currentStreak >= 3) {
      badges["streak-3"] = new Date().toISOString();
      newBadges.push(findBadge("streak-3"));
    }
    if (!badges["streak-7"] && streak.currentStreak >= 7) {
      badges["streak-7"] = new Date().toISOString();
      newBadges.push(findBadge("streak-7"));
    }

    // Check module master: all topics in any module
    var moduleComplete = false;
    var completedModuleId = null;
    course.modules.forEach(function (mod) {
      if (mod.comingSoon) return;
      var modTopicIds = [];
      for (var i = 1; i <= mod.topicCount; i++) {
        modTopicIds.push(mod.id + "t" + i);
      }
      var allDone = modTopicIds.every(function (id) { return topics[id] && topics[id].completed; });
      if (allDone) {
        // Check if current topic is in this module
        if (modTopicIds.indexOf(topicId) !== -1) {
          moduleComplete = true;
          completedModuleId = mod.id;
        }
        if (!badges["module-master"]) {
          badges["module-master"] = new Date().toISOString();
          newBadges.push(findBadge("module-master"));
        }
      }
    });

    // Check course complete
    var courseComplete = completedCount === allIds.length;
    if (courseComplete && !badges["course-complete"]) {
      badges["course-complete"] = new Date().toISOString();
      newBadges.push(findBadge("course-complete"));
    }

    saveBadgesForCourse(badges);

    // Fire celebrations
    var completeBtn = document.getElementById("complete-btn") || document.getElementById("uncomplete-btn");
    if (completeBtn) {
      showTopicCelebration(completeBtn);
    }

    // Show badge toasts
    newBadges.forEach(function (badge, i) {
      setTimeout(function () {
        showToast(badge.icon + " " + t("celebrate.badgeEarned") + ": " + getBadgeName(badge.id), 3000);
      }, 800 + i * 3500);
    });

    // Module / course completion modals (after a short delay for particles)
    if (courseComplete) {
      setTimeout(function () { showCourseCelebration(course); }, 1200);
    } else if (moduleComplete && completedModuleId) {
      setTimeout(function () { showModuleCelebration(completedModuleId, course); }, 1200);
    }
  }

  /* ============================================================
     Quiz completion handler
     ============================================================ */
  function onQuizComplete(moduleId, score, total) {
    var badges = getBadgesForCourse();
    var newBadges = [];

    // Perfect quiz
    if (score === total && !badges["perfect-quiz"]) {
      badges["perfect-quiz"] = new Date().toISOString();
      newBadges.push(findBadge("perfect-quiz"));
    }

    // All quizzes completed — check if all modules have quiz results
    var course = null;
    // We need course data; try sync check
    OB.content.getCourse().then(function (c) {
      course = c;
      var allQuizDone = true;
      c.modules.forEach(function (mod) {
        if (mod.comingSoon) return;
        if (!OB.state.getQuizResult(mod.id)) allQuizDone = false;
      });
      if (allQuizDone && !badges["all-quizzes"]) {
        badges["all-quizzes"] = new Date().toISOString();
        newBadges.push(findBadge("all-quizzes"));
      }
      saveBadgesForCourse(badges);

      newBadges.forEach(function (badge, i) {
        setTimeout(function () {
          showToast(badge.icon + " " + t("celebrate.badgeEarned") + ": " + getBadgeName(badge.id), 3000);
        }, 500 + i * 3500);
      });
    });
  }

  /* ============================================================
     Particle burst (canvas-based)
     ============================================================ */
  function showTopicCelebration(buttonEl) {
    var rect = buttonEl.getBoundingClientRect();
    var canvas = document.createElement("canvas");
    var size = 200;
    canvas.width = size;
    canvas.height = size;
    canvas.style.cssText = "position:fixed;pointer-events:none;z-index:10001;" +
      "left:" + (rect.left + rect.width / 2 - size / 2) + "px;" +
      "top:" + (rect.top + rect.height / 2 - size / 2) + "px;";
    document.body.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#c084fc", "#f472b6"];
    var particles = [];
    for (var i = 0; i < 16; i++) {
      var angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.5;
      var speed = 2 + Math.random() * 3;
      particles.push({
        x: size / 2,
        y: size / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        r: 3 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }

    var start = performance.now();
    var duration = 700;

    function frame(now) {
      var elapsed = now - start;
      if (elapsed > duration) {
        document.body.removeChild(canvas);
        return;
      }
      ctx.clearRect(0, 0, size, size);
      var progress = elapsed / duration;
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravity
        p.life = 1 - progress;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ============================================================
     Module completion modal
     ============================================================ */
  function showModuleCelebration(moduleId, course) {
    var mod = course.modules.find(function (m) { return m.id === moduleId; });
    if (!mod) return;
    var modIdx = parseInt(moduleId.replace("m", ""), 10);
    var badges = getBadgesForCourse();
    var earnedBadges = BADGES.filter(function (b) { return badges[b.id]; });

    var html = '<div class="celebrate-modal" id="celebrate-modal">';
    html += '<div class="celebrate-modal-content">';
    html += '<div class="celebrate-modal-icon">\uD83C\uDFC6</div>';
    html += '<h2 class="celebrate-modal-title">' + t("celebrate.moduleDone", { num: modIdx }) + '</h2>';
    html += '<p class="celebrate-modal-subtitle">' + OB.ui.esc(mod.title) + '</p>';

    // Stats
    html += '<div class="celebrate-modal-stats">';
    html += '<div class="celebrate-modal-stat"><div class="celebrate-modal-stat-value">' + mod.topicCount + '</div><div class="celebrate-modal-stat-label">' + t("dashboard.statTopics") + '</div></div>';
    var quizResult = OB.state.getQuizResult(moduleId);
    if (quizResult) {
      html += '<div class="celebrate-modal-stat"><div class="celebrate-modal-stat-value">' + quizResult.bestScore + '/' + quizResult.total + '</div><div class="celebrate-modal-stat-label">' + t("quiz.seeResults").replace("See ", "") + '</div></div>';
    }
    html += '</div>';

    // Earned badges
    if (earnedBadges.length > 0) {
      html += '<div class="celebrate-modal-badges">';
      earnedBadges.forEach(function (b) {
        html += '<span class="celebrate-modal-badge" title="' + getBadgeName(b.id) + '">' + b.icon + '</span>';
      });
      html += '</div>';
    }

    html += '<div class="celebrate-modal-actions">';
    html += '<button class="btn btn-primary" id="celebrate-continue">' + t("celebrate.continue") + '</button>';
    html += '</div>';
    html += '</div></div>';

    var container = document.getElementById("celebrate-modal-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "celebrate-modal-container";
      document.body.appendChild(container);
    }
    container.innerHTML = html;

    // Fire particles on modal
    setTimeout(function () {
      var modalContent = container.querySelector(".celebrate-modal-content");
      if (modalContent) showTopicCelebration(modalContent);
    }, 300);

    // Bind dismiss
    var modal = document.getElementById("celebrate-modal");
    var continueBtn = document.getElementById("celebrate-continue");
    function dismiss() { container.innerHTML = ""; }
    if (continueBtn) continueBtn.addEventListener("click", dismiss);
    if (modal) modal.addEventListener("click", function (e) {
      if (e.target === modal) dismiss();
    });
  }

  /* ============================================================
     Course completion modal
     ============================================================ */
  function showCourseCelebration(course) {
    var badges = getBadgesForCourse();
    var earnedBadges = BADGES.filter(function (b) { return badges[b.id]; });

    var allIds = [];
    course.modules.forEach(function (mod) {
      if (!mod.comingSoon) {
        for (var i = 1; i <= mod.topicCount; i++) allIds.push(mod.id + "t" + i);
      }
    });

    var html = '<div class="celebrate-modal" id="celebrate-modal">';
    html += '<div class="celebrate-modal-content">';
    html += '<div class="celebrate-modal-icon">\uD83C\uDF93</div>';
    html += '<h2 class="celebrate-modal-title">' + t("celebrate.courseComplete") + '</h2>';
    html += '<p class="celebrate-modal-subtitle">' + OB.ui.esc(course.title) + '</p>';

    // Stats
    html += '<div class="celebrate-modal-stats">';
    html += '<div class="celebrate-modal-stat"><div class="celebrate-modal-stat-value">' + allIds.length + '</div><div class="celebrate-modal-stat-label">' + t("dashboard.statTopics") + '</div></div>';
    html += '<div class="celebrate-modal-stat"><div class="celebrate-modal-stat-value">' + course.modules.length + '</div><div class="celebrate-modal-stat-label">' + t("dashboard.modules") + '</div></div>';
    html += '<div class="celebrate-modal-stat"><div class="celebrate-modal-stat-value">' + earnedBadges.length + '</div><div class="celebrate-modal-stat-label">' + t("celebrate.badgesTitle") + '</div></div>';
    html += '</div>';

    // All badges
    if (earnedBadges.length > 0) {
      html += '<div class="celebrate-modal-badges">';
      earnedBadges.forEach(function (b) {
        html += '<span class="celebrate-modal-badge" title="' + getBadgeName(b.id) + '">' + b.icon + '</span>';
      });
      html += '</div>';
    }

    html += '<div class="celebrate-modal-actions">';
    html += '<button class="btn btn-primary" id="celebrate-continue">' + t("celebrate.backToDashboard") + '</button>';
    html += '</div>';
    html += '</div></div>';

    var container = document.getElementById("celebrate-modal-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "celebrate-modal-container";
      document.body.appendChild(container);
    }
    container.innerHTML = html;

    // Big particle burst
    setTimeout(function () {
      var modalContent = container.querySelector(".celebrate-modal-content");
      if (modalContent) {
        showTopicCelebration(modalContent);
        setTimeout(function () { showTopicCelebration(modalContent); }, 200);
      }
    }, 300);

    var modal = document.getElementById("celebrate-modal");
    var continueBtn = document.getElementById("celebrate-continue");
    function dismiss() {
      container.innerHTML = "";
      window.location.hash = "#/";
    }
    if (continueBtn) continueBtn.addEventListener("click", dismiss);
    if (modal) modal.addEventListener("click", function (e) {
      if (e.target === modal) dismiss();
    });
  }

  /* ============================================================
     Toast
     ============================================================ */
  function showToast(message, duration) {
    duration = duration || 3000;
    var container = document.getElementById("celebrate-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "celebrate-toast-container";
      container.className = "celebrate-toast-container";
      document.body.appendChild(container);
    }

    // Remove existing toast
    if (activeToast) {
      try { container.removeChild(activeToast); } catch (e) {}
      clearTimeout(toastTimer);
      activeToast = null;
    }

    var toast = document.createElement("div");
    toast.className = "celebrate-toast";
    toast.textContent = message;
    container.appendChild(toast);
    activeToast = toast;

    toastTimer = setTimeout(function () {
      toast.classList.add("hiding");
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        if (activeToast === toast) activeToast = null;
      }, 250);
    }, duration);
  }

  /* ============================================================
     Dashboard section renderer
     ============================================================ */
  function renderDashboardSection(course) {
    var streak = getStreakData();
    var badges = getBadgesForCourse();
    var act = getActivity();
    var today = todayStr();
    var html = '';

    // Streak widget
    var isActive = streak.currentStreak > 0 && streak.lastActiveDate === today;
    html += '<div class="celebrate-section">';
    html += '<div class="streak-widget' + (isActive ? " active" : "") + '">';
    html += '<span class="streak-icon">' + (isActive ? "\uD83D\uDD25" : "\u2744\uFE0F") + '</span>';
    if (streak.currentStreak > 0) {
      html += '<span class="streak-count">' + streak.currentStreak + '</span> ';
      html += '<span>' + t("celebrate.streakDays") + '</span>';
    } else {
      html += '<span>' + t("celebrate.noStreakYet") + '</span>';
    }
    html += '</div>';

    // Activity
    if (act.todayDate === today && act.todayTopics > 0) {
      html += '<div class="celebrate-activity">' + t("celebrate.todayTopics", { count: act.todayTopics }) + '</div>';
    }

    // Badge shelf
    html += '<div class="celebrate-section-title">' + t("celebrate.badgesTitle") + '</div>';
    html += '<div class="badge-shelf">';
    BADGES.forEach(function (badge) {
      var earned = !!badges[badge.id];
      html += '<div class="badge-item' + (earned ? " earned" : " locked") + '" title="' + getBadgeName(badge.id) + (earned ? " \u2714" : " — " + t("celebrate.badgeLocked")) + '">';
      html += '<span class="badge-icon">' + badge.icon + '</span>';
      html += '<span class="badge-name">' + getBadgeName(badge.id) + '</span>';
      html += '</div>';
    });
    html += '</div>';
    html += '</div>';

    return html;
  }

  /* ============================================================
     Helpers
     ============================================================ */
  function findBadge(id) {
    return BADGES.find(function (b) { return b.id === id; }) || { id: id, icon: "?", name: id };
  }

  function getBadgeName(id) {
    var key = "badge." + id;
    var translated = t(key);
    // If i18n returns the key itself, fall back to hardcoded name
    if (translated === key) {
      var b = findBadge(id);
      return b ? b.name : id;
    }
    return translated;
  }

  function t(key, vars) {
    if (OB.i18n && OB.i18n.t) return OB.i18n.t(key, vars);
    return key;
  }

  /* ============================================================
     Public API
     ============================================================ */
  OB.celebrate = {
    init: init,
    onTopicComplete: onTopicComplete,
    onQuizComplete: onQuizComplete,
    showToast: showToast,
    renderDashboardSection: renderDashboardSection,
    getBadges: getBadgesForCourse,
    getStreakData: getStreakData,
  };
})();
