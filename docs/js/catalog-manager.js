/**
 * OB -- Onboarding -- Catalog Manager
 * =====================================
 * Inline panel for managing courses within a product family:
 * reorder, rename, and delete courses.
 * Attached to window.OB.catalogManager.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var workingCatalog = null; // deep copy for editing
  var activeFamilyId = null;

  /**
   * Open the management panel for a product family.
   */
  function open(familyId) {
    close(); // close any existing panel
    activeFamilyId = familyId;

    // Grab catalog synchronously from bundle or cached data
    var source = OB._catalogBundle;
    if (!source) {
      // Fallback: fetch async
      OB.content.loadCatalog().then(function (catalog) {
        workingCatalog = JSON.parse(JSON.stringify(catalog));
        renderPanel();
      });
      return;
    }
    workingCatalog = JSON.parse(JSON.stringify(source));
    renderPanel();
  }

  /**
   * Close the panel and discard unsaved changes.
   */
  function close() {
    var existing = document.querySelector(".catmgr-panel");
    if (existing) existing.remove();
    workingCatalog = null;
    activeFamilyId = null;
  }

  /**
   * Find the family object in workingCatalog.
   */
  function getFamily() {
    if (!workingCatalog || !activeFamilyId) return null;
    return workingCatalog.families.find(function (f) { return f.id === activeFamilyId; });
  }

  /**
   * Render (or re-render) the management panel below the family header.
   */
  function renderPanel() {
    var esc = OB.ui.esc;
    var family = getFamily();
    if (!family) return;

    // Remove existing panel
    var old = document.querySelector(".catmgr-panel");
    if (old) old.remove();

    // Find the family header element
    var familyEl = document.querySelector('.catalog-family[data-family="' + activeFamilyId + '"]');
    if (!familyEl) return;
    var headerEl = familyEl.querySelector(".catalog-family-header");
    if (!headerEl) return;

    var panel = document.createElement("div");
    panel.className = "catmgr-panel";

    var html = "";
    html += '<div class="catmgr-header">';
    html += '<span class="catmgr-title">Manage Courses</span>';
    html += '<button class="catmgr-close" title="Close">&times;</button>';
    html += '</div>';

    html += '<div class="catmgr-list">';
    family.courses.forEach(function (course, idx) {
      html += '<div class="catmgr-item" data-idx="' + idx + '">';

      // Reorder buttons
      html += '<div class="catmgr-reorder">';
      html += '<button class="catmgr-btn catmgr-up" data-idx="' + idx + '" title="Move up"' + (idx === 0 ? ' disabled' : '') + '>&#9650;</button>';
      html += '<button class="catmgr-btn catmgr-down" data-idx="' + idx + '" title="Move down"' + (idx === family.courses.length - 1 ? ' disabled' : '') + '>&#9660;</button>';
      html += '</div>';

      // Course title
      html += '<span class="catmgr-course-title" data-idx="' + idx + '">' + esc(course.title) + '</span>';
      html += '<span class="catmgr-course-id">(' + esc(course.id) + ')</span>';

      // Action buttons
      html += '<div class="catmgr-item-actions">';
      html += '<button class="catmgr-btn catmgr-rename" data-idx="' + idx + '" title="Rename">&#9998;</button>';
      html += '<button class="catmgr-btn catmgr-delete" data-idx="' + idx + '" title="Delete">&#128465;</button>';
      html += '</div>';

      html += '</div>';
    });
    if (family.courses.length === 0) {
      html += '<div class="catmgr-empty">No courses in this family.</div>';
    }
    html += '</div>';

    // Footer actions
    html += '<div class="catmgr-actions">';
    html += '<button class="catmgr-btn catmgr-save">Save</button>';
    html += '<button class="catmgr-btn catmgr-cancel">Cancel</button>';
    html += '</div>';

    panel.innerHTML = html;

    // Insert after family header
    headerEl.insertAdjacentElement("afterend", panel);
    // Bind events
    bindPanelEvents(panel);
  }

  /**
   * Bind all interactive events on the panel.
   */
  function bindPanelEvents(panel) {
    // Close
    panel.querySelector(".catmgr-close").addEventListener("click", close);
    panel.querySelector(".catmgr-cancel").addEventListener("click", close);

    // Move up
    panel.querySelectorAll(".catmgr-up").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-idx"), 10);
        moveUp(idx);
      });
    });

    // Move down
    panel.querySelectorAll(".catmgr-down").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-idx"), 10);
        moveDown(idx);
      });
    });

    // Rename
    panel.querySelectorAll(".catmgr-rename").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-idx"), 10);
        startRename(idx);
      });
    });

    // Delete
    panel.querySelectorAll(".catmgr-delete").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-idx"), 10);
        confirmDelete(idx);
      });
    });

    // Save
    panel.querySelector(".catmgr-save").addEventListener("click", saveCatalog);
  }

  /**
   * Swap course at idx with the one above it.
   */
  function moveUp(idx) {
    var family = getFamily();
    if (!family || idx <= 0) return;
    var temp = family.courses[idx - 1];
    family.courses[idx - 1] = family.courses[idx];
    family.courses[idx] = temp;
    renderPanel();
  }

  /**
   * Swap course at idx with the one below it.
   */
  function moveDown(idx) {
    var family = getFamily();
    if (!family || idx >= family.courses.length - 1) return;
    var temp = family.courses[idx + 1];
    family.courses[idx + 1] = family.courses[idx];
    family.courses[idx] = temp;
    renderPanel();
  }

  /**
   * Replace the title span with an input for inline editing.
   */
  function startRename(idx) {
    var family = getFamily();
    if (!family) return;
    var course = family.courses[idx];
    var titleSpan = document.querySelector('.catmgr-course-title[data-idx="' + idx + '"]');
    if (!titleSpan) return;

    var input = document.createElement("input");
    input.type = "text";
    input.className = "catmgr-rename-input";
    input.value = course.title;

    titleSpan.replaceWith(input);
    input.focus();
    input.select();

    function commitRename() {
      var newTitle = input.value.trim();
      if (newTitle && newTitle !== course.title) {
        course.title = newTitle;
      }
      renderPanel();
    }

    input.addEventListener("blur", commitRename);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); commitRename(); }
      if (e.key === "Escape") { renderPanel(); }
    });
  }

  /**
   * Show inline delete confirmation.
   */
  function confirmDelete(idx) {
    var family = getFamily();
    if (!family) return;
    var course = family.courses[idx];

    var item = document.querySelector('.catmgr-item[data-idx="' + idx + '"]');
    if (!item) return;

    // Replace item content with confirmation
    var html = '<div class="catmgr-confirm">';
    html += '<span>Delete <strong>' + OB.ui.esc(course.id) + '</strong>?</span>';
    html += '<button class="catmgr-btn catmgr-confirm-yes">Delete</button>';
    html += '<button class="catmgr-btn catmgr-confirm-no">Cancel</button>';
    html += '</div>';
    item.innerHTML = html;

    item.querySelector(".catmgr-confirm-yes").addEventListener("click", function () {
      deleteCourse(idx);
    });
    item.querySelector(".catmgr-confirm-no").addEventListener("click", function () {
      renderPanel();
    });
  }

  /**
   * Remove a course from the family. Clean up prerequisite references.
   */
  function deleteCourse(idx) {
    var family = getFamily();
    if (!family) return;
    var deletedId = family.courses[idx].id;

    // Remove from array
    family.courses.splice(idx, 1);

    // Clean up prerequisite references across ALL families
    workingCatalog.families.forEach(function (fam) {
      fam.courses.forEach(function (c) {
        if (c.prerequisite === deletedId) {
          c.prerequisite = null;
        }
      });
    });

    // Clear localStorage for this course
    clearCourseStorage(deletedId);

    renderPanel();
  }

  /**
   * Remove localStorage entries for a deleted course.
   */
  function clearCourseStorage(courseId) {
    var prefix = "ob_" + courseId + "_";
    var keysToRemove = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf(prefix) === 0) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(function (k) { localStorage.removeItem(k); });
  }

  /**
   * POST the updated catalog to the dev server which writes both
   * catalog.json and catalog-bundle.js to disk.
   */
  function saveCatalog() {
    if (!workingCatalog) return;

    // Ensure comingSoon courses stay marked
    workingCatalog.families.forEach(function (fam) {
      fam.courses.forEach(function (c) {
        if (typeof c.comingSoon === "undefined") c.comingSoon = true;
      });
    });

    var saveBtn = document.querySelector(".catmgr-save");
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Saving\u2026"; }

    fetch("/api/save-catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ catalog: workingCatalog })
    })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status === 404 || res.status === 501
          ? "Server does not support saving. Run: python serve.py"
          : "Server error " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data.error) throw new Error(data.error);

        // Full page refresh to pick up updated files
        location.reload();
      })
      .catch(function (err) {
        // Show error in panel footer
        var actions = document.querySelector(".catmgr-actions");
        if (actions) {
          var errEl = actions.querySelector(".catmgr-error");
          if (!errEl) {
            errEl = document.createElement("div");
            errEl.className = "catmgr-error";
            actions.prepend(errEl);
          }
          errEl.textContent = "Save failed: " + err.message;
        }
        if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = "Save"; }
      });
  }

  OB.catalogManager = { open: open, close: close };
})();
