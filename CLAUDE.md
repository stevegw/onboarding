# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A multi-course interactive training platform for PTC products (Windchill, Codebeamer, Creo). Transforms PTC training PDFs into engaging web-based learning apps with interactive elements, quizzes, and progress tracking.

**Tech stack:** Vanilla JavaScript + HTML + CSS. No frameworks, no build step, no server required. Deploys to GitHub Pages from `docs/`.

**Scale:** 20 courses (1 complete, 19 coming soon), ~1,500 pages total across 3 product families.

**Content source:** PDFs in `docs/pdfs/` (not served; used as reference for content authoring).

## Running the App

```bash
cd docs && python -m http.server 8050
# Open http://localhost:8050            → catalog view
# Open http://localhost:8050?course=wc-ocp1  → OCP1 course
```

`fetch()` requires HTTP — `file://` protocol works with bundled content only.

## Architecture

### Multi-Course Routing

- No `?course=` param → catalog view (product-family-grouped course cards)
- `?course=wc-ocp1` → course mode with hash-based routes:
  - `#/` — Course dashboard
  - `#/module/{id}` — Module overview
  - `#/topic/{id}` — Topic content (e.g., `m1t2`)
  - `#/quiz/{id}` — Module knowledge check
  - `#/glossary` — Terminology reference

### Namespace: `window.OB`

All JS uses IIFE module pattern attaching to `window.OB`:

| Module | File | Purpose |
|--------|------|---------|
| `OB.ui` | `js/ui.js` | DOM helpers, HTML escaping |
| `OB.state` | `js/state.js` | localStorage persistence (per-course namespaced) |
| `OB.content` | `js/content.js` | Fetch/cache JSON content files (course-aware) |
| `OB.i18n` | `js/i18n.js` | Internationalization (7 locales) |
| `OB.theme` | `js/theme.js` | Dark/light toggle |
| `OB.router` | `js/router.js` | Hash-based SPA routing + `?course=` param |
| `OB.sidebar` | `js/sidebar.js` | Sidebar navigation with progress |
| `OB.dashboard` | `js/dashboard.js` | Catalog view + course dashboard |
| `OB.topic` | `js/topic.js` | Topic content + module overview renderer |
| `OB.quiz` | `js/quiz.js` | Quiz engine (one question at a time) |
| `OB.glossary` | `js/glossary.js` | Searchable terminology reference |
| `OB.notepad` | `js/notepad.js` | Floating notepad FAB (per-course) |

**Script load order matters** (in `index.html`): ui → state → content → i18n → theme → sidebar → dashboard → topic → quiz → glossary → notepad → router.

### Content Storage

```
docs/
  catalog.json                    ← Course registry with product families
  content/i18n/ui-*.json          ← Shared UI strings (7 locales)
  courses/
    wc-ocp1/                      ← Per-course content
      course.json                 ← Course metadata, module list
      glossary.json               ← Terminology definitions
      modules/m1-*.json           ← Module content with typed content blocks
      quizzes/q1-*.json           ← Quiz questions with answers and rationale
      fr/ de/ ja/ zh/ ko/ es/     ← Locale-specific content
      bundles/                    ← Embedded JS bundles for file:// mode
        en.js fr.js de.js ...
  pdfs/                           ← Reference PDFs (not served)
```

Content blocks types: `heading`, `paragraph`, `callout`, `comparison-table`, `reveal-cards`, `interactive-match`, `interactive-sort`.

### State Namespacing

localStorage keys are prefixed per-course:
- `ob_wc-ocp1_topics`, `ob_wc-ocp1_quizzes`, etc. (per-course)
- `ob_theme`, `ob_locale` (global)

### CSS Architecture

- `variables.css` — CSS custom properties (dark/light themes)
- `base.css` — Reset, typography, layout
- `sidebar.css` — Sidebar navigation
- `components.css` — Cards, buttons, callouts, interactive elements
- `views.css` — View-specific styles (catalog, dashboard, topic, quiz, glossary)
- `animations.css` — Transitions

## Adding a New Course

1. Create `docs/courses/{course-id}/` with `course.json`, `glossary.json`, `modules/`, `quizzes/`
2. Add entry to `docs/catalog.json` under the appropriate product family
3. Set `comingSoon: false` when content is ready
4. Generate locale content and bundles as needed

## Related Projects

- **WCAI** (`C:\AI\WCAI`) — Windchill Change Management config wizard (same vanilla JS/CSS pattern)
- **WCAI OCP** (`C:\AI\WCAI\ocp`) — OCP config wizard (domain model reused here)
- **ptclms** (`C:\AI\ptclms`) — Previous LMS attempt (Next.js, over-engineered)

## Current State

- **Catalog:** 20 courses across 3 product families (Windchill 12, Codebeamer 4, Creo 4)
- **wc-ocp1** (Options & Configurable Products 1) — complete with 4 modules, 7 locales
- **All other courses** — `comingSoon: true` in catalog.json; content not yet authored
