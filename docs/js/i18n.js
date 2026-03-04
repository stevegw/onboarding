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
   * Load UI strings for a locale. Uses bundle (file://) or fetch (HTTP).
   */
  function loadStrings(locale) {
    var bundleKey = "i18n/ui-" + locale + ".json";

    // Try locale-specific bundle first (e.g. OB._bundleFr)
    var bundleVar = "_bundle" + locale.charAt(0).toUpperCase() + locale.slice(1);
    if (OB[bundleVar] && OB[bundleVar][bundleKey]) {
      return Promise.resolve(OB[bundleVar][bundleKey]);
    }

    // Try main bundle
    if (OB._bundle && OB._bundle[bundleKey]) {
      return Promise.resolve(OB._bundle[bundleKey]);
    }

    // Fall back to fetch
    return fetch("content/" + bundleKey)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load " + bundleKey);
        return res.json();
      })
      .catch(function () { return {}; });
  }

  /**
   * Dynamically load a locale-specific content bundle script.
   * Returns a Promise that resolves once the script is loaded (or immediately
   * if the bundle is already present).
   */
  function loadLocaleBundle(locale) {
    if (locale === "en") return Promise.resolve();
    var bundleVar = "_bundle" + locale.charAt(0).toUpperCase() + locale.slice(1);
    if (OB[bundleVar]) return Promise.resolve(); // already loaded

    return new Promise(function (resolve) {
      var script = document.createElement("script");
      script.src = "js/content-bundle-" + locale + ".js";
      script.onload = resolve;
      script.onerror = resolve; // graceful — strings will fall back to English
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize i18n. Must be called before router.init().
   * Returns a Promise that resolves when strings are loaded.
   */
  function init() {
    currentLocale = detectLocale();

    // Set html lang attribute
    document.documentElement.lang = currentLocale;

    // Load locale bundle (for file:// support), then load strings
    return loadLocaleBundle(currentLocale).then(function () {
      // Always load English as fallback
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

    var select = document.createElement("select");
    select.className = "locale-select";
    select.setAttribute("aria-label", "Language");

    Object.keys(SUPPORTED).forEach(function (code) {
      var opt = document.createElement("option");
      opt.value = code;
      opt.textContent = SUPPORTED[code];
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
  };
})();
