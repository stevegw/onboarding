/**
 * OB -- Catalog Bundle
 * =====================
 * Catalog data embedded as JS for file:// compatibility.
 * When present, content.js uses this instead of fetch("catalog.json").
 */
(function () {
 "use strict";
 var OB = window.OB = window.OB || {};

 OB._uiStringsEn = {
 "app.title": "Windchill OCP",
 "app.subtitle": "Onboarding",
 "app.courseProgress": "Course Progress",
 "app.courseProgressPct": "Course Progress: {pct}%",
 "app.resetProgress": "Reset Progress",
 "app.resetConfirm": "Reset all progress and notes?",
 "app.openMenu": "Open menu",
 "app.toggleTheme": "Toggle theme",
 "sidebar.dashboard": "Dashboard",
 "sidebar.modules": "Modules",
 "sidebar.resources": "Resources",
 "sidebar.glossary": "Glossary",
 "sidebar.knowledgeCheck": "Knowledge Check",
 "sidebar.comingSoon": "Coming soon",
 "sidebar.topicLabel": "Topic {mod}.{topic}",
 "sidebar.exerciseLabel": "Exercise {num}",
 "dashboard.continueLabel": "Continue where you left off",
 "dashboard.statComplete": "Complete",
 "dashboard.statTopics": "Topics",
 "dashboard.statEstimated": "Estimated",
 "dashboard.modules": "Modules",
 "dashboard.moduleNum": "Module {num}",
 "dashboard.moduleComingSoon": "Module {num} - Coming Soon",
 "dashboard.topicsProgress": "{done}/{total} topics",
 "dashboard.estimatedMin": "~{min} min",
 "dashboard.routeTopic": "Topic {label}",
 "dashboard.routeModule": "Module {label}",
 "dashboard.routeQuiz": "Quiz {label}",
 "dashboard.routeGlossary": "Glossary",
 "topic.breadcrumbDashboard": "Dashboard",
 "topic.breadcrumbModule": "Module {num}",
 "topic.topicNum": "Topic {mod}.{topic}",
 "topic.exerciseNum": "Exercise {num}",
 "topic.estimated": "Estimated: ~{min} min",
 "topic.keyTakeaways": "Key Takeaways",
 "topic.markComplete": "Mark as Complete",
 "topic.completedUndo": "Completed - Click to undo",
 "topic.previous": "Previous",
 "topic.next": "Next",
 "topic.moduleOverview": "Module Overview",
 "topic.takeQuiz": "Take Quiz",
 "topic.clickToReveal": "Click to reveal",
 "topic.allMatchedCorrectly": "All matched correctly!",
 "topic.scenarioLabel": "Scenario",
 "topic.strategyLabel": "Strategy",
 "topic.showHint": "Show hint",
 "topic.hideHint": "Hide hint",
 "topic.objective": "Objective",
 "topic.stepsCompleted": "{done}/{total} steps completed",
 "topic.stepsProgress": "{done}/{total} steps",
 "topic.doThis": "Do This",
 "topic.whyItMatters": "Why It Matters",
 "topic.doneNextStep": "Done - Next Step",
 "topic.topicsComplete": "{done}/{total} topics complete",
 "topic.moduleBadge": "Module {num}",
 "topic.topics": "Topics",
 "topic.startModule": "Start Module",
 "topic.backToDashboard": "Dashboard",
 "topic.knowledgeCheck": "Module {num} Knowledge Check",
 "topic.quizBest": "Best: {score}/{total}",
 "topic.quizNotAttempted": "Not attempted yet",
 "quiz.moduleKnowledgeCheck": "Module {num} Knowledge Check",
 "quiz.questionProgress": "Question {current} of {total}",
 "quiz.previous": "Previous",
 "quiz.back": "Back",
 "quiz.next": "Next",
 "quiz.seeResults": "See Results",
 "quiz.retryQuiz": "Retry Quiz",
 "quiz.backToModule": "Back to Module",
 "quiz.greatJob": "Great job!",
 "quiz.goodEffort": "Good effort!",
 "quiz.keepStudying": "Keep studying!",
 "quiz.scoreMessage": "You scored {pct}% on the Module {num} Knowledge Check.",
 "quiz.review": "Review",
 "quiz.yourAnswer": "Your answer: {answer}",
 "quiz.correct": "Correct: {answer}",
 "quiz.notAvailable": "Quiz not available yet.",
 "quiz.topicNotFound": "Topic not found.",
 "quiz.moduleNotFound": "Module not found.",
 "glossary.title": "Glossary",
 "glossary.subtitle": "Options and Configurable Products terminology ({count} terms)",
 "glossary.searchPlaceholder": "Search terms...",
 "glossary.noResults": "No terms match your search.",
 "glossary.notAvailable": "Glossary not available.",
 "notepad.title": "Notes",
 "notepad.placeholder": "Take notes as you learn...",
 "notepad.charCount": "{count} chars",
 "notepad.openNotepad": "Open notepad",
 "error.loadingContent": "Error Loading Content",
 "error.serverRequired": "Make sure you are serving this from an HTTP server (e.g., python -m http.server). The fetch() API does not work with file:// URLs.",
 "catalog.title": "Training Catalog",
 "catalog.subtitle": "Interactive onboarding courses for PTC products",
 "catalog.platformTitle": "PTC Training",
 "catalog.platformSubtitle": "Course Catalog",
 "catalog.productFamilies": "Product Families",
 "catalog.courses": "{count} courses",
 "catalog.languages": "languages",
 "catalog.comingSoon": "Coming Soon",
 "catalog.prerequisite": "Prerequisite",
 "catalog.backToCatalog": "All Courses",
 "locale.en": "English",
 "locale.fr": "Français",
 "locale.de": "Deutsch",
 "locale.ja": "日本語",
 "locale.zh": "中文",
 "locale.ko": "한국어",
 "locale.es": "Español"
 };

 OB._catalogBundle = {
 "title": "PTC Training Catalog",
 "description": "Interactive onboarding courses for PTC products",
 "families": [
  {
   "id": "windchill",
   "name": "Windchill",
   "color": "#4EA8DE",
   "icon": "&#9881;",
   "courses": [
    {
     "id": "wcfd-over",
     "title": "Windchill Fundamentals Overview",
     "description": "Explore how Windchill provides the tools to organize and access product data throughout the product life cycle. Navigate the user interface, browse and search for data, work with tables, and modify objects.",
     "pdfFile": "WCFD-OVER-Training-Guide.pdf",
     "modules": 4,
     "estimatedHours": 4,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "wcfd-ebom",
     "title": "Fundamentals of Engineering BOM (eBOM)",
     "description": "Learn to create, filter, and work with an engineering bill of materials (eBOM) using the Product Structure Browser.",
     "pdfFile": "WCFD-EBOM-Training-Guide.pdf",
     "prerequisite": "wcfd-over",
     "modules": 4,
     "estimatedHours": 2,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "wcba-cntx",
     "title": "Introduction and Context Administration",
     "description": "Configure Windchill to work with your enterprise's product development process. Identify contexts and their relationships, create and manage organizations, products, and libraries, build context templates, and control system behavior.",
     "pdfFile": "WCBA-CNTX-Training-Guide.pdf",
     "modules": 4,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "wcba-team",
     "title": "Participants and Teams",
     "description": "Plan and associate participants with the roles, groups, context teams, and access needed for business processes.",
     "pdfFile": "WCBA-TEAM-Training-Guide.pdf",
     "prerequisite": "wc-context",
     "modules": 4,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "wc-objtypes",
     "title": "Object Types",
     "description": "Configure and manage Windchill object types, subtypes, and type hierarchies.",
     "pdfFile": "WCBA-OBTY-Training-Guide.pdf",
     "modules": 0,
     "estimatedHours": 4,
     "locales": [
      "en"
     ],
     "comingSoon": true
    },
    {
     "id": "wcba-accs",
     "title": "Access Control",
     "description": "Compare access control priorities and define rules using domain policies, ad hoc access, and security labels.",
     "pdfFile": "WCBA-ACCS-Training-Guide.pdf",
     "prerequisite": "wc-objtypes",
     "modules": 4,
     "estimatedHours": 2,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "wc-reporting",
     "title": "Reporting",
     "description": "Create and manage reports, queries, and data visualization in Windchill.",
     "pdfFile": "WCBA-RPTG-Training-Guide.pdf",
     "modules": 0,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": true
    },
    {
     "id": "wc-abtt",
     "title": "Advanced BOM Transformation Topics",
     "description": "Advanced techniques for BOM transformation, restructuring, and manufacturing views.",
     "pdfFile": "WCBM-ABTT-Training-Guide.pdf",
     "modules": 0,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": true
    },
    {
     "id": "wccm-auto",
     "title": "Automate Change Processes",
     "description": "Configure life cycles and workflow templates to automate change processes. Understand queue management for tuning workflow performance.",
     "pdfFile": "WCCM-AUTO-Training-Guide.pdf",
     "prerequisite": "wcba-accs",
     "modules": 4,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "wc-changeimpl",
     "title": "Change Implementation",
     "description": "Implement change processes including change requests, notices, and tasks.",
     "pdfFile": "WCCM-CHIM-Training-Guide.pdf",
     "modules": 0,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": true
    },
    {
     "id": "wccm-adcm",
     "title": "Tailoring Change Management",
     "description": "Plan and implement a tailored change management process. Create custom change objects, configure business rules, modify workflows and life cycles, and test the complete change process.",
     "pdfFile": "WCCM-ADCM-Training-Guide.pdf",
     "prerequisite": "wc-changeimpl",
     "modules": 4,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "wc-ocp1",
     "title": "Options & Configurable Products 1",
     "description": "Learn business approaches to configurable products, explore options and variants terminology, investigate rules, and master option sets.",
     "pdfFile": "WCCB-OCP1-Training-Guide.pdf",
     "modules": 4,
     "estimatedHours": 2,
     "locales": [
      "en",
      "fr",
      "de",
      "ja",
      "zh",
      "ko",
      "es"
     ],
     "comingSoon": false
    },
    {
     "id": "wc-ocp2",
     "title": "Options & Configurable Products 2",
     "description": "Advanced OCP topics including complex rules, advanced option sets, and integration patterns.",
     "pdfFile": "WCCB-OCP2-Training-Guide.pdf",
     "prerequisite": "wc-ocp1",
     "modules": 0,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": true
    },
    {
     "id": "wcec-rest",
     "title": "REST Services",
     "description": "Connect and manipulate data sent to and from Windchill. Prototype multiple types of REST requests for a process-based use case and analyze the responses.",
     "pdfFile": "WCEC-REST-Training-Guide.pdf",
     "prerequisite": "wcfd-over",
     "modules": 4,
     "estimatedHours": 4,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "wcba-uag",
     "title": "User Accounts and Groups",
     "description": "User Accounts and Groups",
     "modules": 3,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": false
    }
   ]
  },
  {
   "id": "codebeamer",
   "name": "Codebeamer",
   "color": "#A78BFA",
   "icon": "&#128202;",
   "courses": [
    {
     "id": "cb-overview",
     "title": "Codebeamer Fundamentals Overview",
     "description": "Introduction to Codebeamer ALM platform - trackers, requirements management, test management, and data visualization.",
     "pdfFile": "CBFD-OVER-Training-Guide.pdf",
     "modules": 4,
     "estimatedHours": 2,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "cb-reqmgmt",
     "title": "Fundamentals of Requirements Management",
     "description": "Gain proficiency in Codebeamer to record, refine, trace, and link requirements using techniques including mass edit, Microsoft Office integration, views, reports, and filters.",
     "pdfFile": "CBFD-REQM-Training-Guide.pdf",
     "prerequisite": "cb-overview",
     "modules": 4,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "cb-testmgmt",
     "title": "Test Management",
     "description": "Plan, execute, and track testing activities and test cases.",
     "pdfFile": "CBFD-TEST-Training-Guide.pdf",
     "prerequisite": "cb-overview",
     "modules": 4,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "cb-projrptg",
     "title": "Project Management and Reporting",
     "description": "Manage projects, sprints, and generate reports in Codebeamer.",
     "pdfFile": "CBFD-RPTG-Training-Guide.pdf",
     "modules": 0,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": true
    }
   ]
  },
  {
   "id": "creo",
   "name": "Creo",
   "color": "#6EE7B7",
   "icon": "&#9998;",
   "courses": [
    {
     "id": "creo-mdl1",
     "title": "Fundamentals Modeling 1",
     "description": "Core 3D modeling fundamentals including the Creo design process, parametric concepts, the user interface, feature editing, sketching, datums, and extrude features.",
     "pdfFile": "CRFD-MDL1-Training-Guidebook.pdf",
     "modules": 4,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "creo-mdl2",
     "title": "Fundamentals Modeling 2",
     "description": "Advanced modeling techniques including sweeps, blends, patterns, and surface modeling.",
     "pdfFile": "CRFD-MDL2-Training-Guidebook.pdf",
     "prerequisite": "creo-mdl1",
     "modules": 0,
     "estimatedHours": 4,
     "locales": [
      "en"
     ],
     "comingSoon": true
    },
    {
     "id": "creo-assy",
     "title": "Fundamentals Assembly",
     "description": "Assembly design fundamentals including constraints, mechanisms, and BOM management.",
     "pdfFile": "CRFD-ASBY-Training-Guidebook.pdf",
     "modules": 0,
     "estimatedHours": 4,
     "locales": [
      "en"
     ],
     "comingSoon": true
    },
    {
     "id": "creo-drawing",
     "title": "Fundamentals 2D Drawing",
     "description": "Create engineering drawings with views, dimensions, annotations, and drawing standards.",
     "pdfFile": "CRFD-DRWG-Training-Guidebook.pdf",
     "modules": 0,
     "estimatedHours": 4,
     "locales": [
      "en"
     ],
     "comingSoon": true
    },
    {
     "id": "creo-fdasby",
     "title": "Interactive_iSpring_R2_CRFD-ASBY",
     "description": "Interactive_iSpring_R2_CRFD-ASBY",
     "modules": 5,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": false
    },
    {
     "id": "creo-r2crd-asby",
     "title": "Interactive_iSpring_R2_CRFD-ASBY",
     "description": "Interactive_iSpring_R2_CRFD-ASBY",
     "modules": 5,
     "estimatedHours": 3,
     "locales": [
      "en"
     ],
     "comingSoon": false
    }
   ]
  }
 ]
};
})();
