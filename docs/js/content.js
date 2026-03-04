/**
 * OB -- Onboarding -- Content Loader
 * ====================================
 * Loads content from the embedded bundle (OB._bundle) for file:// compatibility.
 * Falls back to fetch() if bundle is missing (HTTP server mode).
 * Supports i18n: non-English locales load from {locale}/ prefixed paths
 * with automatic fallback to English on missing content.
 * Attached to window.OB.content.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var cache = {};
  var courseData = null;

  /**
   * Get the locale-specific bundle object (e.g., OB._bundleFr for "fr").
   */
  function getLocaleBundle(locale) {
    if (locale === "en") return OB._bundle;
    var key = "_bundle" + locale.charAt(0).toUpperCase() + locale.slice(1);
    return OB[key] || null;
  }

  /**
   * Load JSON by path. For non-English locales, tries {locale}/{path} first
   * (from locale bundle or fetch), then falls back to English.
   */
  function loadJSON(path) {
    var locale = OB.i18n ? OB.i18n.getLocale() : "en";
    var localePath = locale !== "en" ? (locale + "/" + path) : path;

    // Check cache first (locale-specific path)
    if (cache[localePath]) return Promise.resolve(cache[localePath]);
    if (locale !== "en" && cache[path]) {
      // If locale-specific not cached but English is, try loading locale first
    }

    // Try locale-specific bundle
    var localeBundle = getLocaleBundle(locale);
    if (localeBundle && localeBundle[path]) {
      cache[localePath] = localeBundle[path];
      return Promise.resolve(cache[localePath]);
    }

    // Try main bundle (English)
    if (OB._bundle && OB._bundle[path]) {
      // For English locale or as fallback
      if (locale === "en") {
        cache[path] = OB._bundle[path];
        return Promise.resolve(cache[path]);
      }
      // Non-English: use English bundle as fallback
      cache[localePath] = OB._bundle[path];
      return Promise.resolve(cache[localePath]);
    }

    // Fall back to fetch (works on HTTP)
    if (locale !== "en") {
      // Try locale-specific fetch, then fall back to English
      return fetch("content/" + localePath)
        .then(function (res) {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then(function (data) {
          cache[localePath] = data;
          return data;
        })
        .catch(function () {
          // Fallback to English
          return fetch("content/" + path)
            .then(function (res) {
              if (!res.ok) throw new Error("Failed to load " + path + ": " + res.status);
              return res.json();
            })
            .then(function (data) {
              cache[localePath] = data;
              return data;
            });
        });
    }

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
      var data = cache[key];
      if (data && data.topics) {
        data.topics.forEach(function (t) { ids.push(t.id); });
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
