/**
 * OB -- Onboarding -- Notepad Module
 * =====================================
 * Floating action button + slide-in panel with auto-save textarea.
 * Ported from WCAI notepad module.
 * Attached to window.OB.notepad.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var panel = null;
  var fab = null;
  var textarea = null;
  var countEl = null;
  var saveTimer = null;

  function init() {
    fab = document.getElementById("notepad-fab");
    panel = document.getElementById("notepad-panel");
    textarea = document.getElementById("notepad-textarea");
    countEl = document.getElementById("notepad-count");

    if (!fab || !panel || !textarea) return;

    // Load saved notes
    try {
      var saved = localStorage.getItem(OB.state.KEYS.notepad);
      if (saved) textarea.value = saved;
    } catch (e) { /* ignore */ }

    // Auto-save on input
    textarea.addEventListener("input", function () {
      updateCount();
      clearTimeout(saveTimer);
      saveTimer = setTimeout(saveNotes, 300);
    });

    updateCount();

    // FAB click
    fab.addEventListener("click", openPanel);

    // Close button
    var closeBtn = document.getElementById("notepad-close");
    if (closeBtn) closeBtn.addEventListener("click", closePanel);

    // Restore open state
    try {
      if (localStorage.getItem(OB.state.KEYS.notepadOpen) === "true") {
        openPanel();
      }
    } catch (e) { /* ignore */ }
  }

  function openPanel() {
    if (panel) panel.classList.add("open");
    if (fab) fab.style.display = "none";
    try { localStorage.setItem(OB.state.KEYS.notepadOpen, "true"); } catch (e) { /* ignore */ }
    if (textarea) textarea.focus();
  }

  function closePanel() {
    if (panel) panel.classList.remove("open");
    if (fab) fab.style.display = "";
    try { localStorage.setItem(OB.state.KEYS.notepadOpen, "false"); } catch (e) { /* ignore */ }
  }

  function saveNotes() {
    try {
      localStorage.setItem(OB.state.KEYS.notepad, textarea.value);
    } catch (e) { /* ignore */ }
  }

  function updateCount() {
    if (countEl && textarea) {
      countEl.textContent = OB.i18n.t("notepad.charCount", { count: textarea.value.length });
    }
  }

  function clearNotes() {
    if (textarea) textarea.value = "";
    try {
      localStorage.removeItem(OB.state.KEYS.notepad);
      localStorage.removeItem(OB.state.KEYS.notepadOpen);
    } catch (e) { /* ignore */ }
    updateCount();
    closePanel();
  }

  OB.notepad = {
    init: init,
    open: openPanel,
    close: closePanel,
    clearNotes: clearNotes,
  };
})();
