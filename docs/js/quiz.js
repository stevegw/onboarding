/**
 * OB -- Onboarding -- Quiz Engine
 * =================================
 * Renders quiz questions one at a time with immediate feedback.
 * Attached to window.OB.quiz.
 */
(function () {
  "use strict";

  var OB = window.OB = window.OB || {};

  var currentQuiz = null;
  var currentModuleId = null;
  var currentQuestion = 0;
  var answers = [];
  var showingResults = false;

  function render(moduleId) {
    currentModuleId = moduleId;
    currentQuestion = 0;
    answers = [];
    showingResults = false;

    OB.content.getQuiz(moduleId).then(function (quiz) {
      currentQuiz = quiz;
      renderQuestion();
    }).catch(function () {
      var t = OB.i18n.t;
      OB.ui.setMain('<p>' + t("quiz.notAvailable") + '</p><div class="nav-btns"><button class="btn btn-outline" data-route="#/module/' + moduleId + '">&#8592; ' + t("quiz.back") + '</button></div>');
      bindNavClicks();
    });
  }

  function renderQuestion() {
    if (!currentQuiz) return;

    var esc = OB.ui.esc;
    var t = OB.i18n.t;
    var q = currentQuiz.questions[currentQuestion];
    var total = currentQuiz.questions.length;
    var modIdx = parseInt(currentModuleId.replace("m", ""), 10);
    var answered = answers[currentQuestion] != null;

    var html = '';
    html += '<div class="quiz-header">';
    html += '<h2>' + t("quiz.moduleKnowledgeCheck", { num: modIdx }) + '</h2>';
    html += '<p class="text-muted text-sm">' + t("quiz.questionProgress", { current: currentQuestion + 1, total: total }) + '</p>';

    // Progress dots
    html += '<div class="quiz-progress-dots">';
    for (var i = 0; i < total; i++) {
      var dotClass = "quiz-dot";
      if (i === currentQuestion) dotClass += " current";
      else if (answers[i] != null) {
        dotClass += answers[i] === currentQuiz.questions[i].answerIndex ? " correct" : " incorrect";
      }
      html += '<div class="' + dotClass + '"></div>';
    }
    html += '</div>';
    html += '</div>';

    // Question card
    html += '<div class="quiz-question-card">';
    html += '<div class="quiz-question-text">' + esc(q.question) + '</div>';

    var letters = ["A", "B", "C", "D"];
    q.options.forEach(function (opt, oi) {
      var optClass = "quiz-option";
      if (answered) {
        optClass += " disabled";
        if (oi === q.answerIndex) optClass += " correct";
        else if (oi === answers[currentQuestion] && oi !== q.answerIndex) optClass += " incorrect";
      }
      html += '<div class="' + optClass + '" data-option="' + oi + '">';
      html += '<span class="option-letter">' + letters[oi] + '</span>';
      html += '<span>' + esc(opt) + '</span>';
      html += '</div>';
    });

    html += '</div>';

    // Rationale (if answered)
    if (answered) {
      html += '<div class="quiz-rationale">' + esc(q.rationale) + '</div>';
    }

    // Navigation
    html += '<div class="nav-btns">';
    if (currentQuestion > 0) {
      html += '<button class="btn btn-outline" id="quiz-prev">&#8592; ' + t("quiz.previous") + '</button>';
    } else {
      html += '<button class="btn btn-outline" data-route="#/module/' + currentModuleId + '">&#8592; ' + t("quiz.back") + '</button>';
    }

    if (answered) {
      if (currentQuestion < total - 1) {
        html += '<button class="btn btn-primary" id="quiz-next">' + t("quiz.next") + ' &#8594;</button>';
      } else {
        html += '<button class="btn btn-primary" id="quiz-finish">' + t("quiz.seeResults") + ' &#8594;</button>';
      }
    } else {
      html += '<span></span>';
    }
    html += '</div>';

    OB.ui.setMain(html);

    // Bind option clicks
    if (!answered) {
      document.querySelectorAll(".quiz-option").forEach(function (el) {
        el.addEventListener("click", function () {
          var optIdx = parseInt(el.getAttribute("data-option"), 10);
          answers[currentQuestion] = optIdx;
          renderQuestion();
        });
      });
    }

    // Bind nav
    var prevBtn = document.getElementById("quiz-prev");
    if (prevBtn) prevBtn.addEventListener("click", function () { currentQuestion--; renderQuestion(); });

    var nextBtn = document.getElementById("quiz-next");
    if (nextBtn) nextBtn.addEventListener("click", function () { currentQuestion++; renderQuestion(); });

    var finishBtn = document.getElementById("quiz-finish");
    if (finishBtn) finishBtn.addEventListener("click", renderResults);

    bindNavClicks();
  }

  function renderResults() {
    if (!currentQuiz) return;
    showingResults = true;

    var esc = OB.ui.esc;
    var t = OB.i18n.t;
    var total = currentQuiz.questions.length;
    var correct = 0;
    answers.forEach(function (a, i) {
      if (a === currentQuiz.questions[i].answerIndex) correct++;
    });

    // Save result
    OB.state.saveQuizResult(currentModuleId, correct, total);

    var pct = Math.round((correct / total) * 100);
    var circumference = 2 * Math.PI * 42;
    var offset = circumference - (pct / 100) * circumference;
    var modIdx = parseInt(currentModuleId.replace("m", ""), 10);

    var html = '';
    html += '<div class="quiz-results">';

    // Score ring
    html += '<div class="quiz-score-ring">';
    html += '<svg viewBox="0 0 100 100">';
    html += '<circle class="ring-bg" cx="50" cy="50" r="42"/>';
    html += '<circle class="ring-fill' + (pct < 50 ? " low" : "") + '" cx="50" cy="50" r="42" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '"/>';
    html += '</svg>';
    html += '<div class="quiz-score-text">' + correct + '/' + total + '</div>';
    html += '</div>';

    var heading = pct >= 75 ? t("quiz.greatJob") : pct >= 50 ? t("quiz.goodEffort") : t("quiz.keepStudying");
    html += '<h2>' + heading + '</h2>';
    html += '<p class="text-muted">' + t("quiz.scoreMessage", { pct: pct, num: modIdx }) + '</p>';

    html += '</div>';

    // Question review
    html += '<h3 class="mb-md mt-lg">' + t("quiz.review") + '</h3>';
    currentQuiz.questions.forEach(function (q, qi) {
      var isCorrect = answers[qi] === q.answerIndex;
      html += '<div class="card mb-sm">';
      html += '<p style="font-size:13px;font-weight:600;color:var(--c-text-primary);margin-bottom:8px">';
      html += (isCorrect ? '&#10003; ' : '&#10007; ') + esc(q.question);
      html += '</p>';
      if (!isCorrect) {
        html += '<p style="font-size:12px;color:var(--c-danger);margin-bottom:4px">' + t("quiz.yourAnswer", { answer: esc(q.options[answers[qi]]) }) + '</p>';
        html += '<p style="font-size:12px;color:var(--c-accent);margin-bottom:4px">' + t("quiz.correct", { answer: esc(q.options[q.answerIndex]) }) + '</p>';
      }
      html += '<p style="font-size:12px;color:var(--c-text-muted)">' + esc(q.rationale) + '</p>';
      html += '</div>';
    });

    // Navigation
    html += '<div class="nav-btns">';
    html += '<button class="btn btn-outline" id="quiz-retry">' + t("quiz.retryQuiz") + '</button>';
    html += '<button class="btn btn-primary" data-route="#/module/' + currentModuleId + '">' + t("quiz.backToModule") + ' &#8594;</button>';
    html += '</div>';

    OB.ui.setMain(html);

    var retryBtn = document.getElementById("quiz-retry");
    if (retryBtn) retryBtn.addEventListener("click", function () { render(currentModuleId); });

    bindNavClicks();

    // Update sidebar
    OB.content.getCourse().then(function (course) {
      OB.sidebar.render(course, window.location.hash);
    });
  }

  function bindNavClicks() {
    document.querySelectorAll("[data-route]").forEach(function (el) {
      el.addEventListener("click", function () {
        window.location.hash = el.getAttribute("data-route");
      });
    });
  }

  OB.quiz = { render: render };
})();
