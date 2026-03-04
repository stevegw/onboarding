/**
 * OB -- Onboarding -- Theme Toggle
 * ==================================
 * Dark/light theme toggle with localStorage persistence.
 * Attached to window.OB.theme.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  function getTheme() {
    return OB.state.loadRaw(OB.state.GLOBAL_KEYS.theme) || "dark";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    OB.state.saveRaw(OB.state.GLOBAL_KEYS.theme, theme);
    var btn = document.getElementById("theme-toggle-btn");
    if (btn) btn.innerHTML = theme === "dark" ? "&#9790;" : "&#9728;";
  }

  function toggle() {
    var current = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  }

  function init() {
    setTheme(getTheme());
    var btn = document.getElementById("theme-toggle-btn");
    if (btn) btn.addEventListener("click", toggle);
  }

  OB.theme = { init: init, toggle: toggle, setTheme: setTheme };
})();
