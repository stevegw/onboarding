/**
 * OB -- Onboarding -- Content Loader
 * ====================================
 * Loads content from the embedded bundle (OB._bundle) for file:// compatibility.
 * Falls back to fetch() if bundle is missing (HTTP server mode).
 * Attached to window.OB.content.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var cache = {};
  var courseData = null;

  function loadJSON(path) {
    if (cache[path]) return Promise.resolve(cache[path]);

    // Try embedded bundle first (works on file://)
    if (OB._bundle && OB._bundle[path]) {
      cache[path] = OB._bundle[path];
      return Promise.resolve(cache[path]);
    }

    // Fall back to fetch (works on HTTP)
    return fetch("content/" + path)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load " + path + ": " + res.status);
        return res.json();
      })
      .then(function (data) {
        cache[path] = data;
        return data;
      });
  }

  function getCourse() {
    if (courseData) return Promise.resolve(courseData);
    return loadJSON("course.json").then(function (data) {
      courseData = data;
      return data;
    });
  }

  function getModule(moduleId) {
    return getCourse().then(function (course) {
      var mod = course.modules.find(function (m) { return m.id === moduleId; });
      if (!mod) throw new Error("Module not found: " + moduleId);
      return loadJSON(mod.contentFile).then(function (content) {
        return { meta: mod, content: content };
      });
    });
  }

  function getQuiz(moduleId) {
    return getCourse().then(function (course) {
      var mod = course.modules.find(function (m) { return m.id === moduleId; });
      if (!mod) throw new Error("Module not found: " + moduleId);
      return loadJSON(mod.quizFile);
    });
  }

  function getGlossary() {
    return loadJSON("glossary.json");
  }

  /* Get all topic IDs across all modules (for overall progress) */
  function getAllTopicIds() {
    var ids = [];
    Object.keys(cache).forEach(function (key) {
      if (key.indexOf("modules/") === 0 && cache[key].topics) {
        cache[key].topics.forEach(function (t) { ids.push(t.id); });
      }
    });
    return ids;
  }

  /* Load all available modules to get topic IDs */
  function loadAllModules() {
    return getCourse().then(function (course) {
      var promises = course.modules
        .filter(function (m) { return !m.comingSoon; })
        .map(function (m) { return loadJSON(m.contentFile); });
      return Promise.all(promises);
    });
  }

  OB.content = {
    getCourse: getCourse,
    getModule: getModule,
    getQuiz: getQuiz,
    getGlossary: getGlossary,
    getAllTopicIds: getAllTopicIds,
    loadAllModules: loadAllModules,
  };
})();
