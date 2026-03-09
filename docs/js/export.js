/**
 * OB -- Onboarding -- Export
 * ============================
 * UI for exporting catalog subsets as standalone PWAs.
 * Renders an export modal with scope selection and CLI command.
 * Called from catalog card links in dashboard.js.
 * Attached to window.OB.export.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var modalEl = null;

  /** Get catalog data (from bundle or async). */
  function getCatalog() {
    if (OB._catalogBundle) return Promise.resolve(OB._catalogBundle);
    return OB.content.loadCatalog();
  }

  /** Find which family a course belongs to. */
  function findFamily(catalog, courseId) {
    for (var i = 0; i < catalog.families.length; i++) {
      var fam = catalog.families[i];
      for (var j = 0; j < fam.courses.length; j++) {
        if (fam.courses[j].id === courseId) return fam;
      }
    }
    return null;
  }

  /** Find a course object by ID. */
  function findCourse(catalog, courseId) {
    for (var i = 0; i < catalog.families.length; i++) {
      var fam = catalog.families[i];
      for (var j = 0; j < fam.courses.length; j++) {
        if (fam.courses[j].id === courseId) return fam.courses[j];
      }
    }
    return null;
  }

  /* ---- Modal ---- */

  /**
   * Open export modal.
   * @param {Object} opts
   * @param {string} [opts.courseId] - Pre-select a specific course
   * @param {string} [opts.familyId] - Pre-select a product family
   */
  function openModal(opts) {
    if (modalEl) return;
    opts = opts || {};

    getCatalog().then(function (catalog) {
      renderModal(catalog, opts.courseId || "", opts.familyId || "");
    }).catch(function () {
      renderModal(null, "", "");
    });
  }

  function renderModal(catalog, preselCourseId, preselFamilyId) {
    var family = catalog && preselCourseId ? findFamily(catalog, preselCourseId) : null;
    var course = catalog && preselCourseId ? findCourse(catalog, preselCourseId) : null;

    // If familyId given but no courseId
    if (!family && preselFamilyId && catalog) {
      for (var fi = 0; fi < catalog.families.length; fi++) {
        if (catalog.families[fi].id === preselFamilyId) { family = catalog.families[fi]; break; }
      }
    }

    // Build scope options
    var scopeOptions = "";

    if (course) {
      scopeOptions +=
        '<label class="export-radio">' +
          '<input type="radio" name="export-scope" value="course" data-course="' + OB.ui.esc(preselCourseId) + '" checked>' +
          '<span class="export-radio-label">This course</span>' +
          '<span class="export-radio-detail">' + OB.ui.esc(course.title) + '</span>' +
        '</label>';
    }
    if (family) {
      scopeOptions +=
        '<label class="export-radio">' +
          '<input type="radio" name="export-scope" value="family" data-family="' + OB.ui.esc(family.id) + '"' + (!course ? ' checked' : '') + '>' +
          '<span class="export-radio-label">' + OB.ui.esc(family.name) + ' family</span>' +
          '<span class="export-radio-detail">' + family.courses.length + ' courses</span>' +
        '</label>';
    }
    if (catalog) {
      for (var i = 0; i < catalog.families.length; i++) {
        var fam = catalog.families[i];
        if (family && fam.id === family.id) continue;
        scopeOptions +=
          '<label class="export-radio">' +
            '<input type="radio" name="export-scope" value="family" data-family="' + OB.ui.esc(fam.id) + '">' +
            '<span class="export-radio-label">' + OB.ui.esc(fam.name) + ' family</span>' +
            '<span class="export-radio-detail">' + fam.courses.length + ' courses</span>' +
          '</label>';
      }
    }
    scopeOptions +=
      '<label class="export-radio">' +
        '<input type="radio" name="export-scope" value="all"' + (!course && !family ? ' checked' : '') + '>' +
        '<span class="export-radio-label">All courses</span>' +
        '<span class="export-radio-detail">Full catalog</span>' +
      '</label>';

    var defaultOutput = preselCourseId
      ? "../dist/" + preselCourseId + "/"
      : (family ? "../dist/" + family.id + "/" : "../dist/export/");

    var html =
      '<div class="export-backdrop" id="export-backdrop">' +
        '<div class="export-modal" role="dialog" aria-label="Export standalone app">' +
          '<div class="export-modal-header">' +
            '<h3>Export Standalone App</h3>' +
            '<button class="export-modal-close" id="export-close">&#10005;</button>' +
          '</div>' +
          '<div class="export-modal-body">' +

            '<div class="export-field">' +
              '<label class="export-label">Export Scope</label>' +
              '<div class="export-scope-options" id="export-scope-options">' +
                scopeOptions +
              '</div>' +
            '</div>' +

            '<div class="export-field">' +
              '<label class="export-label">Output Directory</label>' +
              '<input type="text" class="export-input" id="export-output" value="' + OB.ui.esc(defaultOutput) + '" placeholder="../dist/my-export/">' +
            '</div>' +

            '<div class="export-field">' +
              '<label class="export-label">Command</label>' +
              '<div class="export-command-box">' +
                '<code class="export-command" id="export-command"></code>' +
                '<button class="export-copy-btn" id="export-copy" title="Copy to clipboard">&#128203;</button>' +
              '</div>' +
            '</div>' +

            '<p class="export-hint">Run this command from the <code>docs/</code> directory. The output is a standalone PWA that works offline after first load.</p>' +

          '</div>' +
        '</div>' +
      '</div>';

    var container = document.createElement("div");
    container.innerHTML = html;
    modalEl = container.firstChild;
    document.body.appendChild(modalEl);

    // Wire events
    document.getElementById("export-close").addEventListener("click", closeModal);
    modalEl.addEventListener("click", function (e) {
      if (e.target === modalEl) closeModal();
    });
    document.addEventListener("keydown", handleEsc);

    document.getElementById("export-scope-options").addEventListener("change", updateCommand);
    document.getElementById("export-output").addEventListener("input", updateCommand);
    document.getElementById("export-copy").addEventListener("click", copyCommand);

    updateCommand();
  }

  function closeModal() {
    if (modalEl) {
      modalEl.remove();
      modalEl = null;
    }
    document.removeEventListener("keydown", handleEsc);
  }

  function handleEsc(e) {
    if (e.key === "Escape") closeModal();
  }

  function updateCommand() {
    var selected = document.querySelector('input[name="export-scope"]:checked');
    if (!selected) return;

    var output = document.getElementById("export-output").value.trim() || "../dist/export/";
    var cmd = "python export-standalone.py";

    if (selected.value === "course") {
      var courseId = selected.getAttribute("data-course");
      cmd += " --course " + courseId;
      updateOutputHint(courseId);
    } else if (selected.value === "family") {
      var familyId = selected.getAttribute("data-family");
      cmd += " --family " + familyId;
      updateOutputHint(familyId);
    } else {
      cmd += " --all";
      updateOutputHint("all");
    }

    cmd += " --output " + output;
    document.getElementById("export-command").textContent = cmd;
  }

  function updateOutputHint(scope) {
    var input = document.getElementById("export-output");
    if (input.value.indexOf("../dist/") === 0 || input.value === "") {
      input.value = "../dist/" + scope + "/";
    }
  }

  function copyCommand() {
    var cmd = document.getElementById("export-command").textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmd).then(function () {
        var btn = document.getElementById("export-copy");
        btn.textContent = "\u2713";
        setTimeout(function () { btn.innerHTML = "&#128203;"; }, 1500);
      });
    }
  }

  OB["export"] = {
    openModal: openModal,
  };
})();
