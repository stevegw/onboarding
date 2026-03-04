/**
 * OB -- Onboarding -- State Management
 * ======================================
 * localStorage persistence for progress, quiz results, and preferences.
 * Attached to window.OB.state.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var KEYS = {
    topics: "ob_topics",
    quizzes: "ob_quizzes",
    exercises: "ob_exercises",
    currentRoute: "ob_currentRoute",
    notepad: "ob_notepad",
    notepadOpen: "ob_notepad_open",
    theme: "ob_theme",
    locale: "ob_locale",
  };

  function load(key) {
    try {
      var val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch (e) { return null; }
  }

  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
  }

  function loadRaw(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function saveRaw(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* ignore */ }
  }

  /* Topics progress */
  function getTopics() {
    return load(KEYS.topics) || {};
  }

  function isTopicCompleted(topicId) {
    var topics = getTopics();
    return !!(topics[topicId] && topics[topicId].completed);
  }

  function completeTopic(topicId) {
    var topics = getTopics();
    topics[topicId] = { completed: true, completedAt: new Date().toISOString() };
    save(KEYS.topics, topics);
  }

  function uncompleteTopic(topicId) {
    var topics = getTopics();
    delete topics[topicId];
    save(KEYS.topics, topics);
  }

  /* Quiz results */
  function getQuizzes() {
    return load(KEYS.quizzes) || {};
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
    save(KEYS.quizzes, quizzes);
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
    return load(KEYS.exercises) || {};
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
    save(KEYS.exercises, data);
  }

  function uncompleteStep(exerciseId, taskId, stepIdx) {
    var data = getExercises();
    if (!data[exerciseId] || !data[exerciseId].steps) return;
    delete data[exerciseId].steps[taskId + "-" + stepIdx];
    save(KEYS.exercises, data);
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

  /* Route memory */
  function saveRoute(hash) {
    saveRaw(KEYS.currentRoute, hash);
  }

  function getLastRoute() {
    return loadRaw(KEYS.currentRoute) || "";
  }

  /* Reset */
  function resetAll() {
    Object.keys(KEYS).forEach(function (k) {
      try { localStorage.removeItem(KEYS[k]); } catch (e) { /* ignore */ }
    });
  }

  OB.state = {
    KEYS: KEYS,
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
    getModuleProgress: getModuleProgress,
    getCourseProgress: getCourseProgress,
    saveRoute: saveRoute,
    getLastRoute: getLastRoute,
    resetAll: resetAll,
  };
})();
