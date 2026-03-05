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

    // Wire up events
    var backdrop = modalEl;
    var closeBtn = document.getElementById("author-close");
    var fileZone = document.getElementById("author-file-zone");
    var fileInput = document.getElementById("author-file-input");
    var sizeGroup = document.getElementById("author-size-group");
    var saveBtn = document.getElementById("author-save");

    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeModal();
    });
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

  OB.author = {
    init: init,
    isEditMode: isEditMode,
    openModalAt: openModalAt,
    deleteBlock: deleteBlock,
    moveBlock: moveBlock,
  };
})();
