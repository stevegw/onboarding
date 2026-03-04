# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An interactive onboarding experience for PTC Windchill Options and Configurable Products (OCP) training. Transforms a 67-page PTC training PDF into an engaging web-based learning app with interactive elements, quizzes, and progress tracking.

**Tech stack:** Vanilla JavaScript + HTML + CSS. No frameworks, no build step, no server required. Deploys to GitHub Pages from `docs/`.

**Content source:** `docs/WCCB-OCP1-Training-Guide-reduced.pdf` (not served; used as reference for content authoring).

## Running the App

```bash
cd docs && python -m http.server 8050
# Open http://localhost:8050
```

`fetch()` requires HTTP — `file://` protocol will not work.

## Architecture

### Namespace: `window.OB`

All JS uses IIFE module pattern attaching to `window.OB`:

| Module | File | Purpose |
|--------|------|---------|
| `OB.ui` | `js/ui.js` | DOM helpers, HTML escaping |
| `OB.state` | `js/state.js` | localStorage persistence (keys prefixed `ob_`) |
| `OB.content` | `js/content.js` | Fetch/cache JSON content files |
| `OB.theme` | `js/theme.js` | Dark/light toggle |
| `OB.router` | `js/router.js` | Hash-based SPA routing |
| `OB.sidebar` | `js/sidebar.js` | Sidebar navigation with progress |
| `OB.dashboard` | `js/dashboard.js` | Course overview view |
| `OB.topic` | `js/topic.js` | Topic content + module overview renderer |
| `OB.quiz` | `js/quiz.js` | Quiz engine (one question at a time) |
| `OB.glossary` | `js/glossary.js` | Searchable terminology reference |
| `OB.notepad` | `js/notepad.js` | Floating notepad FAB |

**Script load order matters** (in `index.html`): ui → state → content → theme → sidebar → dashboard → topic → quiz → glossary → notepad → router.

### Routing

Hash-based routes — no server config needed:
- `#/` — Dashboard
- `#/module/{id}` — Module overview
- `#/topic/{id}` — Topic content (e.g., `m1t2`)
- `#/quiz/{id}` — Module knowledge check
- `#/glossary` — Terminology reference

### Content Storage

Structured JSON in `docs/content/`:
- `course.json` — Course metadata, module list
- `modules/m1-*.json` — Module content with typed content blocks
- `quizzes/q1-*.json` — Quiz questions with answers and rationale
- `glossary.json` — OCP terminology definitions

Content blocks types: `heading`, `paragraph`, `callout`, `comparison-table`, `reveal-cards`, `interactive-match`, `interactive-sort`.

### CSS Architecture

Split from the WCAI theme system into focused files:
- `variables.css` — CSS custom properties (dark/light themes)
- `base.css` — Reset, typography, layout
- `sidebar.css` — Sidebar navigation
- `components.css` — Cards, buttons, callouts, interactive elements
- `views.css` — View-specific styles (dashboard, topic, quiz, glossary)
- `animations.css` — Transitions

## Related Projects

- **WCAI** (`C:\AI\WCAI`) — Windchill Change Management config wizard (same vanilla JS/CSS pattern)
- **WCAI OCP** (`C:\AI\WCAI\ocp`) — OCP config wizard (domain model reused here)
- **ptclms** (`C:\AI\ptclms`) — Previous LMS attempt (Next.js, over-engineered)

## Current State

- Module 1 (Introduce Configurable Products) — complete with 4 topics, quiz, and interactive elements
- Modules 2-4 — `comingSoon: true` in course.json; content JSON files not yet created
