/**
 * OB -- Onboarding -- State Management
 * ======================================
 * localStorage persistence for progress, quiz results, and preferences.
 * Per-course namespacing: topic/quiz/exercise/notepad/route keys are prefixed
 * with the course ID. Theme and locale are global.
 * Attached to window.OB.state.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var coursePrefix = "ob_";

  /* Global keys (not per-course) */
  var GLOBAL_KEYS = {
    theme: "ob_theme",
    locale: "ob_locale",
    scheme: "ob_scheme",
  };

  /**
   * Set the active course for state namespacing.
   */
  function setCourse(id) {
    coursePrefix = id ? ("ob_" + id + "_") : "ob_";
  }

  /**
   * Get per-course key names (computed from current prefix).
   */
  function key(name) {
    return coursePrefix + name;
  }

  function load(k) {
    try {
      var val = localStorage.getItem(k);
      return val ? JSON.parse(val) : null;
    } catch (e) { return null; }
  }

  function save(k, val) {
    try { localStorage.setItem(k, JSON.stringify(val)); } catch (e) { /* ignore */ }
  }

  function loadRaw(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }

  function saveRaw(k, val) {
    try { localStorage.setItem(k, val); } catch (e) { /* ignore */ }
  }

  /* Topics progress */
  function getTopics() {
    return load(key("topics")) || {};
  }

  function isTopicCompleted(topicId) {
    var topics = getTopics();
    return !!(topics[topicId] && topics[topicId].completed);
  }

  function completeTopic(topicId) {
    var topics = getTopics();
    topics[topicId] = { completed: true, completedAt: new Date().toISOString() };
    save(key("topics"), topics);
  }

  function uncompleteTopic(topicId) {
    var topics = getTopics();
    delete topics[topicId];
    save(key("topics"), topics);
  }

  /* Quiz results */
  function getQuizzes() {
    return load(key("quizzes")) || {};
  }

  function getQuizResult(moduleId) {
    var quizzes = getQuizzes();
    return quizzes[moduleId] || null;
  }

  function saveQuizResult(moduleId, score, total) {
    var quizzes = getQuizzes();
    var prev = quizzes[moduleId];
    var best = score;
    if (prev && prev.bestScore > score) best = prev.bestScore;
    quizzes[moduleId] = {
      bestScore: best,
      lastScore: score,
      total: total,
      lastAttempt: new Date().toISOString(),
    };
    save(key("quizzes"), quizzes);
  }

  /* Module progress: count completed topics / total */
  function getModuleProgress(moduleId, topicIds) {
    var topics = getTopics();
    var done = 0;
    topicIds.forEach(function (id) {
      if (topics[id] && topics[id].completed) done++;
    });
    return { done: done, total: topicIds.length };
  }

  /* Overall course progress */
  function getCourseProgress(allTopicIds) {
    var topics = getTopics();
    var done = 0;
    allTopicIds.forEach(function (id) {
      if (topics[id] && topics[id].completed) done++;
    });
    return { done: done, total: allTopicIds.length };
  }

  /* Exercise step progress */
  function getExercises() {
    return load(key("exercises")) || {};
  }

  function isStepDone(exerciseId, taskId, stepIdx) {
    var data = getExercises();
    var ex = data[exerciseId];
    if (!ex || !ex.steps) return false;
    return !!ex.steps[taskId + "-" + stepIdx];
  }

  function completeStep(exerciseId, taskId, stepIdx) {
    var data = getExercises();
    if (!data[exerciseId]) data[exerciseId] = { steps: {} };
    data[exerciseId].steps[taskId + "-" + stepIdx] = true;
    save(key("exercises"), data);
  }

  function uncompleteStep(exerciseId, taskId, stepIdx) {
    var data = getExercises();
    if (!data[exerciseId] || !data[exerciseId].steps) return;
    delete data[exerciseId].steps[taskId + "-" + stepIdx];
    save(key("exercises"), data);
  }

  function getExerciseProgress(exerciseId, tasks) {
    var data = getExercises();
    var ex = data[exerciseId];
    var done = 0;
    var total = 0;
    tasks.forEach(function (task) {
      task.steps.forEach(function (_step, idx) {
        total++;
        if (ex && ex.steps && ex.steps[task.id + "-" + idx]) done++;
      });
    });
    return { done: done, total: total };
  }

  /* Exact-steps progress (separate from main exercise progress) */
  function getExactSteps() {
    return load(key("exactSteps")) || {};
  }

  function getExactStepProgress(exerciseId, tasks) {
    var data = getExactSteps();
    var ex = data[exerciseId];
    var done = 0;
    var total = 0;
    tasks.forEach(function (task) {
      task.steps.forEach(function (_step, idx) {
        total++;
        if (ex && ex.steps && ex.steps[task.id + "-" + idx]) done++;
      });
    });
    return { done: done, total: total };
  }

  function isExactStepDone(exerciseId, taskId, stepIdx) {
    var data = getExactSteps();
    var ex = data[exerciseId];
    if (!ex || !ex.steps) return false;
    return !!ex.steps[taskId + "-" + stepIdx];
  }

  function completeExactStep(exerciseId, taskId, stepIdx) {
    var data = getExactSteps();
    if (!data[exerciseId]) data[exerciseId] = { steps: {} };
    data[exerciseId].steps[taskId + "-" + stepIdx] = true;
    save(key("exactSteps"), data);
  }

  function uncompleteExactStep(exerciseId, taskId, stepIdx) {
    var data = getExactSteps();
    if (!data[exerciseId] || !data[exerciseId].steps) return;
    delete data[exerciseId].steps[taskId + "-" + stepIdx];
    save(key("exactSteps"), data);
  }

  /* Route memory (per-course) */
  function saveRoute(hash) {
    saveRaw(key("currentRoute"), hash);
  }

  function getLastRoute() {
    return loadRaw(key("currentRoute")) || "";
  }

  /* Notepad (per-course) */
  function getNotepadKey() {
    return key("notepad");
  }

  function getNotepadOpenKey() {
    return key("notepad_open");
  }

  /* Reset current course progress */
  function resetAll() {
    var keysToRemove = ["topics", "quizzes", "exercises", "exactSteps", "currentRoute", "notepad", "notepad_open", "badges", "activity"];
    keysToRemove.forEach(function (k) {
      try { localStorage.removeItem(key(k)); } catch (e) { /* ignore */ }
    });
  }

  OB.state = {
    GLOBAL_KEYS: GLOBAL_KEYS,
    setCourse: setCourse,
    load: load,
    save: save,
    loadRaw: loadRaw,
    saveRaw: saveRaw,
    getTopics: getTopics,
    isTopicCompleted: isTopicCompleted,
    completeTopic: completeTopic,
    uncompleteTopic: uncompleteTopic,
    getQuizzes: getQuizzes,
    getQuizResult: getQuizResult,
    saveQuizResult: saveQuizResult,
    isStepDone: isStepDone,
    completeStep: completeStep,
    uncompleteStep: uncompleteStep,
    getExerciseProgress: getExerciseProgress,
    getExactStepProgress: getExactStepProgress,
    isExactStepDone: isExactStepDone,
    completeExactStep: completeExactStep,
    uncompleteExactStep: uncompleteExactStep,
    getModuleProgress: getModuleProgress,
    getCourseProgress: getCourseProgress,
    saveRoute: saveRoute,
    getLastRoute: getLastRoute,
    getNotepadKey: getNotepadKey,
    getNotepadOpenKey: getNotepadOpenKey,
    resetAll: resetAll,
  };
})();
