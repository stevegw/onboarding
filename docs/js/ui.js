/**
 * OB -- Onboarding -- UI Utilities
 * =================================
 * DOM helpers, HTML escaping, element creation.
 * Attached to window.OB.ui.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  function esc(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "className") node.className = attrs[k];
        else if (k === "onclick" || k === "oninput") node[k] = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (children) {
      if (typeof children === "string") node.textContent = children;
      else if (Array.isArray(children)) {
        children.forEach(function (c) { if (c) node.appendChild(c); });
      }
    }
    return node;
  }

  function setMain(html) {
    var main = document.getElementById("main");
    if (!main) return;
    var notice = "";
    if (OB._localeNotice) {
      notice = '<div class="locale-notice">' +
        '<span class="locale-notice-icon">&#127760;</span>' +
        '<span>This course is not yet available in <strong>' + esc(OB._localeNotice.localeName) +
        '</strong>. Showing English content.</span>' +
        '</div>';
    }
    main.innerHTML = notice + html;
    main.scrollTop = 0;
  }

  OB.ui = {
    esc: esc,
    $: $,
    $$: $$,
    el: el,
    setMain: setMain,
  };
})();
