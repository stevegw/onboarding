/**
 * OB -- Onboarding -- Exact Steps Popup
 * =======================================
 * Draggable popup that shows verified exact steps for exercises.
 * Steps are stored in courses/{courseId}/exercises/{exerciseId}.json
 * with independent progress tracking via OB.state exactSteps.
 * Attached to window.OB.exactSteps.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var popup = null;
  var dragHandle = null;
  var titleEl = null;
  var bodyEl = null;
  var closeBtn = null;
  var currentExId = null;

  // Drag state
  var isDragging = false;
  var dragOffsetX = 0;
  var dragOffsetY = 0;

  function init() {
    popup = document.getElementById("exact-steps-popup");
    dragHandle = document.getElementById("exact-steps-drag-handle");
    titleEl = document.getElementById("exact-steps-title");
    bodyEl = document.getElementById("exact-steps-body");
    closeBtn = document.getElementById("exact-steps-close");

    if (!popup) return;

    closeBtn.addEventListener("click", close);

    // Drag: mouse
    dragHandle.addEventListener("mousedown", onDragStart);
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);

    // Drag: touch
    dragHandle.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onDragEnd);
  }

  function onDragStart(e) {
    if (e.target.closest(".exact-steps-close")) return;
    isDragging = true;
    var rect = popup.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    dragHandle.style.cursor = "grabbing";
    e.preventDefault();
  }

  function onTouchStart(e) {
    if (e.target.closest(".exact-steps-close")) return;
    isDragging = true;
    var touch = e.touches[0];
    var rect = popup.getBoundingClientRect();
    dragOffsetX = touch.clientX - rect.left;
    dragOffsetY = touch.clientY - rect.top;
    e.preventDefault();
  }

  function onDragMove(e) {
    if (!isDragging) return;
    movePopup(e.clientX, e.clientY);
  }

  function onTouchMove(e) {
    if (!isDragging) return;
    var touch = e.touches[0];
    movePopup(touch.clientX, touch.clientY);
    e.preventDefault();
  }

  function movePopup(clientX, clientY) {
    var x = clientX - dragOffsetX;
    var y = clientY - dragOffsetY;

    // Viewport clamping
    var maxX = window.innerWidth - popup.offsetWidth;
    var maxY = window.innerHeight - popup.offsetHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    popup.style.left = x + "px";
    popup.style.top = y + "px";
    popup.style.right = "auto";
    popup.style.bottom = "auto";
  }

  function onDragEnd() {
    isDragging = false;
    if (dragHandle) dragHandle.style.cursor = "grab";
  }

  function open(exerciseId) {
    if (!popup) return;

    OB.content.getExactSteps(exerciseId).then(function (data) {
      if (!data) return;
      currentExId = exerciseId;
      var t = OB.i18n.t;

      titleEl.textContent = data.title || t("exactSteps.title");
      bodyEl.innerHTML = renderBody(data);
      bindBodyInteractions();

      // Position: right side, offset from top
      popup.style.right = "24px";
      popup.style.top = "80px";
      popup.style.left = "auto";
      popup.style.bottom = "auto";
      popup.classList.add("open");
    });
  }

  function close() {
    if (!popup) return;
    popup.classList.remove("open");
    currentExId = null;
  }

  function renderBody(data) {
    var safeHtml = OB.ui.safeHtml;
    var t = OB.i18n.t;
    var exId = data.exerciseId;
    var tasks = data.tasks;
    var prog = OB.state.getExactStepProgress(exId, tasks);
    var pct = prog.total > 0 ? Math.round((prog.done / prog.total) * 100) : 0;

    var html = '';

    // Progress bar
    html += '<div class="exercise-progress">';
    html += '<div class="exercise-progress-label">' + t("exactSteps.stepsCompleted", { done: prog.done, total: prog.total }) + '</div>';
    html += '<div class="exercise-progress-bar"><div class="exercise-progress-fill" style="width:' + pct + '%"></div></div>';
    html += '</div>';

    // Tasks
    tasks.forEach(function (task) {
      var taskDone = 0;
      task.steps.forEach(function (_s, si) {
        if (OB.state.isExactStepDone(exId, task.id, si)) taskDone++;
      });

      html += '<div class="exercise-task">';
      html += '<div class="exercise-task-header">';
      html += '<h3>' + safeHtml(task.title) + '</h3>';
      html += '<span class="exercise-task-progress">' + t("topic.stepsProgress", { done: taskDone, total: task.steps.length }) + '</span>';
      html += '</div>';
      html += '<div class="exercise-steps">';

      task.steps.forEach(function (step, si) {
        var isDone = OB.state.isExactStepDone(exId, task.id, si);
        var hasDetail = step.detail || step.hint;

        html += '<div class="exercise-step' + (isDone ? " done" : "") + '" data-exact-ex="' + exId + '" data-exact-task="' + task.id + '" data-exact-step="' + si + '">';

        html += '<label class="exercise-step-row">';
        html += '<span class="exercise-step-num">' + (si + 1) + '</span>';
        html += '<input type="checkbox" class="exact-step-check" data-exact-ex="' + exId + '" data-exact-task="' + task.id + '" data-exact-step="' + si + '"' + (isDone ? " checked" : "") + '>';
        html += '<span class="exercise-step-action">' + safeHtml(step.action) + '</span>';
        html += '</label>';

        if (hasDetail) {
          html += '<button class="exercise-step-expand" data-exact-expand="' + exId + '-' + task.id + '-' + si + '" title="Details">&#9660;</button>';
        }

        if (hasDetail) {
          html += '<div class="exercise-step-detail" id="exact-detail-' + exId + '-' + task.id + '-' + si + '">';
          if (step.detail) {
            html += '<p class="exercise-step-context">' + safeHtml(step.detail) + '</p>';
          }
          if (step.hint) {
            html += '<p class="exercise-step-hint"><strong>' + OB.i18n.t("topic.showHint") + ':</strong> ' + safeHtml(step.hint) + '</p>';
          }
          html += '</div>';
        }

        html += '</div>';
      });

      html += '</div>';
      html += '</div>';
    });

    return html;
  }

  function bindBodyInteractions() {
    if (!bodyEl) return;

    // Checkbox handlers
    bodyEl.querySelectorAll(".exact-step-check").forEach(function (cb) {
      cb.addEventListener("change", function () {
        var exId = cb.getAttribute("data-exact-ex");
        var taskId = cb.getAttribute("data-exact-task");
        var stepIdx = parseInt(cb.getAttribute("data-exact-step"), 10);
        var stepEl = cb.closest(".exercise-step");

        if (cb.checked) {
          OB.state.completeExactStep(exId, taskId, stepIdx);
          if (stepEl) stepEl.classList.add("done");
        } else {
          OB.state.uncompleteExactStep(exId, taskId, stepIdx);
          if (stepEl) stepEl.classList.remove("done");
        }

        // Update progress
        var tasks = bodyEl.querySelectorAll(".exercise-task");
        var totalDone = 0, totalSteps = 0;
        tasks.forEach(function (taskEl) {
          var doneInTask = taskEl.querySelectorAll(".exercise-step.done").length;
          var stepsInTask = taskEl.querySelectorAll(".exercise-step").length;
          totalDone += doneInTask;
          totalSteps += stepsInTask;
          var progLabel = taskEl.querySelector(".exercise-task-progress");
          if (progLabel) progLabel.textContent = OB.i18n.t("topic.stepsProgress", { done: doneInTask, total: stepsInTask });
        });

        var pct = totalSteps > 0 ? Math.round((totalDone / totalSteps) * 100) : 0;
        var fill = bodyEl.querySelector(".exercise-progress-fill");
        if (fill) fill.style.width = pct + "%";
        var label = bodyEl.querySelector(".exercise-progress-label");
        if (label) label.textContent = OB.i18n.t("exactSteps.stepsCompleted", { done: totalDone, total: totalSteps });
      });
    });

    // Expand/collapse toggles
    bodyEl.querySelectorAll("[data-exact-expand]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var key = btn.getAttribute("data-exact-expand");
        var detail = document.getElementById("exact-detail-" + key);
        if (detail) {
          var isOpen = detail.classList.toggle("open");
          btn.classList.toggle("open", isOpen);
        }
      });
    });
  }

  OB.exactSteps = {
    init: init,
    open: open,
    close: close,
  };
})();
