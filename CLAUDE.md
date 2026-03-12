# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A multi-course interactive training platform for PTC products (Windchill, Codebeamer, Creo). Transforms PTC training PDFs into engaging web-based learning apps with interactive elements, quizzes, and progress tracking.

**Tech stack:** Vanilla JavaScript + HTML + CSS. No frameworks, no build step, no server required. Deploys to GitHub Pages from `docs/`.

**Scale:** 20 courses (3 complete, 17 coming soon), ~1,500 pages total across 3 product families.

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

Content block types: `heading`, `paragraph`, `callout`, `comparison-table`, `reveal-cards`, `interactive-match`, `interactive-sort`, `exercise`, `image`.

### Content Block JSON Schemas (Critical)

The renderer in `topic.js` expects **exact property names**. Using wrong keys causes silent failures ("Topic not found"). Always match these schemas — do NOT invent alternative key names:

```
heading:           { type, level, text }
paragraph:         { type, text }
callout:           { type, variant, text }              — variant: "tip"|"info"|"warning"|"insight"
comparison-table:  { type, headers, rows }              — headers: string[], rows: string[][]
reveal-cards:      { type, cards }                      — cards: [{ front, back }]
interactive-match: { type, prompt, pairs }              — pairs: [{ left, right }]
interactive-sort:  { type, prompt, items }              — items: string[] (correct order; shuffled at render)
                   ⚠️ The key is "items", NOT "correctOrder" or "options"
exercise:          { type, exerciseId, title, objective, tasks }
                   — tasks: [{ id, title, steps: [{ action, detail, hint }] }]
image:             { type, src, alt, caption, size }
```

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

1. Create `docs/courses/{course-id}/` with `course.json`, `glossary.json`, `modules/`, `quizzes/`, `bundles/`
2. Update **both** `docs/catalog.json` **and** `docs/js/catalog-bundle.js` — the bundle has an embedded copy of the catalog that takes precedence; forgetting it leaves the course grayed out as "Coming Soon"
3. Set `comingSoon: false`, update `modules` count in both files
4. Run `cd docs && python build-bundles.py` to generate the JS content bundle
5. Validate all JSON: `python -m json.tool < file.json`

## Content Authoring Patterns

This section captures the patterns established across all 3 complete courses (wc-ocp1, cb-overview, creo-mdl1). Follow these patterns when authoring new courses to maintain consistency.

### Course Structure

Each course has **4 modules**. Each module has **4–8 topics** split into two zones:

1. **Concept topics** (first N topics) — teach knowledge with interactive elements
2. **Exercise topics** (last 1–3 topics) — hands-on practice with step-by-step tasks

The split point is declared in `course.json` via `exerciseTopicStart`. If a module has no exercises, omit this field.

### course.json Template

```json
{
  "id": "{course-id}",
  "title": "Product: Course Title",
  "description": "One-sentence course summary.",
  "prerequisite": null,
  "modules": [
    {
      "id": "m1",
      "title": "Module Title",
      "description": "What the learner will do in this module.",
      "estimatedMinutes": 30,
      "topicCount": 5,
      "exerciseTopicStart": 4,
      "contentFile": "modules/m1-slug.json",
      "quizFile": "quizzes/q1-slug.json"
    }
  ]
}
```

### Module JSON Structure

Each module file (`modules/m1-slug.json`) contains:

```json
{
  "id": "m1",
  "title": "Module Title",
  "description": "Module description.",
  "topics": [
    {
      "id": "m1t1",
      "title": "Topic Title",
      "estimatedMinutes": 5,
      "content": [ /* content blocks */ ],
      "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
    }
  ]
}
```

Exercise topics add `"isExercise": true`.

### Topic ID Convention

- Topic IDs: `m{module}t{topic}` — e.g., `m1t1`, `m2t3`, `m4t8`
- Exercise IDs: `ex{n}` — sequential across the course (ex1, ex2, ... exN)
- Task IDs within exercises: `ex{n}-t{m}` or `task{m}`
- Quiz question IDs: `m{n}-kc-00{n}` (kc = knowledge check)

### Concept Topic Pattern

Every concept topic follows this flow:

```
1. Opening paragraph     — sets context for the topic
2. Heading (h2)          — first section header
3. Explanatory content   — paragraphs, comparison-tables, reveal-cards
4. Callout               — tip/info/warning/insight to highlight a key point
5. Interactive element   — interactive-match OR interactive-sort (at least one per topic)
```

Typical block count: **4–8 blocks** per concept topic.

**Content block sequencing rules:**
- Always open with a `paragraph` (never a heading first)
- Use `heading` (level 2) to break content into sections; use level 3 for subsections
- Place `callout` blocks after explanatory content, before or after interactive elements
- End with an interactive element when possible (match or sort) to reinforce learning
- Alternate between dense content (tables, paragraphs) and visual/interactive elements (cards, match, sort) — don't stack multiple tables or multiple card blocks back-to-back

