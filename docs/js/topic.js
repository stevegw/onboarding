/**
 * OB -- Onboarding -- Topic View
 * ================================
 * Renders topic content with all block types and interactive elements.
 * Attached to window.OB.topic.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  function getCurrentTopicId() {
    var m = (window.location.hash || "#/").match(/^#\/topic\/(.+)$/);
    return m ? m[1] : null;
  }

  function render(moduleData, topicId) {
    var meta = moduleData.meta;
    var content = moduleData.content;
    var topic = content.topics.find(function (t) { return t.id === topicId; });
    if (!topic) { OB.ui.setMain('<p>' + OB.i18n.t("quiz.topicNotFound") + '</p>'); return; }

    var esc = OB.ui.esc;
    var t = OB.i18n.t;
    var modIdx = parseInt(meta.id.replace("m", ""), 10);
    var topicIdx = parseInt(topicId.replace(meta.id + "t", ""), 10);
    var isCompleted = OB.state.isTopicCompleted(topicId);

    var html = "";

    // Breadcrumb
    html += '<div class="topic-header">';
    html += '<div class="topic-breadcrumb">';
    html += '<a href="#/">' + t("topic.breadcrumbDashboard") + '</a> <span>&#8250;</span> ';
    html += '<a href="#/module/' + meta.id + '">' + t("topic.breadcrumbModule", { num: modIdx }) + '</a> <span>&#8250;</span> ';
    if (topic.isExercise) {
      var exNum = topicIdx - (meta.exerciseTopicStart || topicIdx) + 1;
      html += '<span>' + t("topic.exerciseNum", { num: exNum }) + '</span>';
    } else {
      html += '<span>' + t("topic.topicNum", { mod: modIdx, topic: topicIdx }) + '</span>';
    }
    html += '</div>';
    html += '<h1>' + esc(topic.title);
    if (editMode) {
      html += ' <button class="author-block-action author-edit-btn author-inline-edit" data-action="edit-topic-meta" title="Edit topic title &amp; settings">&#9998;</button>';
    }
    html += '</h1>';
    html += '<p class="topic-est text-dim text-sm">' + t("topic.estimated", { min: topic.estimatedMinutes || 5 }) + '</p>';
    html += '</div>';

    // Content blocks
    var editMode = OB.author && OB.author.isEditMode && OB.author.isEditMode();
    var totalBlocks = topic.content.length;
    html += '<div class="topic-content">';
    topic.content.forEach(function (block, blockIdx) {
      var blockHtml = renderBlock(block, blockIdx);
      if (editMode) {
        html += '<button class="author-inline-insert" data-topic="' + topic.id + '" data-index="' + blockIdx + '" title="Insert image block here"><span class="author-inline-insert-icon">+</span> Insert here</button>';
        html += '<div class="author-block-wrapper" data-block-index="' + blockIdx + '">';
        html += '<div class="author-block-toolbar">';
        html += '<button class="author-block-action author-edit-btn" data-action="edit" data-block-index="' + blockIdx + '" title="Edit block">&#9998;</button>';
        html += '<button class="author-block-action" data-action="up" data-block-index="' + blockIdx + '" title="Move up"' + (blockIdx === 0 ? ' disabled' : '') + '>&#8593;</button>';
        html += '<button class="author-block-action" data-action="down" data-block-index="' + blockIdx + '" title="Move down"' + (blockIdx === totalBlocks - 1 ? ' disabled' : '') + '>&#8595;</button>';
        html += '<button class="author-block-action" data-action="delete" data-block-index="' + blockIdx + '" title="Delete block">&#10005;</button>';
        html += '</div>';
        html += blockHtml;
        html += '</div>';
      } else {
        html += blockHtml;
      }
    });
    if (editMode) {
      html += '<button class="author-inline-insert" data-topic="' + topic.id + '" data-index="' + totalBlocks + '" title="Insert image block here"><span class="author-inline-insert-icon">+</span> Insert here</button>';
    }
    html += '</div>';

    // Key takeaways
    if (topic.keyTakeaways && topic.keyTakeaways.length > 0) {
      html += '<div class="takeaways-box">';
      html += '<h3>' + t("topic.keyTakeaways");
      if (editMode) {
        html += ' <button class="author-block-action author-edit-btn author-inline-edit" data-action="edit-takeaways" title="Edit key takeaways">&#9998;</button>';
      }
      html += '</h3>';
      html += '<ul>';
      topic.keyTakeaways.forEach(function (tk) {
        html += '<li>' + esc(tk) + '</li>';
      });
      html += '</ul>';
      html += '</div>';
    }

    // Mark complete
    html += '<div class="mark-complete-bar' + (isCompleted ? " completed" : "") + '" id="mark-complete">';
    if (isCompleted) {
      html += '<button class="btn btn-outline btn-sm" id="uncomplete-btn">&#10003; ' + t("topic.completedUndo") + '</button>';
    } else {
      html += '<button class="btn btn-primary" id="complete-btn">' + t("topic.markComplete") + '</button>';
    }
    html += '</div>';

    // Navigation
    html += renderNavButtons(content, meta, topicIdx);

    OB.ui.setMain(html);
    bindInteractions();
    bindCompletion(topicId, meta.id);
  }

  function renderBlock(block, idx) {
    var esc = OB.ui.esc;
    var t = OB.i18n.t;
    switch (block.type) {
      case "heading":
        var tag = block.level === 3 ? "h3" : "h2";
        return '<' + tag + '>' + esc(block.text) + '</' + tag + '>';

      case "paragraph":
        return '<p>' + esc(block.text) + '</p>';

      case "callout":
        var icon = { info: "&#8505;", tip: "&#9733;", warning: "&#9888;", insight: "&#128161;" }[block.variant] || "&#8505;";
        return '<div class="callout ' + (block.variant || "info") + '">' +
          '<span class="callout-icon">' + icon + '</span>' +
          '<div class="callout-content"><p>' + esc(block.text) + '</p></div>' +
          '</div>';

      case "comparison-table":
        var tbl = '<div style="overflow-x:auto"><table class="data-table"><thead><tr>';
        block.headers.forEach(function (h) { tbl += '<th>' + esc(h) + '</th>'; });
        tbl += '</tr></thead><tbody>';
        block.rows.forEach(function (row) {
          tbl += '<tr>';
          row.forEach(function (cell) { tbl += '<td>' + esc(cell) + '</td>'; });
          tbl += '</tr>';
        });
        tbl += '</tbody></table></div>';
        return tbl;

      case "reveal-cards":
        var rc = '<div class="reveal-grid">';
        block.cards.forEach(function (card, ci) {
          rc += '<div class="reveal-card" data-reveal="' + ci + '">';
          rc += '<div class="reveal-front">' + esc(card.front) + '</div>';
          rc += '<div class="reveal-hint">' + t("topic.clickToReveal") + '</div>';
          rc += '<div class="reveal-back">' + esc(card.back) + '</div>';
          rc += '</div>';
        });
        rc += '</div>';
        return rc;

      case "interactive-match":
        return renderMatchBlock(block, idx);

      case "interactive-sort":
        return renderSortBlock(block, idx);

      case "exercise":
        return renderExerciseBlock(block, idx);

      case "image":
        var imgSrc = "courses/" + OB.content.getCourseId() + "/" + block.src;
        var sizeClass = block.size ? " image-block-" + block.size : "";
        var figHtml = '<figure class="image-block' + sizeClass + '">';
        figHtml += '<img src="' + esc(imgSrc) + '" alt="' + esc(block.alt || '') + '" loading="lazy">';
        if (block.caption) {
          figHtml += '<figcaption>' + esc(block.caption) + '</figcaption>';
        }
        figHtml += '</figure>';
        return figHtml;

      default:
        return '';
    }
  }

  function renderMatchBlock(block, idx) {
    var esc = OB.ui.esc;
    var t = OB.i18n.t;
    var html = '<div class="match-container" data-match="' + idx + '">';
    html += '<p style="font-size:13px;color:var(--c-text-muted);margin-bottom:12px">' + esc(block.prompt) + '</p>';
    html += '<div class="match-columns">';

    // Left column (scenarios)
    html += '<div>';
    html += '<div class="match-column-label">' + t("topic.scenarioLabel") + '</div>';
    block.pairs.forEach(function (p, i) {
      html += '<div class="match-item" data-match-left="' + idx + '-' + i + '">' + esc(p.left) + '</div>';
    });
    html += '</div>';

    // Right column (answers) - shuffled
    var shuffled = block.pairs.map(function (p, i) { return { text: p.right, origIdx: i }; });
    shuffleArray(shuffled);

    html += '<div>';
    html += '<div class="match-column-label">' + t("topic.strategyLabel") + '</div>';
    shuffled.forEach(function (s) {
      html += '<div class="match-item" data-match-right="' + idx + '-' + s.origIdx + '">' + esc(s.text) + '</div>';
    });
    html += '</div>';

    html += '</div>';
    html += '<div class="match-feedback" id="match-feedback-' + idx + '" style="display:none"></div>';
    html += '</div>';
    return html;
  }

  function renderSortBlock(block, idx) {
    var esc = OB.ui.esc;
    var items = block.items.map(function (item, i) { return { text: item, origIdx: i }; });
    shuffleArray(items);

    var html = '<div class="sort-container" data-sort="' + idx + '">';
    html += '<p style="font-size:13px;color:var(--c-text-muted);margin-bottom:12px">' + esc(block.prompt) + '</p>';
    items.forEach(function (item, i) {
      html += '<div class="sort-item" draggable="true" data-sort-idx="' + item.origIdx + '">';
      html += '<span class="sort-handle">&#9776;</span>';
      html += '<span class="sort-num">' + (i + 1) + '</span>';
      html += '<span>' + esc(item.text) + '</span>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderExerciseBlock(block, idx) {
    var esc = OB.ui.esc;
    var t = OB.i18n.t;
    var exId = block.exerciseId;
    var tasks = block.tasks;
    var prog = OB.state.getExerciseProgress(exId, tasks);
    var pct = prog.total > 0 ? Math.round((prog.done / prog.total) * 100) : 0;

    // Find first incomplete step to mark as active
    var activeTaskId = null;
    var activeStepIdx = -1;
    for (var ti = 0; ti < tasks.length && activeStepIdx === -1; ti++) {
      for (var si = 0; si < tasks[ti].steps.length; si++) {
        if (!OB.state.isStepDone(exId, tasks[ti].id, si)) {
          activeTaskId = tasks[ti].id;
          activeStepIdx = si;
          break;
        }
      }
    }

    var html = '<div class="exercise-block" data-exercise="' + exId + '">';

    // Objective
    html += '<div class="exercise-objective">';
    html += '<div class="exercise-objective-label">' + t("topic.objective") + '</div>';
    html += '<p>' + esc(block.objective) + '</p>';
    html += '</div>';

    // Progress bar
    html += '<div class="exercise-progress">';
    html += '<div class="exercise-progress-label">' + t("topic.stepsCompleted", { done: prog.done, total: prog.total }) + '</div>';
    html += '<div class="exercise-progress-bar"><div class="exercise-progress-fill" style="width:' + pct + '%"></div></div>';
    html += '</div>';

    // Tasks
    tasks.forEach(function (task) {
      var taskDone = 0;
      task.steps.forEach(function (_s, si) {
        if (OB.state.isStepDone(exId, task.id, si)) taskDone++;
      });

      html += '<div class="exercise-task">';
      html += '<div class="exercise-task-header">';
      html += '<h3>' + esc(task.title) + '</h3>';
      html += '<span class="exercise-task-progress">' + t("topic.stepsProgress", { done: taskDone, total: task.steps.length }) + '</span>';
      html += '</div>';
      html += '<div class="exercise-steps">';

      task.steps.forEach(function (step, si) {
        var isDone = OB.state.isStepDone(exId, task.id, si);
        var isActive = (task.id === activeTaskId && si === activeStepIdx);
        var cls = isDone ? "done" : (isActive ? "active" : "upcoming");

        html += '<div class="exercise-step ' + cls + '" data-ex="' + exId + '" data-task="' + task.id + '" data-step="' + si + '">';
        html += '<div class="exercise-step-indicator">' + (isDone ? "&#10003;" : (si + 1)) + '</div>';
        html += '<div class="exercise-step-action-text">' + esc(step.action) + '</div>';

        // Detail area (shown when active or expanded)
        html += '<div class="exercise-step-detail">';
        html += '<div class="exercise-step-box action-box">';
        html += '<div class="exercise-step-box-label">' + t("topic.doThis") + '</div>';
        html += '<p>' + esc(step.action) + '</p>';
        html += '</div>';

        if (step.detail) {
          html += '<div class="exercise-step-box detail-box">';
          html += '<div class="exercise-step-box-label">' + t("topic.whyItMatters") + '</div>';
          html += '<p>' + esc(step.detail) + '</p>';
          html += '</div>';
        }

        if (step.hint) {
          html += '<div class="exercise-hint-toggle" data-hint="' + exId + '-' + task.id + '-' + si + '">&#9654; ' + t("topic.showHint") + '</div>';
          html += '<div class="exercise-hint-text" id="hint-' + exId + '-' + task.id + '-' + si + '">' + esc(step.hint) + '</div>';
        }

        if (!isDone) {
          html += '<div class="exercise-step-actions">';
          html += '<button class="btn btn-primary btn-sm exercise-step-done" data-ex="' + exId + '" data-task="' + task.id + '" data-step="' + si + '">' + t("topic.doneNextStep") + ' &#8594;</button>';
          html += '</div>';
        }

        html += '</div>'; // .exercise-step-detail
        html += '</div>'; // .exercise-step
      });

      html += '</div>'; // .exercise-steps
      html += '</div>'; // .exercise-task
    });

    html += '</div>'; // .exercise-block
    return html;
  }

  function bindNavClicks() {
    document.querySelectorAll("[data-route]").forEach(function (el) {
      el.addEventListener("click", function () {
        window.location.hash = el.getAttribute("data-route");
      });
    });
  }

  function bindInteractions() {
    bindNavClicks();
    // Reveal cards
    document.querySelectorAll(".reveal-card").forEach(function (card) {
      card.addEventListener("click", function () {
        card.classList.toggle("flipped");
      });
    });

    // Match interactions
    document.querySelectorAll(".match-container").forEach(function (container) {
      var matchIdx = container.getAttribute("data-match");
      var selectedLeft = null;
      var matchedCount = 0;
      var totalPairs = container.querySelectorAll("[data-match-left]").length;

      container.querySelectorAll("[data-match-left]").forEach(function (el) {
        el.addEventListener("click", function () {
          if (el.classList.contains("matched")) return;
          container.querySelectorAll("[data-match-left]").forEach(function (e) { e.classList.remove("selected"); });
          el.classList.add("selected");
          selectedLeft = el.getAttribute("data-match-left");
        });
      });

      container.querySelectorAll("[data-match-right]").forEach(function (el) {
        el.addEventListener("click", function () {
          if (!selectedLeft || el.classList.contains("matched")) return;
          var rightKey = el.getAttribute("data-match-right");
          if (selectedLeft === rightKey) {
            // Correct match
            var leftEl = container.querySelector('[data-match-left="' + selectedLeft + '"]');
            if (leftEl) leftEl.classList.add("matched");
            el.classList.add("matched");
            matchedCount++;
            selectedLeft = null;
            if (matchedCount === totalPairs) {
              var fb = document.getElementById("match-feedback-" + matchIdx);
              if (fb) {
                fb.className = "match-feedback success";
                fb.textContent = OB.i18n.t("topic.allMatchedCorrectly");
                fb.style.display = "";
              }
            }
          } else {
            // Wrong match
            el.classList.add("wrong");
            setTimeout(function () { el.classList.remove("wrong"); }, 500);
          }
        });
      });
    });

    // Exercise step done buttons
    document.querySelectorAll(".exercise-step-done").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var exId = btn.getAttribute("data-ex");
        var taskId = btn.getAttribute("data-task");
        var stepIdx = parseInt(btn.getAttribute("data-step"), 10);
        OB.state.completeStep(exId, taskId, stepIdx);
        // Re-render topic to update UI
        OB.router.navigate();
      });
    });

    // Exercise hint toggles
    document.querySelectorAll(".exercise-hint-toggle").forEach(function (toggle) {
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var hintKey = toggle.getAttribute("data-hint");
        var hintEl = document.getElementById("hint-" + hintKey);
        if (hintEl) {
          var isOpen = hintEl.classList.toggle("expanded");
          toggle.innerHTML = (isOpen ? "&#9660; " + OB.i18n.t("topic.hideHint") : "&#9654; " + OB.i18n.t("topic.showHint"));
        }
      });
    });

    // Exercise step expand/collapse on click
    document.querySelectorAll(".exercise-step").forEach(function (step) {
      step.addEventListener("click", function () {
        if (step.classList.contains("active")) return; // already expanded
        step.classList.toggle("expanded");
      });
    });

    // Author mode block toolbar actions
    if (OB.author && OB.author.isEditMode && OB.author.isEditMode()) {
      document.querySelectorAll(".author-block-action").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var action = btn.getAttribute("data-action");
          var idx = parseInt(btn.getAttribute("data-block-index"), 10);
          var topicId = getCurrentTopicId();
          if (!topicId) return;
          if (action === "edit") {
            OB.author.openEditModalForBlock(topicId, idx);
          } else if (action === "delete") {
            OB.author.deleteBlock(topicId, idx);
          } else if (action === "up" || action === "down") {
            OB.author.moveBlock(topicId, idx, action);
          }
        });
      });

      // Metadata edit buttons
      document.querySelectorAll("[data-action='edit-topic-meta']").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var topicId = getCurrentTopicId();
          if (topicId) OB.author.openTopicMetaModal(topicId);
        });
      });
      document.querySelectorAll("[data-action='edit-takeaways']").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var topicId = getCurrentTopicId();
          if (topicId) OB.author.openTakeawaysModal(topicId);
        });
      });
      document.querySelectorAll("[data-action='edit-module-meta']").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var moduleId = getCurrentTopicId() ? getCurrentTopicId().replace(/t\d+$/, "") : null;
          if (!moduleId) {
            var mHash = (window.location.hash || "").match(/^#\/module\/(.+)$/);
            if (mHash) moduleId = mHash[1];
          }
          if (moduleId) OB.author.openModuleMetaModal(moduleId);
        });
      });

      // Inline insert buttons
      document.querySelectorAll(".author-inline-insert").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var topicId = btn.getAttribute("data-topic");
          var insertIndex = parseInt(btn.getAttribute("data-index"), 10);
          OB.author.openModalAt(topicId, insertIndex);
        });
      });
    }

    // Sort drag-and-drop
    document.querySelectorAll(".sort-container").forEach(function (container) {
      var items = container.querySelectorAll(".sort-item");
      var dragEl = null;

      items.forEach(function (item) {
        item.addEventListener("dragstart", function (e) {
          dragEl = item;
          item.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
        });
        item.addEventListener("dragend", function () {
          item.classList.remove("dragging");
          container.querySelectorAll(".sort-item").forEach(function (el) { el.classList.remove("drag-over"); });
          updateSortNumbers(container);
        });
        item.addEventListener("dragover", function (e) {
          e.preventDefault();
          if (dragEl !== item) item.classList.add("drag-over");
        });
        item.addEventListener("dragleave", function () {
          item.classList.remove("drag-over");
        });
        item.addEventListener("drop", function (e) {
          e.preventDefault();
          item.classList.remove("drag-over");
          if (dragEl && dragEl !== item) {
            var parent = item.parentNode;
            var allItems = Array.from(parent.querySelectorAll(".sort-item"));
            var dragIdx = allItems.indexOf(dragEl);
            var dropIdx = allItems.indexOf(item);
            if (dragIdx < dropIdx) {
              parent.insertBefore(dragEl, item.nextSibling);
            } else {
              parent.insertBefore(dragEl, item);
            }
            updateSortNumbers(parent);
          }
        });
      });
    });
  }

  function updateSortNumbers(container) {
    var items = container.querySelectorAll(".sort-item");
    items.forEach(function (item, i) {
      var num = item.querySelector(".sort-num");
      if (num) num.textContent = i + 1;
      // Check if in correct position
      var origIdx = parseInt(item.getAttribute("data-sort-idx"), 10);
      if (origIdx === i) {
        item.classList.add("correct");
      } else {
        item.classList.remove("correct");
      }
    });
  }

  function bindCompletion(topicId, moduleId) {
    var t = OB.i18n.t;
    var completeBtn = document.getElementById("complete-btn");
    var uncompleteBtn = document.getElementById("uncomplete-btn");

    if (completeBtn) {
      completeBtn.addEventListener("click", function () {
        OB.state.completeTopic(topicId);
        var bar = document.getElementById("mark-complete");
        bar.classList.add("completed");
        bar.innerHTML = '<button class="btn btn-outline btn-sm" id="uncomplete-btn">&#10003; ' + t("topic.completedUndo") + '</button>';
        bindCompletion(topicId, moduleId);
        // Update sidebar
        OB.content.getCourse().then(function (course) {
          OB.sidebar.render(course, window.location.hash);
        });
      });
    }

    if (uncompleteBtn) {
      uncompleteBtn.addEventListener("click", function () {
        OB.state.uncompleteTopic(topicId);
        var bar = document.getElementById("mark-complete");
        bar.classList.remove("completed");
        bar.innerHTML = '<button class="btn btn-primary" id="complete-btn">' + t("topic.markComplete") + '</button>';
        bindCompletion(topicId, moduleId);
        OB.content.getCourse().then(function (course) {
          OB.sidebar.render(course, window.location.hash);
        });
      });
    }
  }

  function renderNavButtons(content, meta, topicIdx) {
    var t = OB.i18n.t;
    var html = '<div class="nav-btns">';
    var total = content.topics.length;

    if (topicIdx > 1) {
      var prevId = meta.id + "t" + (topicIdx - 1);
      html += '<button class="btn btn-outline" data-route="#/topic/' + prevId + '">&#8592; ' + t("topic.previous") + '</button>';
    } else {
      html += '<button class="btn btn-outline" data-route="#/module/' + meta.id + '">&#8592; ' + t("topic.moduleOverview") + '</button>';
    }

    if (topicIdx < total) {
      var nextId = meta.id + "t" + (topicIdx + 1);
      html += '<button class="btn btn-primary" data-route="#/topic/' + nextId + '">' + t("topic.next") + ' &#8594;</button>';
    } else {
      html += '<button class="btn btn-primary" data-route="#/quiz/' + meta.id + '">' + t("topic.takeQuiz") + ' &#8594;</button>';
    }

    html += '</div>';
    return html;
  }

  /* Module overview view */
  function renderModuleOverview(moduleData) {
    var meta = moduleData.meta;
    var content = moduleData.content;
    var esc = OB.ui.esc;
    var t = OB.i18n.t;
    var modIdx = parseInt(meta.id.replace("m", ""), 10);

    var topicIds = content.topics.map(function (tp) { return tp.id; });
    var prog = OB.state.getModuleProgress(meta.id, topicIds);

    var editMode = OB.author && OB.author.isEditMode && OB.author.isEditMode();
    var html = '';
    html += '<div class="module-header" data-module="' + modIdx + '">';
    html += '<span class="module-badge">' + t("topic.moduleBadge", { num: modIdx }) + '</span>';
    html += '<h1>' + esc(content.title);
    if (editMode) {
      html += ' <button class="author-block-action author-edit-btn author-inline-edit" data-action="edit-module-meta" title="Edit module title &amp; description">&#9998;</button>';
    }
    html += '</h1>';
    html += '<p class="text-muted">' + esc(content.description) + '</p>';
    html += '<div class="module-meta">';
    html += '<span>' + t("dashboard.estimatedMin", { min: meta.estimatedMinutes || 20 }) + '</span>';
    html += '<span>' + t("topic.topicsComplete", { done: prog.done, total: prog.total }) + '</span>';
    html += '</div>';
    html += '</div>';

    // Progress bar
    var pct = prog.total > 0 ? Math.round((prog.done / prog.total) * 100) : 0;
    html += '<div class="progress-inline mb-lg">';
    html += '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
    html += '<span class="progress-text">' + pct + '%</span>';
    html += '</div>';

    // Topic list
    html += '<h2 class="mb-md">' + t("topic.topics") + '</h2>';
    html += '<div class="stagger">';
    var exerciseStart = meta.exerciseTopicStart || (content.topics.length + 1);
    content.topics.forEach(function (topic, tIdx) {
      var isDone = OB.state.isTopicCompleted(topic.id);
      var isExercise = topic.isExercise || (tIdx + 1) >= exerciseStart;
      var itemCls = 'topic-list-item' + (isDone ? " completed" : "") + (isExercise ? " exercise-item" : "");
      html += '<div class="' + itemCls + '" data-route="#/topic/' + topic.id + '">';
      html += '<div class="topic-check' + (isDone ? " done" : "") + '">' + (isDone ? "&#10003;" : "") + '</div>';
      html += '<div class="topic-info">';
      if (isExercise) {
        var exNum = (tIdx + 1) - exerciseStart + 1;
        html += '<div class="topic-title"><span class="exercise-icon">&#128295;</span>' + t("topic.exerciseNum", { num: exNum }) + ': ' + esc(topic.title) + '</div>';
      } else {
        html += '<div class="topic-title">' + modIdx + '.' + (tIdx + 1) + ' ' + esc(topic.title) + '</div>';
      }
      html += '<div class="topic-meta">' + t("dashboard.estimatedMin", { min: topic.estimatedMinutes || 5 }) + '</div>';
      html += '</div>';
      html += '<span class="topic-arrow">&#8250;</span>';
      html += '</div>';
    });
    html += '</div>';

    // Quiz card
    var quizResult = OB.state.getQuizResult(meta.id);
    html += '<div class="quiz-card" data-route="#/quiz/' + meta.id + '">';
    html += '<span class="quiz-icon">&#9997;</span>';
    html += '<div class="quiz-info">';
    html += '<div class="quiz-title">' + t("topic.knowledgeCheck", { num: modIdx }) + '</div>';
    if (quizResult) {
      html += '<div class="quiz-meta">' + t("topic.quizBest", { score: quizResult.bestScore, total: quizResult.total }) + '</div>';
    } else {
      html += '<div class="quiz-meta">' + t("topic.quizNotAttempted") + '</div>';
    }
    html += '</div>';
    html += '<span class="topic-arrow">&#8250;</span>';
    html += '</div>';

    // Back button
    html += '<div class="nav-btns">';
    html += '<button class="btn btn-outline" data-route="#/">&#8592; ' + t("topic.backToDashboard") + '</button>';
    html += '<button class="btn btn-primary" data-route="#/topic/' + content.topics[0].id + '">' + t("topic.startModule") + ' &#8594;</button>';
    html += '</div>';

    OB.ui.setMain(html);

    // Bind clicks
    document.querySelectorAll("[data-route]").forEach(function (el) {
      el.addEventListener("click", function () {
        window.location.hash = el.getAttribute("data-route");
      });
    });

    // Module metadata edit button
    if (editMode) {
      document.querySelectorAll("[data-action='edit-module-meta']").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          OB.author.openModuleMetaModal(meta.id);
        });
      });
    }
  }

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  OB.topic = {
    render: render,
    renderModuleOverview: renderModuleOverview,
  };
})();
