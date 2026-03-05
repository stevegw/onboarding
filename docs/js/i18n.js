/**
 * OB -- Onboarding -- Internationalization (i18n)
 * =================================================
 * Lightweight i18n module. Loads UI string bundles and provides
 * a t() function for string lookup with interpolation.
 *
 * Locale detection priority:
 *   1. ?lang=xx query parameter
 *   2. localStorage ob_locale
 *   3. navigator.language
 *   4. "en" fallback
 *
 * Multi-course: content bundles are loaded per-course from
 * courses/{courseId}/bundles/{locale}.js
 * UI strings remain global at content/i18n/ui-{locale}.json.
 *
 * Attached to window.OB.i18n.
 * Must be loaded after state.js and before all view modules.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var SUPPORTED = { en: "English", fr: "Français", de: "Deutsch", ja: "日本語", zh: "中文", ko: "한국어", es: "Español" };
  var LOCALE_KEY = "ob_locale";
  var strings = {};      // current locale strings
  var fallback = {};     // English strings (always loaded)
  var currentLocale = "en";

  /**
   * Detect locale from query param, localStorage, or browser.
   */
  function detectLocale() {
    // 1. ?lang= query param
    var params = new URLSearchParams(window.location.search);
    var qLang = params.get("lang");
    if (qLang && SUPPORTED[qLang]) {
      // Save so it sticks
      try { localStorage.setItem(LOCALE_KEY, qLang); } catch (e) { /* */ }
      return qLang;
    }

    // 2. localStorage
    try {
      var stored = localStorage.getItem(LOCALE_KEY);
      if (stored && SUPPORTED[stored]) return stored;
    } catch (e) { /* */ }

    // 3. navigator.language (first two chars)
    if (navigator.language) {
      var nav = navigator.language.substring(0, 2).toLowerCase();
      if (SUPPORTED[nav]) return nav;
    }

    // 4. Fallback
    return "en";
  }

  /**
   * Load UI strings for a locale. Uses fetch from content/i18n/.
   * Also checks course bundle for embedded UI strings.
   */
  function loadStrings(locale) {
    var bundleKey = "i18n/ui-" + locale + ".json";

    // Try embedded UI strings bundle (from catalog-bundle.js)
    if (locale === "en" && OB._uiStringsEn) {
      return Promise.resolve(OB._uiStringsEn);
    }

    // Try course-specific locale bundle for embedded UI strings
    if (locale !== "en") {
      var locBundleKey = "_courseBundle" + locale.charAt(0).toUpperCase() + locale.slice(1);
      if (OB[locBundleKey] && OB[locBundleKey][bundleKey]) {
        return Promise.resolve(OB[locBundleKey][bundleKey]);
      }
    }

    // Try English course bundle
    if (OB._courseBundle && OB._courseBundle[bundleKey]) {
      return Promise.resolve(OB._courseBundle[bundleKey]);
    }

    // Fall back to fetch from global i18n path
    return fetch("content/" + bundleKey)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load " + bundleKey);
        return res.json();
      })
      .catch(function () { return {}; });
  }

  /**
   * Dynamically load a course-specific content bundle script.
   * Bundles are at courses/{courseId}/bundles/{locale}.js
   */
  function loadCourseBundle(courseId) {
    if (!courseId) return Promise.resolve();

    // In author/edit mode, skip bundles so content always comes from fetch()
    var params = new URLSearchParams(window.location.search);
    if (params.get("edit") === "true") return Promise.resolve();

    var locale = currentLocale;

    // Load English bundle for the course
    var enLoaded = loadBundleScript("courses/" + courseId + "/bundles/en.js");

    if (locale === "en") return enLoaded;

    // Load locale-specific bundle too
    return enLoaded.then(function () {
      return loadBundleScript("courses/" + courseId + "/bundles/" + locale + ".js");
    });
  }

  /**
   * Load a single bundle script file. Returns a Promise.
   */
  function loadBundleScript(src) {
    return new Promise(function (resolve) {
      var script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = resolve; // graceful — will fall back to fetch
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize i18n. Must be called before router.init().
   * Returns a Promise that resolves when UI strings are loaded.
   */
  function init() {
    currentLocale = detectLocale();

    // Set html lang attribute
    document.documentElement.lang = currentLocale;

    // Always load English UI strings as fallback
    var loadEn = loadStrings("en").then(function (data) {
      fallback = data;
    });

    if (currentLocale === "en") {
      return loadEn.then(function () {
        strings = fallback;
        patchHTML();
        renderLocaleSelector();
      });
    }

    // Load target locale + English fallback
    return Promise.all([loadEn, loadStrings(currentLocale)]).then(function (results) {
      strings = results[1] || {};
      patchHTML();
      renderLocaleSelector();
    });
  }

  /**
   * Translate a key with optional interpolation.
   *   t("quiz.questionProgress", {current: 3, total: 10})
   *   -> "Question 3 of 10"
   */
  function t(key, params) {
    var str = strings[key] || fallback[key] || key;
    if (params) {
      Object.keys(params).forEach(function (k) {
        str = str.replace(new RegExp("\\{" + k + "\\}", "g"), params[k]);
      });
    }
    return str;
  }

  /**
   * Patch static HTML elements with data-i18n attributes.
   */
  function patchHTML() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key));
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      el.setAttribute("title", t(key));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      el.setAttribute("aria-label", t(key));
    });
  }

  /**
   * Render the locale selector dropdown in sidebar header.
   */
  function renderLocaleSelector() {
    var container = document.getElementById("locale-selector");
    if (!container) return;

    // Clear existing
    container.innerHTML = "";

    var select = document.createElement("select");
    select.className = "locale-select";
    select.setAttribute("aria-label", "Language");

    var courseLocales = OB._courseLocales || null;

    Object.keys(SUPPORTED).forEach(function (code) {
      var opt = document.createElement("option");
      opt.value = code;
      var label = SUPPORTED[code];
      if (courseLocales && courseLocales.indexOf(code) === -1) {
        label += " *";
        opt.className = "locale-unavailable";
      }
      opt.textContent = label;
      if (code === currentLocale) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener("change", function () {
      var newLocale = select.value;
      try { localStorage.setItem(LOCALE_KEY, newLocale); } catch (e) { /* */ }
      // Reload page to apply new locale
      window.location.reload();
    });

    container.appendChild(select);
  }

  /**
   * Get the current locale code (e.g., "en", "fr").
   */
  function getLocale() {
    return currentLocale;
  }

  /**
   * Get supported locales map.
   */
  function getSupported() {
    return SUPPORTED;
  }

  OB.i18n = {
    init: init,
    t: t,
    getLocale: getLocale,
    getSupported: getSupported,
    loadCourseBundle: loadCourseBundle,
    refreshLocaleSelector: renderLocaleSelector,
  };
})();
