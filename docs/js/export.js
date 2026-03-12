/**
 * OB -- Onboarding -- Export
 * ============================
 * UI for exporting catalog subsets as standalone PWAs or SCORM 1.2 quiz packages.
 * Renders an export modal with format selection, scope/module picker, and CLI command.
 * Called from catalog card links in dashboard.js.
 * Attached to window.OB.export.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var modalEl = null;
  var currentCourseId = "";
  var courseModules = null; // loaded on demand for SCORM mode

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
    currentCourseId = preselCourseId;
    courseModules = null;

    // If familyId given but no courseId
    if (!family && preselFamilyId && catalog) {
      for (var fi = 0; fi < catalog.families.length; fi++) {
        if (catalog.families[fi].id === preselFamilyId) { family = catalog.families[fi]; break; }
      }
    }

    // Build format toggle (only show SCORM option when a course is selected)
    var formatToggle = "";
    if (preselCourseId) {
      formatToggle =
        '<div class="export-field" id="export-format-field">' +
          '<label class="export-label">Export Format</label>' +
          '<div class="export-scope-options" id="export-format-options">' +
            '<label class="export-radio">' +
              '<input type="radio" name="export-format" value="pwa" checked>' +
              '<span class="export-radio-label">Standalone PWA</span>' +
              '<span class="export-radio-detail">Offline-capable web app</span>' +
            '</label>' +
            '<label class="export-radio">' +
              '<input type="radio" name="export-format" value="scorm">' +
              '<span class="export-radio-label">SCORM 1.2 Module</span>' +
              '<span class="export-radio-detail">Full module content + quiz for LMS</span>' +
            '</label>' +
          '</div>' +
        '</div>';
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
        '<div class="export-modal" role="dialog" aria-label="Export">' +
          '<div class="export-modal-header">' +
            '<h3>Export</h3>' +
            '<button class="export-modal-close" id="export-close">&#10005;</button>' +
          '</div>' +
          '<div class="export-modal-body">' +

            formatToggle +

            '<div class="export-field" id="export-scope-field">' +
              '<label class="export-label">Export Scope</label>' +
              '<div class="export-scope-options" id="export-scope-options">' +
                scopeOptions +
              '</div>' +
            '</div>' +

            '<div class="export-field" id="export-module-field" style="display:none">' +
              '<label class="export-label">Module</label>' +
              '<div class="export-scope-options" id="export-module-options">' +
                '<p class="text-muted text-sm">Loading modules...</p>' +
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

            '<p class="export-hint" id="export-hint">Run this command from the <code>docs/</code> directory. The output is a standalone PWA that works offline after first load.</p>' +

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

    // Format toggle events
    var formatOptions = document.getElementById("export-format-options");
    if (formatOptions) {
      formatOptions.addEventListener("change", onFormatChange);
    }

    updateCommand();
  }

  function onFormatChange() {
    var format = getSelectedFormat();
    var scopeField = document.getElementById("export-scope-field");
    var moduleField = document.getElementById("export-module-field");
    var hint = document.getElementById("export-hint");

    if (format === "scorm") {
      scopeField.style.display = "none";
      moduleField.style.display = "";
      hint.innerHTML = 'Run this command from the <code>docs/</code> directory. Each module produces a SCORM 1.2 ZIP with full content + quiz for LMS upload.';
      loadModulePicker();
    } else {
      scopeField.style.display = "";
      moduleField.style.display = "none";
      hint.innerHTML = 'Run this command from the <code>docs/</code> directory. The output is a standalone PWA that works offline after first load.';
    }

    // Update output directory hint
    var input = document.getElementById("export-output");
    if (input.value.indexOf("../dist/") === 0 || input.value === "") {
      input.value = format === "scorm"
        ? "../dist/scorm/"
        : "../dist/" + (currentCourseId || "export") + "/";
    }

    updateCommand();
  }

  function getSelectedFormat() {
    var sel = document.querySelector('input[name="export-format"]:checked');
    return sel ? sel.value : "pwa";
  }

  function loadModulePicker() {
    if (courseModules) {
      renderModulePicker();
      return;
    }

    // Load course.json to get module list
    OB.content.getCourse(currentCourseId).then(function (course) {
      courseModules = course.modules || [];
      renderModulePicker();
    }).catch(function () {
      var el = document.getElementById("export-module-options");
      if (el) el.innerHTML = '<p class="text-muted text-sm">Could not load modules.</p>';
    });
  }

  function renderModulePicker() {
    var el = document.getElementById("export-module-options");
    if (!el || !courseModules) return;

    var html = '';
    html +=
      '<label class="export-radio">' +
        '<input type="radio" name="export-module" value="all" checked>' +
        '<span class="export-radio-label">All modules</span>' +
        '<span class="export-radio-detail">One ZIP per module</span>' +
      '</label>';

    for (var i = 0; i < courseModules.length; i++) {
      var m = courseModules[i];
      if (!m.quizFile) continue;
      html +=
        '<label class="export-radio">' +
          '<input type="radio" name="export-module" value="' + OB.ui.esc(m.id) + '">' +
          '<span class="export-radio-label">' + OB.ui.esc(m.id.toUpperCase()) + '</span>' +
          '<span class="export-radio-detail">' + OB.ui.esc(m.title) + '</span>' +
        '</label>';
    }

    el.innerHTML = html;
    el.addEventListener("change", updateCommand);
    updateCommand();
  }

  function closeModal() {
    if (modalEl) {
      modalEl.remove();
      modalEl = null;
    }
    currentCourseId = "";
    courseModules = null;
    document.removeEventListener("keydown", handleEsc);
  }

  function handleEsc(e) {
    if (e.key === "Escape") closeModal();
  }

  function updateCommand() {
    var format = getSelectedFormat();
    var output = document.getElementById("export-output").value.trim() || "../dist/export/";

    if (format === "scorm") {
      updateScormCommand(output);
    } else {
      updatePwaCommand(output);
    }
  }

  function updatePwaCommand(output) {
    var selected = document.querySelector('input[name="export-scope"]:checked');
    if (!selected) return;

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

  function updateScormCommand(output) {
    var cmd = "python export-scorm.py --course " + currentCourseId;

    var moduleSel = document.querySelector('input[name="export-module"]:checked');
    if (moduleSel && moduleSel.value !== "all") {
      cmd += " --module " + moduleSel.value;
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
