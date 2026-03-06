/**
 * OB -- Onboarding -- Author Mode
 * =================================
 * Server-powered image block insertion for content authors.
 * Activated via ?edit=true URL param.
 * Shows a camera FAB on topic/module routes that opens a modal with:
 *   - Image file picker + preview
 *   - Insertion point picker (fetched from /api/module-structure)
 *   - Save & Insert (uploads image + inserts block via API)
 * Attached to window.OB.author.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var fab = null;
  var objectUrl = null;
  var selectedFile = null;
  var modalEl = null;
  var selectedSlot = null; // { topicId, insertIndex }
  var moduleStructure = null;

  /**
   * Guard: only close modal on backdrop click if mousedown also started
   * on the backdrop. Prevents close when releasing a CSS resize drag.
   */
  var _backdropMouseDownTarget = null;
  function bindBackdropClose(backdropEl, closeFn) {
    backdropEl.addEventListener("mousedown", function (e) {
      _backdropMouseDownTarget = e.target;
    });
    backdropEl.addEventListener("click", function (e) {
      if (e.target === backdropEl && _backdropMouseDownTarget === backdropEl) {
        closeFn();
      }
      _backdropMouseDownTarget = null;
    });
  }

  /**
   * Add maximize/restore button to any modal's header.
   * Call after appending the modal to the DOM.
   */
  function initModalControls(backdropEl) {
    var modal = backdropEl.querySelector(".author-modal");
    var header = backdropEl.querySelector(".author-modal-header");
    var closeBtn = header.querySelector(".author-modal-close");
    if (!modal || !header || !closeBtn) return;

    // Wrap close (and new maximize) in a controls container
    var controls = document.createElement("div");
    controls.className = "author-modal-controls";

    var maxBtn = document.createElement("button");
    maxBtn.className = "author-modal-maximize";
    maxBtn.title = "Maximize";
    maxBtn.innerHTML = "&#9744;"; // ☐ empty square
    controls.appendChild(maxBtn);

    // Move close button into controls
    closeBtn.parentNode.removeChild(closeBtn);
    controls.appendChild(closeBtn);
    header.appendChild(controls);

    // Store original size for restore
    var origWidth = null;
    var origHeight = null;

    maxBtn.addEventListener("click", function () {
      if (modal.classList.contains("maximized")) {
        // Restore
        modal.classList.remove("maximized");
        if (origWidth) modal.style.width = origWidth;
        if (origHeight) modal.style.height = origHeight;
        maxBtn.innerHTML = "&#9744;";
        maxBtn.title = "Maximize";
      } else {
        // Save current size before maximizing
        origWidth = modal.style.width || "";
        origHeight = modal.style.height || "";
        modal.classList.add("maximized");
        maxBtn.innerHTML = "&#9723;"; // ◻ restore icon
        maxBtn.title = "Restore";
      }
    });
  }

  function isAuthorMode() {
    var params = new URLSearchParams(window.location.search);
    return params.get("edit") === "true";
  }

  function getCourseId() {
    var params = new URLSearchParams(window.location.search);
    return params.get("course") || "";
  }

  function getCurrentHash() {
    return window.location.hash || "#/";
  }

  /** Extract current topic ID from hash, e.g. "#/topic/m1t2" → "m1t2" */
  function getCurrentTopicId() {
    var m = getCurrentHash().match(/^#\/topic\/(.+)$/);
    return m ? m[1] : null;
  }

  /** Extract current module ID from hash or topic ID */
  function getCurrentModuleId() {
    var hash = getCurrentHash();
    var m = hash.match(/^#\/module\/(.+)$/);
    if (m) return m[1];
    var topicId = getCurrentTopicId();
    if (topicId) return topicId.replace(/t\d+$/, "");
    return null;
  }

  /** Check if FAB should be visible (any course route in edit mode) */
  function shouldShowFab() {
    return !!getCourseId();
  }

  /** Get the moduleFile for the current module from course.json */
  function getModuleFile(moduleId) {
    return OB.content.getCourse().then(function (course) {
      var mod = course.modules.find(function (m) { return m.id === moduleId; });
      return mod ? mod.contentFile : null;
    });
  }

  /* ---- FAB ---- */

  function createFab() {
    fab = document.createElement("button");
    fab.className = "author-fab";
    fab.title = "Insert image block";
    fab.innerHTML = "&#128247;";
    fab.addEventListener("click", openModal);
    document.getElementById("app").appendChild(fab);
  }

  function updateFabVisibility() {
    if (!fab) return;
    if (shouldShowFab()) {
      fab.classList.add("visible");
    } else {
      fab.classList.remove("visible");
    }
  }

  /* ---- Modal ---- */

  /**
   * Open modal with a pre-selected insertion point (called from inline buttons).
   */
  function openModalAt(topicId, insertIndex) {
    selectedSlot = { topicId: topicId, insertIndex: insertIndex };
    openModal(true);
  }

  function openModal(hasPreselectedSlot) {
    if (modalEl) return;

    if (!hasPreselectedSlot) {
      selectedSlot = null;
    }
    moduleStructure = null;

    var html =
      '<div class="author-backdrop" id="author-backdrop">' +
        '<div class="author-modal" role="dialog" aria-label="Insert image block">' +
          '<div class="author-modal-header">' +
            '<h3>Insert Image Block</h3>' +
            '<button class="author-modal-close" id="author-close">&#10005;</button>' +
          '</div>' +
          '<div class="author-modal-body">' +

            /* File picker */
            '<div class="author-field">' +
              '<label class="author-label">Image File</label>' +
              '<div class="author-file-zone" id="author-file-zone">' +
                '<input type="file" accept="image/*" id="author-file-input" style="display:none">' +
                '<span id="author-file-prompt">Click to browse for an image&hellip;</span>' +
              '</div>' +
            '</div>' +

            /* Preview */
            '<div class="author-preview" id="author-preview" style="display:none"></div>' +

            /* Alt text */
            '<div class="author-field">' +
              '<label class="author-label">Alt Text <span style="color:var(--c-warning)">*</span></label>' +
              '<input type="text" class="author-input" id="author-alt" placeholder="Describe the image for accessibility">' +
            '</div>' +

            /* Caption */
            '<div class="author-field">' +
              '<label class="author-label">Caption <span style="color:var(--c-text-dim)">(optional)</span></label>' +
              '<input type="text" class="author-input" id="author-caption" placeholder="Visible caption below image">' +
            '</div>' +

            /* Size */
            '<div class="author-field">' +
              '<label class="author-label">Size</label>' +
              '<div class="author-size-group" id="author-size-group">' +
                '<button class="author-size-option selected" data-size="full">Full</button>' +
                '<button class="author-size-option" data-size="medium">Medium</button>' +
                '<button class="author-size-option" data-size="small">Small</button>' +
              '</div>' +
            '</div>' +

            /* Insertion point picker (hidden when pre-selected from inline button) */
            '<div class="author-field" id="author-picker-field">' +
              '<label class="author-label">Insertion Point <span style="color:var(--c-warning)">*</span></label>' +
              '<div class="author-picker-scroll" id="author-picker"></div>' +
            '</div>' +

            /* Pre-selected insertion info (shown when opened from inline button) */
            '<div class="author-field" id="author-preselected-info" style="display:none">' +
              '<label class="author-label">Insertion Point</label>' +
              '<div class="author-preselected-slot">' +
                '<span class="author-preselected-icon">&#10003;</span>' +
                '<span id="author-preselected-label"></span>' +
              '</div>' +
            '</div>' +

            /* Save button */
            '<button class="author-save-btn" id="author-save" disabled>Save &amp; Insert</button>' +
            '<div class="author-save-status" id="author-status"></div>' +

          '</div>' +
        '</div>' +
      '</div>';

    var container = document.createElement("div");
    container.innerHTML = html;
    modalEl = container.firstChild;
    document.body.appendChild(modalEl);
    initModalControls(modalEl);

    // Wire up events
    var backdrop = modalEl;
    var closeBtn = document.getElementById("author-close");
    var fileZone = document.getElementById("author-file-zone");
    var fileInput = document.getElementById("author-file-input");
    var sizeGroup = document.getElementById("author-size-group");
    var saveBtn = document.getElementById("author-save");

    bindBackdropClose(backdrop, closeModal);
    closeBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", onEscape);

    fileZone.addEventListener("click", function () { fileInput.click(); });
    fileInput.addEventListener("change", onFileSelected);

    sizeGroup.addEventListener("click", function (e) {
      var btn = e.target.closest(".author-size-option");
      if (!btn) return;
      var options = sizeGroup.querySelectorAll(".author-size-option");
      for (var i = 0; i < options.length; i++) options[i].classList.remove("selected");
      btn.classList.add("selected");
    });

    saveBtn.addEventListener("click", doSaveAndInsert);

    // Handle pre-selected slot or show picker
    if (selectedSlot) {
      document.getElementById("author-picker-field").style.display = "none";
      var infoEl = document.getElementById("author-preselected-info");
      infoEl.style.display = "";
      document.getElementById("author-preselected-label").textContent =
        "Topic " + selectedSlot.topicId + ", position " + selectedSlot.insertIndex;
      // Still need moduleFile for save — load it in background
      loadModuleFileForSlot();
    } else {
      loadInsertionPicker();
    }
  }

  function closeModal() {
    document.removeEventListener("keydown", onEscape);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    selectedFile = null;
    selectedSlot = null;
    moduleStructure = null;
    if (modalEl) {
      modalEl.remove();
      modalEl = null;
    }
  }

  function onEscape(e) {
    if (e.key === "Escape") closeModal();
  }

  function onFileSelected(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;

    selectedFile = file;

    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);

    var zone = document.getElementById("author-file-zone");
    zone.classList.add("has-file");
    var prompt = document.getElementById("author-file-prompt");
    prompt.textContent = file.name;

    var preview = document.getElementById("author-preview");
    preview.style.display = "block";
    preview.innerHTML =
      '<img src="' + objectUrl + '" alt="Preview">' +
      '<div class="author-file-info">' + OB.ui.esc(file.name) + ' &middot; ' + formatSize(file.size) + '</div>';

    updateSaveState();
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function getSelectedSize() {
    if (!modalEl) return "full";
    var sel = modalEl.querySelector(".author-size-option.selected");
    return sel ? sel.getAttribute("data-size") : "full";
  }

  function updateSaveState() {
    var btn = document.getElementById("author-save");
    if (!btn) return;
    btn.disabled = !(selectedFile && selectedSlot);
  }

  /* ---- Insertion Point Picker ---- */

  /** Load moduleFile when slot is pre-selected (no picker needed). */
  function loadModuleFileForSlot() {
    var moduleId = selectedSlot.topicId.replace(/t\d+$/, "");
    getModuleFile(moduleId).then(function (moduleFile) {
      if (!moduleFile) return;
      moduleStructure = { _moduleFile: moduleFile };
    });
  }

  function loadInsertionPicker() {
    var picker = document.getElementById("author-picker");
    if (!picker) return;

    var moduleId = getCurrentModuleId();
    if (!moduleId) {
      picker.innerHTML = '<div class="author-loading">No module context</div>';
      return;
    }

    picker.innerHTML = '<div class="author-loading">Loading module structure&hellip;</div>';

    getModuleFile(moduleId).then(function (moduleFile) {
      if (!moduleFile) {
        picker.innerHTML = '<div class="author-loading">Module not found</div>';
        return;
      }

      var courseId = getCourseId();
      return fetch("/api/module-structure?courseId=" + encodeURIComponent(courseId) +
        "&moduleFile=" + encodeURIComponent(moduleFile), { cache: "no-store" })
        .then(function (res) {
          if (!res.ok) throw new Error("API error: " + res.status);
          return res.json();
        })
        .then(function (data) {
          moduleStructure = data;
          moduleStructure._moduleFile = moduleFile;
          renderPicker(data);
        });
    }).catch(function (err) {
      picker.innerHTML = '<div class="author-loading" style="color:var(--c-warning)">' +
        OB.ui.esc(err.message) + '</div>';
    });
  }

  function renderPicker(data) {
    var picker = document.getElementById("author-picker");
    if (!picker) return;

    var currentTopicId = getCurrentTopicId();
    var html = "";

    data.topics.forEach(function (topic) {
      var expanded = topic.id === currentTopicId;
      html += '<div class="author-topic-group' + (expanded ? ' expanded' : '') +
        '" data-topic="' + OB.ui.esc(topic.id) + '">';
      html += '<button class="author-topic-header">';
      html += '<span class="author-chevron">&#9654;</span>';
      html += '<span class="author-topic-id">' + OB.ui.esc(topic.id) + '</span>';
      html += '<span>' + OB.ui.esc(topic.title) + '</span>';
      html += '</button>';
      html += '<div class="author-topic-blocks">';

      // Insert slot at index 0 (before first block)
      html += renderInsertSlot(topic.id, 0);

      topic.blocks.forEach(function (block, i) {
        html += '<div class="author-block-item">';
        html += '<span class="author-block-type">' + OB.ui.esc(block.type) + '</span>';
        html += '<span class="author-block-preview">' + OB.ui.esc(block.preview) + '</span>';
        html += '</div>';
        // Insert slot after this block
        html += renderInsertSlot(topic.id, i + 1);
      });

      html += '</div></div>';
    });

    picker.innerHTML = html;

    // Wire up topic header toggles
    picker.querySelectorAll(".author-topic-header").forEach(function (header) {
      header.addEventListener("click", function () {
        header.parentElement.classList.toggle("expanded");
      });
    });

    // Wire up insert slots
    picker.querySelectorAll(".author-insert-slot").forEach(function (slot) {
      slot.addEventListener("click", function () {
        // Deselect all
        picker.querySelectorAll(".author-insert-slot.selected").forEach(function (s) {
          s.classList.remove("selected");
        });
        slot.classList.add("selected");
        selectedSlot = {
          topicId: slot.getAttribute("data-topic"),
          insertIndex: parseInt(slot.getAttribute("data-index"), 10),
        };
        updateSaveState();
      });
    });
  }

  function renderInsertSlot(topicId, index) {
    return '<button class="author-insert-slot" data-topic="' + OB.ui.esc(topicId) +
      '" data-index="' + index + '">' +
      '<span class="author-insert-icon">+</span> Insert here' +
      '</button>';
  }

  /* ---- Save & Insert ---- */

  function doSaveAndInsert() {
    if (!selectedFile || !selectedSlot) return;

    var altInput = document.getElementById("author-alt");
    var alt = altInput.value.trim();
    if (!alt) {
      altInput.classList.add("error");
      altInput.focus();
      setTimeout(function () { altInput.classList.remove("error"); }, 2000);
      return;
    }

    var saveBtn = document.getElementById("author-save");
    var statusEl = document.getElementById("author-status");
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving\u2026";
    statusEl.className = "author-save-status";
    statusEl.textContent = "";

    var courseId = getCourseId();
    var caption = (document.getElementById("author-caption").value || "").trim();
    var size = getSelectedSize();

    // Step 1: Upload image
    var formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("file", selectedFile);

    fetch("/api/image", { method: "POST", body: formData, cache: "no-store" })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Upload failed"); });
        return res.json();
      })
      .then(function (imgResult) {
        // Step 2: Build block and insert
        var block = {
          type: "image",
          src: imgResult.path,
          alt: alt,
        };
        if (caption) block.caption = caption;
        if (size !== "full") block.size = size;

        return fetch("/api/content-block", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            courseId: courseId,
            moduleFile: moduleStructure._moduleFile,
            topicId: selectedSlot.topicId,
            insertIndex: selectedSlot.insertIndex,
            block: block,
          }),
        });
      })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Insert failed"); });
        return res.json();
      })
      .then(function () {
        statusEl.className = "author-save-status success";
        statusEl.textContent = "Saved! Refreshing\u2026";

        // Invalidate cache and refresh the page
        OB.content.clearCache();
        setTimeout(function () {
          closeModal();
          OB.router.navigate();
        }, 500);
      })
      .catch(function (err) {
        statusEl.className = "author-save-status error";
        statusEl.textContent = err.message;
        saveBtn.disabled = false;
        saveBtn.textContent = "Save & Insert";
      });
  }

  /* ---- Init ---- */

  function init() {
    if (!isAuthorMode()) return;
    createFab();
    updateFabVisibility();
    window.addEventListener("hashchange", updateFabVisibility);
  }

  function isEditMode() {
    return isAuthorMode();
  }

  function deleteBlock(topicId, blockIndex) {
    var moduleId = topicId.replace(/t\d+$/, "");
    getModuleFile(moduleId).then(function (moduleFile) {
      if (!moduleFile) { alert("Module not found"); return; }

      if (!confirm("Delete this content block?")) return;

      fetch("/api/content-block", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          courseId: getCourseId(),
          moduleFile: moduleFile,
          topicId: topicId,
          blockIndex: blockIndex,
        }),
      })
        .then(function (res) {
          if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Delete failed"); });
          return res.json();
        })
        .then(function () {
          OB.content.clearCache();
          OB.router.navigate();
        })
        .catch(function (err) {
          alert("Delete failed: " + err.message);
        });
    });
  }

  function moveBlock(topicId, blockIndex, direction) {
    var moduleId = topicId.replace(/t\d+$/, "");
    getModuleFile(moduleId).then(function (moduleFile) {
      if (!moduleFile) { alert("Module not found"); return; }

      fetch("/api/content-block", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          courseId: getCourseId(),
          moduleFile: moduleFile,
          topicId: topicId,
          blockIndex: blockIndex,
          direction: direction,
        }),
      })
        .then(function (res) {
          if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Move failed"); });
          return res.json();
        })
        .then(function () {
          OB.content.clearCache();
          OB.router.navigate();
        })
        .catch(function (err) {
          alert("Move failed: " + err.message);
        });
    });
  }

  /* ==================================================================
     Edit Modal Infrastructure — type-adaptive content editing
     ================================================================== */

  var editModalEl = null;

  function openEditModalForBlock(topicId, blockIndex) {
    var moduleId = topicId.replace(/t\d+$/, "");
    OB.content.getModule(moduleId).then(function (moduleData) {
      var topic = moduleData.content.topics.find(function (t) { return t.id === topicId; });
      if (!topic || !topic.content[blockIndex]) {
        alert("Block not found");
        return;
      }
      openEditModal(topicId, blockIndex, JSON.parse(JSON.stringify(topic.content[blockIndex])));
    });
  }

  function openEditModal(topicId, blockIndex, blockData) {
    if (editModalEl) return;

    var formHtml = buildEditForm(blockData);
    var html =
      '<div class="author-backdrop" id="edit-backdrop">' +
        '<div class="author-modal" role="dialog" aria-label="Edit block">' +
          '<div class="author-modal-header">' +
            '<h3>Edit ' + OB.ui.esc(blockData.type) + '</h3>' +
            '<button class="author-modal-close" id="edit-close">&#10005;</button>' +
          '</div>' +
          '<div class="author-modal-body">' +
            formHtml +
            '<button class="author-save-btn" id="edit-save">Save Changes</button>' +
            '<div class="author-save-status" id="edit-status"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var container = document.createElement("div");
    container.innerHTML = html;
    editModalEl = container.firstChild;
    document.body.appendChild(editModalEl);
    initModalControls(editModalEl);

    initEditFormInteractions(blockData);

    bindBackdropClose(editModalEl, closeEditModal);
    document.getElementById("edit-close").addEventListener("click", closeEditModal);
    document.addEventListener("keydown", onEditEscape);

    document.getElementById("edit-save").addEventListener("click", function () {
      var updated = extractBlockData(blockData.type);
      if (!updated) return;
      updateBlock(topicId, blockIndex, updated);
    });
  }

  function closeEditModal() {
    document.removeEventListener("keydown", onEditEscape);
    if (editModalEl) {
      editModalEl.remove();
      editModalEl = null;
    }
  }

  function onEditEscape(e) {
    if (e.key === "Escape") closeEditModal();
  }

  function updateBlock(topicId, blockIndex, updatedBlock) {
    var moduleId = topicId.replace(/t\d+$/, "");
    var saveBtn = document.getElementById("edit-save");
    var statusEl = document.getElementById("edit-status");
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Saving\u2026"; }

    getModuleFile(moduleId).then(function (moduleFile) {
      if (!moduleFile) throw new Error("Module not found");
      return fetch("/api/content-block", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          courseId: getCourseId(),
          moduleFile: moduleFile,
          topicId: topicId,
          blockIndex: blockIndex,
          block: updatedBlock,
        }),
      });
    })
    .then(function (res) {
      if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Update failed"); });
      return res.json();
    })
    .then(function () {
      if (statusEl) { statusEl.className = "author-save-status success"; statusEl.textContent = "Saved!"; }
      OB.content.clearCache();
      setTimeout(function () {
        closeEditModal();
        OB.router.navigate();
      }, 400);
    })
    .catch(function (err) {
      if (statusEl) { statusEl.className = "author-save-status error"; statusEl.textContent = err.message; }
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = "Save Changes"; }
    });
  }

  /* ---- Form Builders ---- */

  var formBuilders = {
    paragraph: function (b) {
      return '<div class="author-field">' +
        '<label class="author-label">Text</label>' +
        '<textarea class="author-textarea" id="edit-text" rows="4">' + OB.ui.esc(b.text || '') + '</textarea>' +
      '</div>';
    },

    heading: function (b) {
      var level = b.level || 2;
      return '<div class="author-field">' +
        '<label class="author-label">Text</label>' +
        '<input class="author-input" id="edit-text" type="text" value="' + OB.ui.esc(b.text || '') + '">' +
      '</div>' +
      '<div class="author-field">' +
        '<label class="author-label">Level</label>' +
        '<div class="author-toggle-group" id="edit-level">' +
          '<button class="author-toggle-option' + (level === 2 ? ' selected' : '') + '" data-val="2">H2</button>' +
          '<button class="author-toggle-option' + (level === 3 ? ' selected' : '') + '" data-val="3">H3</button>' +
        '</div>' +
      '</div>';
    },

    callout: function (b) {
      var variants = ["info", "tip", "warning", "insight"];
      var toggles = '';
      variants.forEach(function (v) {
        toggles += '<button class="author-toggle-option' + (b.variant === v ? ' selected' : '') + '" data-val="' + v + '">' + v + '</button>';
      });
      return '<div class="author-field">' +
        '<label class="author-label">Variant</label>' +
        '<div class="author-toggle-group" id="edit-variant">' + toggles + '</div>' +
      '</div>' +
      '<div class="author-field">' +
        '<label class="author-label">Text</label>' +
        '<textarea class="author-textarea" id="edit-text" rows="3">' + OB.ui.esc(b.text || '') + '</textarea>' +
      '</div>';
    },

    "comparison-table": function (b) {
      var headers = b.headers || [];
      var rows = b.rows || [];
      var cols = headers.length || 2;
      var html = '<div class="author-field">' +
        '<label class="author-label">Table (' + cols + ' columns, ' + rows.length + ' rows)</label>' +
        '<div class="author-table-grid" id="edit-table" style="grid-template-columns: repeat(' + cols + ', 1fr)">';
      // Headers
      headers.forEach(function (h, ci) {
        html += '<input class="author-input header-cell" data-row="-1" data-col="' + ci + '" value="' + OB.ui.esc(h) + '">';
      });
      // Rows
      rows.forEach(function (row, ri) {
        row.forEach(function (cell, ci) {
          html += '<input class="author-input" data-row="' + ri + '" data-col="' + ci + '" value="' + OB.ui.esc(cell) + '">';
        });
      });
      html += '</div>';
      html += '<div class="author-table-actions">' +
        '<button class="author-list-add" id="edit-add-row" style="width:auto;flex:1">+ Row</button>' +
        '<button class="author-list-add" id="edit-add-col" style="width:auto;flex:1">+ Column</button>' +
        '<button class="author-list-remove" id="edit-rem-row" title="Remove last row" style="width:auto;padding:4px 8px;font-size:12px">- Row</button>' +
        '<button class="author-list-remove" id="edit-rem-col" title="Remove last column" style="width:auto;padding:4px 8px;font-size:12px">- Col</button>' +
      '</div></div>';
      return html;
    },

    "reveal-cards": function (b) {
      var cards = b.cards || [];
      var html = '<div class="author-field"><label class="author-label">Cards</label><div id="edit-cards">';
      cards.forEach(function (card, i) {
        html += buildCardItem(card, i);
      });
      html += '</div><button class="author-list-add" id="edit-add-card">+ Add Card</button></div>';
      return html;
    },

    "interactive-match": function (b) {
      var pairs = b.pairs || [];
      var html = '<div class="author-field">' +
        '<label class="author-label">Prompt</label>' +
        '<input class="author-input" id="edit-prompt" type="text" value="' + OB.ui.esc(b.prompt || '') + '">' +
      '</div>';
      html += '<div class="author-field"><label class="author-label">Pairs</label><div id="edit-pairs">';
      pairs.forEach(function (p, i) {
        html += buildPairItem(p, i);
      });
      html += '</div><button class="author-list-add" id="edit-add-pair">+ Add Pair</button></div>';
      return html;
    },

    "interactive-sort": function (b) {
      var items = b.items || [];
      var html = '<div class="author-field">' +
        '<label class="author-label">Prompt</label>' +
        '<input class="author-input" id="edit-prompt" type="text" value="' + OB.ui.esc(b.prompt || '') + '">' +
      '</div>';
      html += '<div class="author-field"><label class="author-label">Items (in correct order)</label><div id="edit-items">';
      items.forEach(function (item, i) {
        html += buildSortItem(item, i);
      });
      html += '</div><button class="author-list-add" id="edit-add-item">+ Add Item</button></div>';
      return html;
    },

    image: function (b) {
      var sizes = ["full", "medium", "small"];
      var sizeToggles = '';
      var curSize = b.size || "full";
      sizes.forEach(function (s) {
        sizeToggles += '<button class="author-toggle-option' + (curSize === s ? ' selected' : '') + '" data-val="' + s + '">' + s + '</button>';
      });
      return '<div class="author-field">' +
        '<label class="author-label">Source</label>' +
        '<input class="author-input" id="edit-src" type="text" value="' + OB.ui.esc(b.src || '') + '" readonly style="opacity:0.6">' +
      '</div>' +
      '<div class="author-field">' +
        '<label class="author-label">Alt Text</label>' +
        '<input class="author-input" id="edit-alt" type="text" value="' + OB.ui.esc(b.alt || '') + '">' +
      '</div>' +
      '<div class="author-field">' +
        '<label class="author-label">Caption</label>' +
        '<input class="author-input" id="edit-caption" type="text" value="' + OB.ui.esc(b.caption || '') + '">' +
      '</div>' +
      '<div class="author-field">' +
        '<label class="author-label">Size</label>' +
        '<div class="author-toggle-group" id="edit-size">' + sizeToggles + '</div>' +
      '</div>';
    },

    exercise: function (b) {
      var html = '<div class="author-field">' +
        '<label class="author-label">Title</label>' +
        '<input class="author-input" id="edit-ex-title" type="text" value="' + OB.ui.esc(b.title || '') + '">' +
      '</div>' +
      '<div class="author-field">' +
        '<label class="author-label">Objective</label>' +
        '<textarea class="author-textarea" id="edit-ex-objective" rows="2">' + OB.ui.esc(b.objective || '') + '</textarea>' +
      '</div>';
      html += '<div class="author-field"><label class="author-label">Tasks</label><div id="edit-tasks">';
      (b.tasks || []).forEach(function (task, ti) {
        html += buildTaskItem(task, ti);
      });
      html += '</div><button class="author-list-add" id="edit-add-task">+ Add Task</button></div>';
      return html;
    },
  };

  /* ---- List item builders ---- */

  function buildCardItem(card, i) {
    return '<div class="author-list-item" data-card="' + i + '">' +
      '<div style="flex:1;display:flex;flex-direction:column;gap:4px">' +
        '<input class="author-input" data-card-front="' + i + '" placeholder="Front" value="' + OB.ui.esc(card.front || '') + '">' +
        '<textarea class="author-textarea" data-card-back="' + i + '" placeholder="Back" rows="2">' + OB.ui.esc(card.back || '') + '</textarea>' +
      '</div>' +
      '<button class="author-list-remove" data-remove-card="' + i + '">&#10005;</button>' +
    '</div>';
  }

  function buildPairItem(pair, i) {
    return '<div class="author-list-item" data-pair="' + i + '">' +
      '<input class="author-input" data-pair-left="' + i + '" placeholder="Left" value="' + OB.ui.esc(pair.left || '') + '" style="flex:1">' +
      '<input class="author-input" data-pair-right="' + i + '" placeholder="Right" value="' + OB.ui.esc(pair.right || '') + '" style="flex:1">' +
      '<button class="author-list-remove" data-remove-pair="' + i + '">&#10005;</button>' +
    '</div>';
  }

  function buildSortItem(item, i) {
    return '<div class="author-list-item" data-sort-item="' + i + '">' +
      '<span style="color:var(--c-text-dim);font-size:11px;font-weight:700;min-width:20px">' + (i + 1) + '.</span>' +
      '<input class="author-input" data-sort-val="' + i + '" value="' + OB.ui.esc(item) + '" style="flex:1">' +
      '<button class="author-list-remove" data-remove-sort="' + i + '">&#10005;</button>' +
    '</div>';
  }

  function buildTaskItem(task, ti) {
    var html = '<div class="author-task-item" data-task="' + ti + '">' +
      '<div class="author-field">' +
        '<label class="author-label">Task ' + (ti + 1) + ' Title</label>' +
        '<input class="author-input" data-task-title="' + ti + '" value="' + OB.ui.esc(task.title || '') + '">' +
      '</div>' +
      '<div class="author-field"><label class="author-label">Steps</label><div data-task-steps="' + ti + '">';
    (task.steps || []).forEach(function (step, si) {
      html += buildStepItem(ti, step, si);
    });
    html += '</div><button class="author-list-add" data-add-step="' + ti + '">+ Add Step</button></div>' +
      '<button class="author-list-remove" data-remove-task="' + ti + '" style="margin-top:6px;width:100%;justify-content:center">Remove Task</button>' +
    '</div>';
    return html;
  }

  function buildStepItem(ti, step, si) {
    return '<div class="author-step-item" data-step="' + ti + '-' + si + '">' +
      '<div class="author-field"><label class="author-label">Action</label>' +
        '<textarea class="author-textarea" data-step-action="' + ti + '-' + si + '" rows="1">' + OB.ui.esc(step.action || '') + '</textarea></div>' +
      '<div class="author-field"><label class="author-label">Detail</label>' +
        '<textarea class="author-textarea" data-step-detail="' + ti + '-' + si + '" rows="1">' + OB.ui.esc(step.detail || '') + '</textarea></div>' +
      '<div class="author-field"><label class="author-label">Hint</label>' +
        '<textarea class="author-textarea" data-step-hint="' + ti + '-' + si + '" rows="1">' + OB.ui.esc(step.hint || '') + '</textarea></div>' +
      '<button class="author-list-remove" data-remove-step="' + ti + '-' + si + '">&#10005;</button>' +
    '</div>';
  }

  function buildEditForm(blockData) {
    var builder = formBuilders[blockData.type];
    if (!builder) {
      return '<div class="author-field"><p style="color:var(--c-text-dim)">No editor for block type: ' + OB.ui.esc(blockData.type) + '</p></div>';
    }
    return builder(blockData);
  }

  /* ---- Toggle group interactions ---- */

  function initEditFormInteractions(blockData) {
    if (!editModalEl) return;

    // Toggle groups (level, variant, size)
    editModalEl.querySelectorAll(".author-toggle-group").forEach(function (group) {
      group.addEventListener("click", function (e) {
        var btn = e.target.closest(".author-toggle-option");
        if (!btn) return;
        group.querySelectorAll(".author-toggle-option").forEach(function (b) { b.classList.remove("selected"); });
        btn.classList.add("selected");
      });
    });

    // Dynamic list actions
    if (blockData.type === "comparison-table") initTableInteractions(blockData);
    if (blockData.type === "reveal-cards") initDynamicList("card", buildCardItem, function () { return { front: "", back: "" }; });
    if (blockData.type === "interactive-match") initDynamicList("pair", buildPairItem, function () { return { left: "", right: "" }; });
    if (blockData.type === "interactive-sort") initSortListInteractions();
    if (blockData.type === "exercise") initExerciseInteractions();
  }

  function initTableInteractions(blockData) {
    var cols = (blockData.headers || []).length || 2;
    var rowCount = (blockData.rows || []).length;

    var addRowBtn = document.getElementById("edit-add-row");
    var addColBtn = document.getElementById("edit-add-col");
    var remRowBtn = document.getElementById("edit-rem-row");
    var remColBtn = document.getElementById("edit-rem-col");

    if (addRowBtn) addRowBtn.addEventListener("click", function () {
      rowCount++;
      rebuildTable(cols, rowCount);
    });
    if (addColBtn) addColBtn.addEventListener("click", function () {
      cols++;
      rebuildTable(cols, rowCount);
    });
    if (remRowBtn) remRowBtn.addEventListener("click", function () {
      if (rowCount > 1) { rowCount--; rebuildTable(cols, rowCount); }
    });
    if (remColBtn) remColBtn.addEventListener("click", function () {
      if (cols > 1) { cols--; rebuildTable(cols, rowCount); }
    });

    function rebuildTable(numCols, numRows) {
      var grid = document.getElementById("edit-table");
      if (!grid) return;
      // Read current values
      var curHeaders = [];
      var curRows = [];
      grid.querySelectorAll("[data-row='-1']").forEach(function (inp) {
        curHeaders[parseInt(inp.getAttribute("data-col"), 10)] = inp.value;
      });
      for (var r = 0; r < 100; r++) {
        var rowInputs = grid.querySelectorAll("[data-row='" + r + "']");
        if (rowInputs.length === 0) break;
        var row = [];
        rowInputs.forEach(function (inp) {
          row[parseInt(inp.getAttribute("data-col"), 10)] = inp.value;
        });
        curRows.push(row);
      }
      // Build new grid
      grid.style.gridTemplateColumns = "repeat(" + numCols + ", 1fr)";
      var html = "";
      for (var c = 0; c < numCols; c++) {
        html += '<input class="author-input header-cell" data-row="-1" data-col="' + c + '" value="' + OB.ui.esc(curHeaders[c] || '') + '">';
      }
      for (var ri = 0; ri < numRows; ri++) {
        for (var ci = 0; ci < numCols; ci++) {
          html += '<input class="author-input" data-row="' + ri + '" data-col="' + ci + '" value="' + OB.ui.esc((curRows[ri] && curRows[ri][ci]) || '') + '">';
        }
      }
      grid.innerHTML = html;
    }
  }

  function initDynamicList(itemType, buildFn, defaultFn) {
    var container = document.getElementById("edit-" + itemType + "s");
    var addBtn = document.getElementById("edit-add-" + itemType);
    if (!container || !addBtn) return;

    addBtn.addEventListener("click", function () {
      var count = container.querySelectorAll("[data-" + itemType + "]").length;
      var tmp = document.createElement("div");
      tmp.innerHTML = buildFn(defaultFn(), count);
      container.appendChild(tmp.firstChild);
      bindRemoveButtons(container, itemType);
    });
    bindRemoveButtons(container, itemType);
  }

  function bindRemoveButtons(container, itemType) {
    container.querySelectorAll("[data-remove-" + itemType + "]").forEach(function (btn) {
      btn.onclick = function () { btn.closest(".author-list-item").remove(); };
    });
  }

  function initSortListInteractions() {
    var container = document.getElementById("edit-items");
    var addBtn = document.getElementById("edit-add-item");
    if (!container || !addBtn) return;

    addBtn.addEventListener("click", function () {
      var count = container.querySelectorAll("[data-sort-item]").length;
      var tmp = document.createElement("div");
      tmp.innerHTML = buildSortItem("", count);
      container.appendChild(tmp.firstChild);
      bindSortRemoveButtons(container);
    });
    bindSortRemoveButtons(container);
  }

  function bindSortRemoveButtons(container) {
    container.querySelectorAll("[data-remove-sort]").forEach(function (btn) {
      btn.onclick = function () { btn.closest(".author-list-item").remove(); };
    });
  }

  function initExerciseInteractions() {
    var tasksContainer = document.getElementById("edit-tasks");
    var addTaskBtn = document.getElementById("edit-add-task");
    if (!tasksContainer || !addTaskBtn) return;

    addTaskBtn.addEventListener("click", function () {
      var count = tasksContainer.querySelectorAll("[data-task]").length;
      var tmp = document.createElement("div");
      tmp.innerHTML = buildTaskItem({ id: "task" + (count + 1), title: "", steps: [] }, count);
      tasksContainer.appendChild(tmp.firstChild);
      bindExerciseButtons(tasksContainer);
    });
    bindExerciseButtons(tasksContainer);
  }

  function bindExerciseButtons(container) {
    container.querySelectorAll("[data-remove-task]").forEach(function (btn) {
      btn.onclick = function () { btn.closest(".author-task-item").remove(); };
    });
    container.querySelectorAll("[data-add-step]").forEach(function (btn) {
      btn.onclick = function () {
        var ti = btn.getAttribute("data-add-step");
        var stepsContainer = container.querySelector("[data-task-steps='" + ti + "']");
        if (!stepsContainer) return;
        var count = stepsContainer.querySelectorAll("[data-step]").length;
        var tmp = document.createElement("div");
        tmp.innerHTML = buildStepItem(ti, { action: "", detail: "", hint: "" }, count);
        stepsContainer.appendChild(tmp.firstChild);
        bindStepRemoveButtons(stepsContainer);
      };
    });
    container.querySelectorAll("[data-task-steps]").forEach(function (sc) {
      bindStepRemoveButtons(sc);
    });
  }

  function bindStepRemoveButtons(container) {
    container.querySelectorAll("[data-remove-step]").forEach(function (btn) {
      btn.onclick = function () { btn.closest(".author-step-item").remove(); };
    });
  }

  /* ---- Extractors ---- */

  var extractors = {
    paragraph: function () {
      return { type: "paragraph", text: gVal("edit-text") };
    },
    heading: function () {
      var level = parseInt(getToggleVal("edit-level") || "2", 10);
      return { type: "heading", level: level, text: gVal("edit-text") };
    },
    callout: function () {
      return { type: "callout", variant: getToggleVal("edit-variant") || "info", text: gVal("edit-text") };
    },
    "comparison-table": function () {
      var grid = document.getElementById("edit-table");
      if (!grid) return null;
      var headers = [];
      grid.querySelectorAll("[data-row='-1']").forEach(function (inp) {
        headers[parseInt(inp.getAttribute("data-col"), 10)] = inp.value;
      });
      var rows = [];
      var maxRow = -1;
      grid.querySelectorAll("[data-row]").forEach(function (inp) {
        var r = parseInt(inp.getAttribute("data-row"), 10);
        if (r > maxRow) maxRow = r;
      });
      for (var r = 0; r <= maxRow; r++) {
        var rowInputs = grid.querySelectorAll("[data-row='" + r + "']");
        if (rowInputs.length === 0) continue;
        var row = [];
        rowInputs.forEach(function (inp) {
          row[parseInt(inp.getAttribute("data-col"), 10)] = inp.value;
        });
        rows.push(row);
      }
      return { type: "comparison-table", headers: headers, rows: rows };
    },
    "reveal-cards": function () {
      var cards = [];
      var container = document.getElementById("edit-cards");
      if (!container) return null;
      container.querySelectorAll("[data-card]").forEach(function (el) {
        var i = el.getAttribute("data-card");
        var front = (container.querySelector("[data-card-front='" + i + "']") || {}).value || "";
        var back = (container.querySelector("[data-card-back='" + i + "']") || {}).value || "";
        cards.push({ front: front, back: back });
      });
      return { type: "reveal-cards", cards: cards };
    },
    "interactive-match": function () {
      var pairs = [];
      var container = document.getElementById("edit-pairs");
      if (!container) return null;
      container.querySelectorAll("[data-pair]").forEach(function (el) {
        var i = el.getAttribute("data-pair");
        var left = (container.querySelector("[data-pair-left='" + i + "']") || {}).value || "";
        var right = (container.querySelector("[data-pair-right='" + i + "']") || {}).value || "";
        pairs.push({ left: left, right: right });
      });
      return { type: "interactive-match", prompt: gVal("edit-prompt"), pairs: pairs };
    },
    "interactive-sort": function () {
      var items = [];
      var container = document.getElementById("edit-items");
      if (!container) return null;
      container.querySelectorAll("[data-sort-item]").forEach(function (el) {
        var i = el.getAttribute("data-sort-item");
        var val = (container.querySelector("[data-sort-val='" + i + "']") || {}).value || "";
        if (val) items.push(val);
      });
      return { type: "interactive-sort", prompt: gVal("edit-prompt"), items: items };
    },
    image: function () {
      var block = { type: "image", src: gVal("edit-src"), alt: gVal("edit-alt") };
      var caption = gVal("edit-caption");
      if (caption) block.caption = caption;
      var size = getToggleVal("edit-size");
      if (size && size !== "full") block.size = size;
      return block;
    },
    exercise: function () {
      var tasks = [];
      var container = document.getElementById("edit-tasks");
      if (!container) return null;
      container.querySelectorAll("[data-task]").forEach(function (el) {
        var ti = el.getAttribute("data-task");
        var title = (el.querySelector("[data-task-title='" + ti + "']") || {}).value || "";
        var steps = [];
        el.querySelectorAll("[data-step]").forEach(function (stepEl) {
          var key = stepEl.getAttribute("data-step");
          var action = (stepEl.querySelector("[data-step-action='" + key + "']") || {}).value || "";
          var detail = (stepEl.querySelector("[data-step-detail='" + key + "']") || {}).value || "";
          var hint = (stepEl.querySelector("[data-step-hint='" + key + "']") || {}).value || "";
          var step = { action: action };
          if (detail) step.detail = detail;
          if (hint) step.hint = hint;
          steps.push(step);
        });
        tasks.push({ id: "task" + (tasks.length + 1), title: title, steps: steps });
      });
      return {
        type: "exercise",
        exerciseId: gVal("edit-ex-title").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "exercise",
        title: gVal("edit-ex-title"),
        objective: gVal("edit-ex-objective"),
        tasks: tasks,
      };
    },
  };

  function extractBlockData(blockType) {
    var extractor = extractors[blockType];
    return extractor ? extractor() : null;
  }

  function gVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function getToggleVal(groupId) {
    var group = document.getElementById(groupId);
    if (!group) return null;
    var sel = group.querySelector(".author-toggle-option.selected");
    return sel ? sel.getAttribute("data-val") : null;
  }

  /* ==================================================================
     Quiz Editing
     ================================================================== */

  function getQuizFile(moduleId) {
    return OB.content.getCourse().then(function (course) {
      var mod = course.modules.find(function (m) { return m.id === moduleId; });
      return mod ? mod.quizFile : null;
    });
  }

  function openQuizEditModal(moduleId, questionIndex, questionData) {
    if (editModalEl) return;

    var q = JSON.parse(JSON.stringify(questionData));
    var letters = ["A", "B", "C", "D"];
    var html = '<div class="author-field">' +
      '<label class="author-label">Question</label>' +
      '<textarea class="author-textarea" id="edit-q-question" rows="2">' + OB.ui.esc(q.question || '') + '</textarea>' +
    '</div>';

    html += '<div class="author-field"><label class="author-label">Options</label>';
    (q.options || []).forEach(function (opt, i) {
      html += '<div class="author-option-row">' +
        '<input type="radio" name="edit-q-answer" class="author-answer-radio" value="' + i + '"' + (q.answerIndex === i ? ' checked' : '') + '>' +
        '<span style="font-weight:700;color:var(--c-text-dim);min-width:16px">' + letters[i] + '</span>' +
        '<input class="author-input" data-q-opt="' + i + '" value="' + OB.ui.esc(opt) + '">' +
      '</div>';
    });
    html += '</div>';

    html += '<div class="author-field">' +
      '<label class="author-label">Rationale</label>' +
      '<textarea class="author-textarea" id="edit-q-rationale" rows="2">' + OB.ui.esc(q.rationale || '') + '</textarea>' +
    '</div>';

    html += '<div class="author-field">' +
      '<label class="author-label">Topic</label>' +
      '<input class="author-input" id="edit-q-topic" type="text" value="' + OB.ui.esc(q.topic || '') + '">' +
    '</div>';

    var modalHtml =
      '<div class="author-backdrop" id="edit-backdrop">' +
        '<div class="author-modal" role="dialog" aria-label="Edit question">' +
          '<div class="author-modal-header">' +
            '<h3>Edit Question ' + (questionIndex + 1) + '</h3>' +
            '<button class="author-modal-close" id="edit-close">&#10005;</button>' +
          '</div>' +
          '<div class="author-modal-body">' +
            html +
            '<button class="author-save-btn" id="edit-save">Save Question</button>' +
            '<div class="author-save-status" id="edit-status"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var container = document.createElement("div");
    container.innerHTML = modalHtml;
    editModalEl = container.firstChild;
    document.body.appendChild(editModalEl);
    initModalControls(editModalEl);

    bindBackdropClose(editModalEl, closeEditModal);
    document.getElementById("edit-close").addEventListener("click", closeEditModal);
    document.addEventListener("keydown", onEditEscape);

    document.getElementById("edit-save").addEventListener("click", function () {
      var updatedQ = extractQuizQuestion();
      if (!updatedQ) return;
      saveQuizQuestion(moduleId, questionIndex, updatedQ, "PUT");
    });
  }

  function openQuizAddModal(moduleId, insertIndex) {
    var blank = { question: "", options: ["", "", "", ""], answerIndex: 0, rationale: "", topic: "" };
    if (editModalEl) return;

    openQuizEditModal(moduleId, insertIndex, blank);

    // Override save button to use POST
    var saveBtn = document.getElementById("edit-save");
    if (saveBtn) {
      saveBtn.textContent = "Add Question";
      saveBtn.onclick = function () {
        var q = extractQuizQuestion();
        if (!q) return;
        saveQuizQuestion(moduleId, insertIndex, q, "POST");
      };
    }
  }

  function extractQuizQuestion() {
    var question = gVal("edit-q-question");
    if (!question) return null;
    var options = [];
    for (var i = 0; i < 4; i++) {
      var inp = document.querySelector("[data-q-opt='" + i + "']");
      options.push(inp ? inp.value.trim() : "");
    }
    var checked = document.querySelector("input[name='edit-q-answer']:checked");
    var answerIndex = checked ? parseInt(checked.value, 10) : 0;
    var result = {
      question: question,
      options: options,
      answerIndex: answerIndex,
      rationale: gVal("edit-q-rationale"),
    };
    var topic = gVal("edit-q-topic");
    if (topic) result.topic = topic;
    return result;
  }

  function saveQuizQuestion(moduleId, questionIndex, questionData, method) {
    var saveBtn = document.getElementById("edit-save");
    var statusEl = document.getElementById("edit-status");
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Saving\u2026"; }

    getQuizFile(moduleId).then(function (quizFile) {
      if (!quizFile) throw new Error("Quiz file not found");
      var body = { courseId: getCourseId(), quizFile: quizFile };
      if (method === "PUT") {
        body.questionIndex = questionIndex;
        body.question = questionData;
      } else {
        body.insertIndex = questionIndex;
        body.question = questionData;
      }
      return fetch("/api/quiz-question", {
        method: method,
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(body),
      });
    })
    .then(function (res) {
      if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Save failed"); });
      return res.json();
    })
    .then(function () {
      if (statusEl) { statusEl.className = "author-save-status success"; statusEl.textContent = "Saved!"; }
      OB.content.clearCache();
      setTimeout(function () { closeEditModal(); OB.router.navigate(); }, 400);
    })
    .catch(function (err) {
      if (statusEl) { statusEl.className = "author-save-status error"; statusEl.textContent = err.message; }
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = "Save Question"; }
    });
  }

  function deleteQuizQuestion(moduleId, questionIndex) {
    if (!confirm("Delete this question?")) return;

    getQuizFile(moduleId).then(function (quizFile) {
      if (!quizFile) throw new Error("Quiz file not found");
      return fetch("/api/quiz-question", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          courseId: getCourseId(),
          quizFile: quizFile,
          questionIndex: questionIndex,
        }),
      });
    })
    .then(function (res) {
      if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Delete failed"); });
      return res.json();
    })
    .then(function () {
      OB.content.clearCache();
      OB.router.navigate();
    })
    .catch(function (err) {
      alert("Delete failed: " + err.message);
    });
  }

  /* ==================================================================
     Glossary Editing
     ================================================================== */

  function openGlossaryEditModal(termIndex, termData) {
    if (editModalEl) return;
    var term = JSON.parse(JSON.stringify(termData));

    var html =
      '<div class="author-backdrop" id="edit-backdrop">' +
        '<div class="author-modal" role="dialog" aria-label="Edit glossary term">' +
          '<div class="author-modal-header">' +
            '<h3>' + (termIndex >= 0 ? 'Edit Term' : 'Add Term') + '</h3>' +
            '<button class="author-modal-close" id="edit-close">&#10005;</button>' +
          '</div>' +
          '<div class="author-modal-body">' +
            '<div class="author-field">' +
              '<label class="author-label">Term</label>' +
              '<input class="author-input" id="edit-g-term" type="text" value="' + OB.ui.esc(term.term || '') + '">' +
            '</div>' +
            '<div class="author-field">' +
              '<label class="author-label">Definition</label>' +
              '<textarea class="author-textarea" id="edit-g-def" rows="3">' + OB.ui.esc(term.definition || '') + '</textarea>' +
            '</div>' +
            '<button class="author-save-btn" id="edit-save">' + (termIndex >= 0 ? 'Save Term' : 'Add Term') + '</button>' +
            '<div class="author-save-status" id="edit-status"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var container = document.createElement("div");
    container.innerHTML = html;
    editModalEl = container.firstChild;
    document.body.appendChild(editModalEl);
    initModalControls(editModalEl);

    bindBackdropClose(editModalEl, closeEditModal);
    document.getElementById("edit-close").addEventListener("click", closeEditModal);
    document.addEventListener("keydown", onEditEscape);

    document.getElementById("edit-save").addEventListener("click", function () {
      var t = gVal("edit-g-term");
      var d = gVal("edit-g-def");
      if (!t) return;
      var termObj = { term: t, definition: d };
      saveGlossaryTerm(termIndex, termObj);
    });
  }

  function saveGlossaryTerm(termIndex, termData) {
    var saveBtn = document.getElementById("edit-save");
    var statusEl = document.getElementById("edit-status");
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Saving\u2026"; }

    var method = termIndex >= 0 ? "PUT" : "POST";
    var body = { courseId: getCourseId(), term: termData };
    if (termIndex >= 0) body.termIndex = termIndex;

    fetch("/api/glossary-term", {
      method: method,
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(body),
    })
    .then(function (res) {
      if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Save failed"); });
      return res.json();
    })
    .then(function () {
      if (statusEl) { statusEl.className = "author-save-status success"; statusEl.textContent = "Saved!"; }
      OB.content.clearCache();
      setTimeout(function () { closeEditModal(); OB.router.navigate(); }, 400);
    })
    .catch(function (err) {
      if (statusEl) { statusEl.className = "author-save-status error"; statusEl.textContent = err.message; }
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = "Save Term"; }
    });
  }

  function deleteGlossaryTerm(termIndex) {
    if (!confirm("Delete this term?")) return;

    fetch("/api/glossary-term", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ courseId: getCourseId(), termIndex: termIndex }),
    })
    .then(function (res) {
      if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Delete failed"); });
      return res.json();
    })
    .then(function () {
      OB.content.clearCache();
      OB.router.navigate();
    })
    .catch(function (err) {
      alert("Delete failed: " + err.message);
    });
  }

  /* ==================================================================
     Topic & Module Metadata Editing
     ================================================================== */

  function openTopicMetaModal(topicId) {
    var moduleId = topicId.replace(/t\d+$/, "");
    OB.content.getModule(moduleId).then(function (moduleData) {
      var topic = moduleData.content.topics.find(function (t) { return t.id === topicId; });
      if (!topic) { alert("Topic not found"); return; }

      if (editModalEl) return;
      var html =
        '<div class="author-backdrop" id="edit-backdrop">' +
          '<div class="author-modal" role="dialog" aria-label="Edit topic metadata">' +
            '<div class="author-modal-header">' +
              '<h3>Edit Topic Settings</h3>' +
              '<button class="author-modal-close" id="edit-close">&#10005;</button>' +
            '</div>' +
            '<div class="author-modal-body">' +
              '<div class="author-field">' +
                '<label class="author-label">Title</label>' +
                '<input class="author-input" id="edit-meta-title" type="text" value="' + OB.ui.esc(topic.title || '') + '">' +
              '</div>' +
              '<div class="author-field">' +
                '<label class="author-label">Estimated Minutes</label>' +
                '<input class="author-input" id="edit-meta-minutes" type="number" min="1" value="' + (topic.estimatedMinutes || 5) + '">' +
              '</div>' +
              '<div class="author-field">' +
                '<label class="author-label">Exercise Topic</label>' +
                '<div class="author-toggle-group" id="edit-meta-exercise">' +
                  '<button class="author-toggle-option' + (topic.isExercise ? ' selected' : '') + '" data-val="true">Yes</button>' +
                  '<button class="author-toggle-option' + (!topic.isExercise ? ' selected' : '') + '" data-val="false">No</button>' +
                '</div>' +
              '</div>' +
              '<button class="author-save-btn" id="edit-save">Save</button>' +
              '<div class="author-save-status" id="edit-status"></div>' +
            '</div>' +
          '</div>' +
        '</div>';

      var container = document.createElement("div");
      container.innerHTML = html;
      editModalEl = container.firstChild;
      document.body.appendChild(editModalEl);
      initModalControls(editModalEl);

      // Toggle groups
      editModalEl.querySelectorAll(".author-toggle-group").forEach(function (g) {
        g.addEventListener("click", function (e) {
          var btn = e.target.closest(".author-toggle-option");
          if (!btn) return;
          g.querySelectorAll(".author-toggle-option").forEach(function (b) { b.classList.remove("selected"); });
          btn.classList.add("selected");
        });
      });

      bindBackdropClose(editModalEl, closeEditModal);
      document.getElementById("edit-close").addEventListener("click", closeEditModal);
      document.addEventListener("keydown", onEditEscape);

      document.getElementById("edit-save").addEventListener("click", function () {
        saveTopicMetadata(topicId, moduleId, {
          title: gVal("edit-meta-title"),
          estimatedMinutes: parseInt(gVal("edit-meta-minutes"), 10) || 5,
          isExercise: getToggleVal("edit-meta-exercise") === "true",
        });
      });
    });
  }

  function openTakeawaysModal(topicId) {
    var moduleId = topicId.replace(/t\d+$/, "");
    OB.content.getModule(moduleId).then(function (moduleData) {
      var topic = moduleData.content.topics.find(function (t) { return t.id === topicId; });
      if (!topic) { alert("Topic not found"); return; }

      if (editModalEl) return;
      var takeaways = topic.keyTakeaways || [];
      var listHtml = '';
      takeaways.forEach(function (tk, i) {
        listHtml += '<div class="author-list-item" data-takeaway="' + i + '">' +
          '<input class="author-input" data-takeaway-val="' + i + '" value="' + OB.ui.esc(tk) + '" style="flex:1">' +
          '<button class="author-list-remove" data-remove-takeaway="' + i + '">&#10005;</button>' +
        '</div>';
      });

      var html =
        '<div class="author-backdrop" id="edit-backdrop">' +
          '<div class="author-modal" role="dialog" aria-label="Edit key takeaways">' +
            '<div class="author-modal-header">' +
              '<h3>Edit Key Takeaways</h3>' +
              '<button class="author-modal-close" id="edit-close">&#10005;</button>' +
            '</div>' +
            '<div class="author-modal-body">' +
              '<div class="author-field"><label class="author-label">Takeaways</label>' +
                '<div id="edit-takeaways-list">' + listHtml + '</div>' +
                '<button class="author-list-add" id="edit-add-takeaway">+ Add Takeaway</button>' +
              '</div>' +
              '<button class="author-save-btn" id="edit-save">Save</button>' +
              '<div class="author-save-status" id="edit-status"></div>' +
            '</div>' +
          '</div>' +
        '</div>';

      var container = document.createElement("div");
      container.innerHTML = html;
      editModalEl = container.firstChild;
      document.body.appendChild(editModalEl);
      initModalControls(editModalEl);

      bindBackdropClose(editModalEl, closeEditModal);
      document.getElementById("edit-close").addEventListener("click", closeEditModal);
      document.addEventListener("keydown", onEditEscape);

      // Add/remove takeaway buttons
      var listContainer = document.getElementById("edit-takeaways-list");
      bindTakeawayRemoveButtons(listContainer);
      document.getElementById("edit-add-takeaway").addEventListener("click", function () {
        var count = listContainer.querySelectorAll("[data-takeaway]").length;
        var tmp = document.createElement("div");
        tmp.innerHTML = '<div class="author-list-item" data-takeaway="' + count + '">' +
          '<input class="author-input" data-takeaway-val="' + count + '" value="" style="flex:1">' +
          '<button class="author-list-remove" data-remove-takeaway="' + count + '">&#10005;</button>' +
        '</div>';
        listContainer.appendChild(tmp.firstChild);
        bindTakeawayRemoveButtons(listContainer);
      });

      document.getElementById("edit-save").addEventListener("click", function () {
        var items = [];
        listContainer.querySelectorAll("[data-takeaway]").forEach(function (el) {
          var i = el.getAttribute("data-takeaway");
          var val = (listContainer.querySelector("[data-takeaway-val='" + i + "']") || {}).value || "";
          if (val.trim()) items.push(val.trim());
        });
        saveTopicMetadata(topicId, moduleId, { keyTakeaways: items });
      });
    });
  }

  function bindTakeawayRemoveButtons(container) {
    container.querySelectorAll("[data-remove-takeaway]").forEach(function (btn) {
      btn.onclick = function () { btn.closest(".author-list-item").remove(); };
    });
  }

  function saveTopicMetadata(topicId, moduleId, metadata) {
    var saveBtn = document.getElementById("edit-save");
    var statusEl = document.getElementById("edit-status");
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Saving\u2026"; }

    getModuleFile(moduleId).then(function (moduleFile) {
      if (!moduleFile) throw new Error("Module not found");
      return fetch("/api/topic-metadata", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          courseId: getCourseId(),
          moduleFile: moduleFile,
          topicId: topicId,
          metadata: metadata,
        }),
      });
    })
    .then(function (res) {
      if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Save failed"); });
      return res.json();
    })
    .then(function () {
      if (statusEl) { statusEl.className = "author-save-status success"; statusEl.textContent = "Saved!"; }
      OB.content.clearCache();
      setTimeout(function () { closeEditModal(); OB.router.navigate(); }, 400);
    })
    .catch(function (err) {
      if (statusEl) { statusEl.className = "author-save-status error"; statusEl.textContent = err.message; }
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = "Save"; }
    });
  }

  function openModuleMetaModal(moduleId) {
    OB.content.getModule(moduleId).then(function (moduleData) {
      if (editModalEl) return;
      var content = moduleData.content;

      var html =
        '<div class="author-backdrop" id="edit-backdrop">' +
          '<div class="author-modal" role="dialog" aria-label="Edit module metadata">' +
            '<div class="author-modal-header">' +
              '<h3>Edit Module</h3>' +
              '<button class="author-modal-close" id="edit-close">&#10005;</button>' +
            '</div>' +
            '<div class="author-modal-body">' +
              '<div class="author-field">' +
                '<label class="author-label">Title</label>' +
                '<input class="author-input" id="edit-mod-title" type="text" value="' + OB.ui.esc(content.title || '') + '">' +
              '</div>' +
              '<div class="author-field">' +
                '<label class="author-label">Description</label>' +
                '<textarea class="author-textarea" id="edit-mod-desc" rows="3">' + OB.ui.esc(content.description || '') + '</textarea>' +
              '</div>' +
              '<button class="author-save-btn" id="edit-save">Save</button>' +
              '<div class="author-save-status" id="edit-status"></div>' +
            '</div>' +
          '</div>' +
        '</div>';

      var container = document.createElement("div");
      container.innerHTML = html;
      editModalEl = container.firstChild;
      document.body.appendChild(editModalEl);
      initModalControls(editModalEl);

      bindBackdropClose(editModalEl, closeEditModal);
      document.getElementById("edit-close").addEventListener("click", closeEditModal);
      document.addEventListener("keydown", onEditEscape);

      document.getElementById("edit-save").addEventListener("click", function () {
        saveModuleMetadata(moduleId, {
          title: gVal("edit-mod-title"),
          description: gVal("edit-mod-desc"),
        });
      });
    });
  }

  function saveModuleMetadata(moduleId, metadata) {
    var saveBtn = document.getElementById("edit-save");
    var statusEl = document.getElementById("edit-status");
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Saving\u2026"; }

    getModuleFile(moduleId).then(function (moduleFile) {
      if (!moduleFile) throw new Error("Module not found");
      return fetch("/api/module-metadata", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          courseId: getCourseId(),
          moduleFile: moduleFile,
          metadata: metadata,
        }),
      });
    })
    .then(function (res) {
      if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Save failed"); });
      return res.json();
    })
    .then(function () {
      if (statusEl) { statusEl.className = "author-save-status success"; statusEl.textContent = "Saved!"; }
      OB.content.clearCache();
      setTimeout(function () { closeEditModal(); OB.router.navigate(); }, 400);
    })
    .catch(function (err) {
      if (statusEl) { statusEl.className = "author-save-status error"; statusEl.textContent = err.message; }
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = "Save"; }
    });
  }

  OB.author = {
    init: init,
    isEditMode: isEditMode,
    openModalAt: openModalAt,
    deleteBlock: deleteBlock,
    moveBlock: moveBlock,
    openEditModalForBlock: openEditModalForBlock,
    openQuizEditModal: openQuizEditModal,
    openQuizAddModal: openQuizAddModal,
    deleteQuizQuestion: deleteQuizQuestion,
    openGlossaryEditModal: openGlossaryEditModal,
    deleteGlossaryTerm: deleteGlossaryTerm,
    openTopicMetaModal: openTopicMetaModal,
    openTakeawaysModal: openTakeawaysModal,
    openModuleMetaModal: openModuleMetaModal,
  };
})();