### Exercise Topic Pattern

Exercise topics follow a simpler structure:

```
1. Opening paragraph     — what the learner will practice
2. Callout (info/warning) — prerequisites or cautions (optional)
3. Exercise block         — tasks with steps
4. Exercise steps must match the values provided
```

Typical block count: **2–4 blocks**. Some exercise topics include an `image` block before the exercise.

**Exercise block structure:**
- 1–4 tasks per exercise
- 3–7 steps per task
- Every step has `action` (imperative instruction) and `detail` (why/context)
- `hint` is optional (null when the step is self-explanatory)

### Key Takeaways

Every topic (concept and exercise) has `keyTakeaways`:
- **Concept topics:** 3–4 takeaways
- **Exercise topics:** 3–4 takeaways
- Written as complete, concise statements
- Reinforce the most important points from the topic

### Callout Usage

| Variant | When to use |
|---------|-------------|
| `info` | Clarifications, definitions, exercise prerequisites |
| `tip` | Best practices, productivity hints, shortcuts |
| `warning` | Critical caveats, data-loss risks, common mistakes |
| `insight` | Deeper understanding, industry context, design rationale |

Use 1–2 callouts per topic. Don't cluster multiple callouts together.

### Interactive Elements

**`interactive-match`** — Match left items to right items. Use for:
- Matching terms to definitions
- Matching scenarios to strategies
- Matching concepts to benefits
- Typically 3–4 pairs

**`interactive-sort`** — Arrange items in correct order. Use for:
- Process sequences, workflow steps, hierarchy ordering
- Typically 3–4 items
- Items stored in correct order; renderer shuffles them

**`reveal-cards`** — Flip cards with front/back content. Use for:
- Key concepts with detailed explanations
- Feature/benefit pairs
- Typically 3–4 cards

**`comparison-table`** — Structured data in rows/columns. Use for:
- Feature comparisons, before/after, pros/cons
- Term/definition matrices with categories
- Typically 2–3 columns, 3–7 rows

### Estimated Minutes

| Topic type | Typical range |
|-----------|---------------|
| Concept topic | 5–8 min |
| Exercise topic | 8–15 min |
| Simple exercise (1 task, 3–4 steps) | 3–5 min |

Module totals typically range from 20–55 min.

### Quiz Structure

Each module has one quiz file (`quizzes/q{n}-slug.json`):

```json
{
  "moduleId": "m1",
  "title": "Module Title Knowledge Check",
  "questions": [
    {
      "id": "m1-kc-001",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 2,
      "rationale": "Explanation of correct answer and why others are wrong.",
      "topic": "m1t1"
    }
  ]
}
```

- **4–5 questions** per quiz
- Always **4 options**, single correct answer
- `rationale` explains correct answer AND addresses why distractors are wrong
- `topic` links the question to a specific concept topic (never exercise topics)
- Questions only test concept topics, not exercise topics

### Glossary Structure

Each course has `glossary.json`:

```json
{
  "terms": [
    { "term": "Term Name", "definition": "2–3 sentence definition with context." }
  ]
}
```

- **15–32 terms** per course covering core domain vocabulary
- Definitions are precise and self-contained
- Include all key terms introduced across all modules

### Inline Formatting

Text fields in content blocks support inline HTML via `safeHtml()`:
- `<strong>bold</strong>`, `<em>italic</em>`, `<code>inline code</code>`, `<br>` line breaks
- All other HTML tags are stripped during rendering
- Existing plain text renders identically (backward compatible)

### File Naming Conventions

```
courses/{course-id}/
  course.json
  glossary.json
  modules/m1-{slug}.json          ← slug = kebab-case topic summary
  modules/m2-{slug}.json
  quizzes/q1-{slug}.json          ← slug matches corresponding module
  quizzes/q2-{slug}.json
  bundles/en.js                   ← generated by build-bundles.py
  images/{filename}.png           ← referenced by image blocks as "images/..."
```

## Related Projects

- **WCAI** (`C:\AI\WCAI`) — Windchill Change Management config wizard (same vanilla JS/CSS pattern)
- **WCAI OCP** (`C:\AI\WCAI\ocp`) — OCP config wizard (domain model reused here)
- **ptclms** (`C:\AI\ptclms`) — Previous LMS attempt (Next.js, over-engineered)

## Current State

- **Catalog:** 20 courses across 3 product families (Windchill 12, Codebeamer 4, Creo 4)
- **wc-ocp1** (Options & Configurable Products 1) — complete with 4 modules, 7 locales
- **cb-overview** (Codebeamer Fundamentals Overview) — complete with 4 modules, English only
- **creo-mdl1** (Creo Fundamentals Modeling 1) — complete with 4 modules, English only
- **All other courses** — `comingSoon: true` in catalog.json; content not yet authored
