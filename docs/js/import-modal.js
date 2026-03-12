/**
 * OB -- Onboarding -- Import SCORM Modal
 * ========================================
 * UI for importing iSpring SCORM 1.2 packages into the platform.
 * Renders a modal that builds the CLI command for import-scorm.py.
 * Called from the Import button on catalog family headers in dashboard.js.
 * Attached to window.OB["import"].
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var modalEl = null;
  var currentFamily = "";

  var FAMILY_PREFIXES = {
    windchill: "wcba-",
    codebeamer: "cb-",
    creo: "creo-"
  };

  var FAMILY_NAMES = {
    windchill: "windchill",
    codebeamer: "codebeamer",
    creo: "creo"
  };

  /* ---- Modal ---- */

  function openModal(opts) {
    if (modalEl) return;
    opts = opts || {};
    currentFamily = opts.familyId || "windchill";
    renderModal(currentFamily);
  }

  function renderModal(familyId) {
    var prefix = FAMILY_PREFIXES[familyId] || "";
    var familyName = FAMILY_NAMES[familyId] || familyId;

    var html =
      '<div class="export-backdrop" id="import-backdrop">' +
        '<div class="export-modal" role="dialog" aria-label="Import SCORM">' +
          '<div class="export-modal-header">' +
            '<h3>Import SCORM Package</h3>' +
            '<button class="export-modal-close" id="import-close">&#10005;</button>' +
          '</div>' +
          '<div class="export-modal-body">' +

            '<div class="export-field">' +
              '<label class="export-label">SCORM ZIP Path</label>' +
              '<div style="display:flex;gap:6px;align-items:center">' +
                '<input type="text" class="export-input" id="import-zip" ' +
                  'value="../imports/" placeholder="../imports/My-Package.zip" style="flex:1">' +
                '<button type="button" class="import-browse-btn" id="import-browse">Browse&hellip;</button>' +
                '<input type="file" id="import-file" accept=".zip" style="display:none">' +
              '</div>' +
            '</div>' +

            '<div class="export-field">' +
              '<label class="export-label">Course ID</label>' +
              '<input type="text" class="export-input" id="import-course-id" ' +
                'value="' + OB.ui.esc(prefix) + '" placeholder="' + OB.ui.esc(prefix) + 'my-course">' +
            '</div>' +

            '<div class="export-field">' +
              '<label class="export-label">Product Family</label>' +
              '<input type="text" class="export-input" id="import-family" ' +
                'value="' + OB.ui.esc(familyName) + '" readonly ' +
                'style="opacity:0.6;cursor:default">' +
            '</div>' +

            '<div class="export-field">' +
              '<label class="export-radio" style="cursor:pointer">' +
                '<input type="checkbox" id="import-register" checked ' +
                  'style="width:auto;margin-right:8px">' +
                '<span class="export-radio-label">Auto-register in catalog</span>' +
                '<span class="export-radio-detail">Updates catalog.json, catalog-bundle.js, and runs build-bundles.py</span>' +
              '</label>' +
            '</div>' +

            '<div class="export-field">' +
              '<label class="export-label">Command</label>' +
              '<div class="export-command-box">' +
                '<code class="export-command" id="import-command"></code>' +
                '<button class="export-copy-btn" id="import-copy" title="Copy to clipboard">&#128203;</button>' +
              '</div>' +
            '</div>' +

            '<p class="export-hint">Run this command from the <code>docs/</code> directory. ' +
              'The script parses the iSpring SCORM package and generates the course JSON structure, ' +
              'images, quizzes, and glossary.</p>' +

          '</div>' +
        '</div>' +
      '</div>';

    var container = document.createElement("div");
    container.innerHTML = html;
    modalEl = container.firstChild;
    document.body.appendChild(modalEl);

    // Wire events
    document.getElementById("import-close").addEventListener("click", closeModal);
    modalEl.addEventListener("click", function (e) {
      if (e.target === modalEl) closeModal();
    });
    document.addEventListener("keydown", handleEsc);

    document.getElementById("import-browse").addEventListener("click", function () {
      document.getElementById("import-file").click();
    });
    document.getElementById("import-file").addEventListener("change", function () {
      var file = this.files && this.files[0];
      if (file) {
        document.getElementById("import-zip").value = "../imports/" + file.name;
        updateCommand();
      }
    });
    document.getElementById("import-zip").addEventListener("input", updateCommand);
    document.getElementById("import-course-id").addEventListener("input", updateCommand);
    document.getElementById("import-register").addEventListener("change", updateCommand);
    document.getElementById("import-copy").addEventListener("click", copyCommand);

    // Focus the ZIP path input
    document.getElementById("import-zip").focus();

    updateCommand();
  }

  function closeModal() {
    if (modalEl) {
      modalEl.remove();
      modalEl = null;
    }
    currentFamily = "";
    document.removeEventListener("keydown", handleEsc);
  }

  function handleEsc(e) {
    if (e.key === "Escape") closeModal();
  }

  function updateCommand() {
    var zip = document.getElementById("import-zip").value.trim() || "../imports/Package.zip";
    var courseId = document.getElementById("import-course-id").value.trim() || "course-id";
    var register = document.getElementById("import-register").checked;
    var family = currentFamily || "windchill";

    var cmd = "python import-scorm.py" +
      " --zip " + zip +
      " --course-id " + courseId +
      " --family " + family;

    if (register) cmd += " --register";

    document.getElementById("import-command").textContent = cmd;
  }

  function copyCommand() {
    var cmd = document.getElementById("import-command").textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmd).then(function () {
        var btn = document.getElementById("import-copy");
        btn.textContent = "\u2713";
        setTimeout(function () { btn.innerHTML = "&#128203;"; }, 1500);
      });
    }
  }

  OB["import"] = {
    openModal: openModal
  };
})();
