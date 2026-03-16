/**
 * OB -- Onboarding -- Passphrase Gate
 * ====================================
 * Client-side passphrase gate using SHA-256 via Web Crypto API.
 * Blocks app init until the correct passphrase is provided.
 * Attached to window.OB.gate.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var HASH = "4f223c6af2f915bd4141aa17413b79626fb5d9f8470a7d175a1736059650402d";
  var SESSION_KEY = "ob_gate_session";
  var REMEMBER_KEY = "ob_gate_remember";

  var unlocked = false;

  /* ── Helpers ── */

  function applyStoredTheme() {
    var theme = localStorage.getItem("ob_theme");
    var scheme = localStorage.getItem("ob_scheme");
    if (theme) document.documentElement.setAttribute("data-theme", theme);
    if (scheme) document.documentElement.setAttribute("data-scheme", scheme);
  }

  function toHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(function (b) { return b.toString(16).padStart(2, "0"); })
      .join("");
  }

  function hashPassphrase(input) {
    return crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(input))
      .then(toHex);
  }

  function checkPassphrase(input) {
    return hashPassphrase(input).then(function (hex) {
      return hex === HASH;
    });
  }

  function unlock(remember) {
    unlocked = true;
    sessionStorage.setItem(SESSION_KEY, "1");
    if (remember) localStorage.setItem(REMEMBER_KEY, "1");
  }

  function stripPassParam() {
    var url = new URL(window.location.href);
    if (!url.searchParams.has("pass")) return;
    url.searchParams.delete("pass");
    history.replaceState(null, "", url.toString());
  }

  function showApp() {
    var app = document.querySelector(".app");
    if (app) app.style.display = "";
  }

  function hideApp() {
    var app = document.querySelector(".app");
    if (app) app.style.display = "none";
  }

  function removeOverlay() {
    var overlay = document.getElementById("gate-overlay");
    if (overlay) overlay.remove();
  }

  /* ── Gate UI ── */

  function renderGate(onSuccess) {
    hideApp();

    var overlay = document.createElement("div");
    overlay.id = "gate-overlay";
    overlay.className = "gate-overlay";
    overlay.innerHTML =
      '<div class="gate-card">' +
        '<h1 class="gate-logo">PTC Training</h1>' +
        '<p class="gate-subtitle">Enter access passphrase</p>' +
        '<input type="password" class="gate-input" id="gate-input" placeholder="Passphrase" autocomplete="off">' +
        '<label class="gate-remember"><input type="checkbox" id="gate-remember-cb"> Remember this device</label>' +
        '<button class="gate-btn" id="gate-btn">Continue</button>' +
        '<p class="gate-error" id="gate-error">Incorrect passphrase. Please try again.</p>' +
        '<p class="gate-footer">Contact your training administrator for access.</p>' +
      '</div>';

    document.body.appendChild(overlay);

    var input = document.getElementById("gate-input");
    var btn = document.getElementById("gate-btn");
    var error = document.getElementById("gate-error");
    var rememberCb = document.getElementById("gate-remember-cb");

    input.focus();

    function submit() {
      var val = input.value.trim();
      if (!val) return;
      btn.disabled = true;
      checkPassphrase(val).then(function (ok) {
        if (ok) {
          unlock(rememberCb.checked);
          removeOverlay();
          showApp();
          onSuccess();
        } else {
          error.classList.add("visible");
          input.classList.add("shake");
          setTimeout(function () { input.classList.remove("shake"); }, 500);
          input.value = "";
          input.focus();
          btn.disabled = false;
        }
      });
    }

    btn.addEventListener("click", submit);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") submit();
    });
  }

  /* ── Init ── */

  function init(onSuccess) {
    applyStoredTheme();

    // Check ?pass= query param
    var url = new URL(window.location.href);
    var passParam = url.searchParams.get("pass");

    if (passParam) {
      checkPassphrase(passParam).then(function (ok) {
        stripPassParam();
        if (ok) {
          unlock(false);
          onSuccess();
        } else {
          renderGate(onSuccess);
          // Show error immediately for wrong param
          var error = document.getElementById("gate-error");
          if (error) error.classList.add("visible");
        }
      });
      return;
    }

    // Check localStorage remember
    if (localStorage.getItem(REMEMBER_KEY) === "1") {
      unlocked = true;
      onSuccess();
      return;
    }

    // Check sessionStorage
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      unlocked = true;
      onSuccess();
      return;
    }

    // Show gate
    renderGate(onSuccess);
  }

  function isUnlocked() {
    return unlocked;
  }

  OB.gate = {
    init: init,
    isUnlocked: isUnlocked,
    checkPassphrase: checkPassphrase
  };
})();
