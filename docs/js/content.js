/**
 * OB -- Onboarding -- Content Loader
 * ====================================
 * Loads content from the embedded bundle (OB._courseBundle) for file:// compatibility.
 * Falls back to fetch() if bundle is missing (HTTP server mode).
 * Supports i18n: non-English locales load from {locale}/ prefixed paths
 * with automatic fallback to English on missing content.
 *
 * Multi-course: paths resolve relative to courses/{courseId}/.
 * Attached to window.OB.content.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var cache = {};
  var courseData = null;
  var catalogData = null;
  var currentCourseId = null;
  var isEditMode = new URLSearchParams(window.location.search).get("edit") === "true";
  var cacheBuster = isEditMode ? "?_t=" + Date.now() : "";

  /**
   * Set the active course. Resets cache and courseData.
   */
  function setCourse(id) {
    if (id === currentCourseId) return;
    currentCourseId = id;
    cache = {};
    courseData = null;
  }

  function getCourseId() {
    return currentCourseId;
  }

  /**
   * Get the course-specific bundle for a given locale.
   * After multi-course refactor, all bundles write to OB._courseBundle / OB._courseBundleLocale.
   */
  function getLocaleBundle(locale) {
    if (locale === "en") return OB._courseBundle || null;
    var key = "_courseBundle" + locale.charAt(0).toUpperCase() + locale.slice(1);
    return OB[key] || null;
  }

  /**
   * Build the fetch URL base for the current course.
   */
  function courseBase() {
    return "courses/" + currentCourseId + "/";
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

    if (!isEditMode) {
      // Try locale-specific bundle
      var localeBundle = getLocaleBundle(locale);
      if (localeBundle && localeBundle[path]) {
        cache[localePath] = localeBundle[path];
        return Promise.resolve(cache[localePath]);
      }

      // Try main bundle (English)
      var enBundle = OB._courseBundle;
      if (enBundle && enBundle[path]) {
        if (locale === "en") {
          cache[path] = enBundle[path];
          return Promise.resolve(cache[path]);
        }
        // Non-English: use English bundle as fallback
        cache[localePath] = enBundle[path];
        return Promise.resolve(cache[localePath]);
      }
    }

    // Fetch from server — resolve against course dir
    var base = courseBase();
    if (locale !== "en") {
      return fetch(base + localePath + cacheBuster)
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
          return fetch(base + path + cacheBuster)
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

    return fetch(base + path + cacheBuster)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load " + path + ": " + res.status);
        return res.json();
      })
      .then(function (data) {
        cache[path] = data;
        return data;
      });
  }

  /**
   * Load the catalog.json (product-family-grouped course list).
   */
  function loadCatalog() {
    if (catalogData) return Promise.resolve(catalogData);
    // Try bundle first
    if (OB._catalogBundle) {
      catalogData = OB._catalogBundle;
      return Promise.resolve(catalogData);
    }
    return fetch("catalog.json")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load catalog: " + res.status);
        return res.json();
      })
      .then(function (data) {
        catalogData = data;
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
    setCourse: setCourse,
    getCourseId: getCourseId,
    getCourse: getCourse,
    getModule: getModule,
    getQuiz: getQuiz,
    getGlossary: getGlossary,
    getAllTopicIds: getAllTopicIds,
    loadAllModules: loadAllModules,
    loadCatalog: loadCatalog,
    clearCache: function () {
      cache = {};
      courseData = null;
      cacheBuster = "?_t=" + Date.now();
      // Clear embedded bundles so loadJSON falls through to fetch
      OB._courseBundle = null;
    },
  };
})();
