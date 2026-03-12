#!/usr/bin/env python3
"""
Import iSpring SCORM 1.2 packages into the onboarding platform.

Parses iSpring's proprietary data-1.json format and generates the platform's
JSON course structure (course.json, module files, quiz skeletons, glossary,
and extracted images).

Usage:
  cd docs && python import-scorm.py \
    --zip ../imports/Windchill-User-Accounts-and-Groups-iSpring.zip \
    --course-id wcba-uag --family windchill
"""

import argparse
import json
import math
import os
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
import zipfile

DOCS_DIR = os.path.dirname(os.path.abspath(__file__))
COURSES_DIR = os.path.join(DOCS_DIR, "courses")


# ---------------------------------------------------------------------------
# iSpring data helpers
# ---------------------------------------------------------------------------

def iter_ordered_map(omap):
    """Yield (key, value) from an iSpring ordered map {o:[...], B:{...}}."""
    if not isinstance(omap, dict):
        return
    for key in omap.get("o", []):
        val = omap.get("B", {}).get(key)
        if val is not None:
            yield key, val


def decode_char_array(chars):
    """[{t:"H"}, {t:"e", m:{"#":[1]}}, ...] -> 'H<strong>e</strong>...'"""
    if not chars or not isinstance(chars, list):
        return ""
    parts = []
    in_bold = False
    in_italic = False
    for ch in chars:
        if not isinstance(ch, dict) or "t" not in ch:
            continue
        marks = ch.get("m", {}).get("#", []) if ch.get("m") else []
        want_bold = 1 in marks
        want_italic = 2 in marks
        # Close tags in reverse open order
        if in_italic and not want_italic:
            parts.append("</em>")
            in_italic = False
        if in_bold and not want_bold:
            parts.append("</strong>")
            in_bold = False
        # Open tags
        if want_bold and not in_bold:
            parts.append("<strong>")
            in_bold = True
        if want_italic and not in_italic:
            parts.append("<em>")
            in_italic = True
        parts.append(ch["t"])
    if in_italic:
        parts.append("</em>")
    if in_bold:
        parts.append("</strong>")
    return "".join(parts)


def text_content(chars):
    """Plain text only (no HTML tags)."""
    if not chars or not isinstance(chars, list):
        return ""
    return "".join(ch.get("t", "") for ch in chars if isinstance(ch, dict))


def strip_html(text):
    """Remove HTML tags from a string."""
    return re.sub(r"<[^>]+>", "", text)


def slugify(text):
    """Convert text to kebab-case slug."""
    text = strip_html(text).lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:60]


# ---------------------------------------------------------------------------
# SCORM package loading
# ---------------------------------------------------------------------------

def open_scorm_zip(zip_path):
    """Open and validate the SCORM zip."""
    if not os.path.exists(zip_path):
        print(f"Error: ZIP file not found: {zip_path}", file=sys.stderr)
        sys.exit(1)
    zf = zipfile.ZipFile(zip_path, "r")
    names = zf.namelist()
    if "imsmanifest.xml" not in names:
        print("Error: imsmanifest.xml not found in ZIP.", file=sys.stderr)
        sys.exit(1)
    data_files = [n for n in names if n.endswith("data-1.json")]
    if not data_files:
        print("Error: No data-1.json found. Is this an iSpring package?",
              file=sys.stderr)
        sys.exit(1)
    return zf, data_files[0]


def parse_manifest(zf):
    """Extract course title from imsmanifest.xml."""
    raw = zf.read("imsmanifest.xml")
    root = ET.fromstring(raw)
    ns = {"ims": "http://www.imsproject.org/xsd/imscp_rootv1p1p2"}
    for xpath in [".//ims:organization/ims:title",
                  ".//ims:organization/ims:item/ims:title"]:
        el = root.find(xpath, ns)
        if el is not None and el.text:
            return el.text.strip()
    # Fallback: any <title>
    for el in root.iter():
        if el.tag.endswith("title") and el.text:
            return el.text.strip()
    return "Untitled Course"


def load_ispring_data(zf, data_path):
    """Load the iSpring content JSON."""
    return json.loads(zf.read(data_path))


# ---------------------------------------------------------------------------
# Chapter & block extraction
# ---------------------------------------------------------------------------

def extract_chapters(data):
    """Top-level ordered map -> list of chapter dicts."""
    chapters = []
    for ch_id, ch in iter_ordered_map(data.get("content", {}).get("c", {})):
        h = ch.get("h", {})
        blocks_raw = []
        for blk_id, blk in iter_ordered_map(ch.get("cs", {}).get("b", {})):
            blk["_id"] = blk_id
            blocks_raw.append(blk)
        chapters.append({
            "title": h.get("t", "Untitled"),
            "subtitle": h.get("s", ""),
            "blocks": blocks_raw,
        })
    return chapters


# ---------------------------------------------------------------------------
# Block conversion (iSpring -> platform intermediate)
# ---------------------------------------------------------------------------

def convert_blocks(raw_blocks):
    """Convert raw iSpring blocks to intermediate form.

    Returns (blocks, quiz_questions, image_refs).
    """
    blocks = []
    quiz_questions = []
    image_refs = []

    for raw in raw_blocks:
        t = raw.get("t")
        if t == "p":
            b = _conv_paragraph(raw)
            if b:
                blocks.append(b)
        elif t == "n":
            blocks.append(_conv_note(raw))
        elif t == "c":
            b = _conv_image(raw, image_refs)
            if b:
                blocks.append(b)
        elif t == "v":
            blocks.append(_conv_video())
        elif t == "li":
            blocks.append(_conv_list_item(raw))
        elif t == "Q":
            quiz_questions.extend(_conv_quiz(raw))
        # t == "d" (divider) -- skip

    return blocks, quiz_questions, image_refs


def _conv_paragraph(raw):
    variant = raw.get("v", "text")
    text = decode_char_array(raw.get("c", []))
    if not text.strip():
        return None
    if variant in ("h2", "h3", "h4"):
        return {"type": "heading", "level": int(variant[1]), "text": text}
    return {"type": "paragraph", "text": text}


def _conv_note(raw):
    text = decode_char_array(raw.get("c", []))
    if text.startswith(">"):
        text = text[1:].strip()
    nt = raw.get("nT", "info")
    variant = {"info": "info", "warning": "warning", "tip": "tip",
               "caution": "warning"}.get(nt, "info")
    return {"type": "callout", "variant": variant, "text": text}


def _conv_image(raw, image_refs):
    imgs = raw.get("is", [])
    if not imgs:
        return None
    img = imgs[0]
    src = img.get("s", "")
    if not src or img.get("t") != "i":
        return None
    image_refs.append(src)
    w = img.get("w", 0)
    caption = ""
    ca = img.get("ca", {})
    if ca.get("e") and ca.get("v"):
        caption = decode_char_array(ca["v"])
    return {
        "type": "image",
        "src": "",  # filled in later by update_image_srcs
        "alt": caption or "Screenshot",
        "caption": caption,
        "size": "large" if w > 900 else "medium",
        "_orig_src": src,
    }


def _conv_video():
    return {
        "type": "callout",
        "variant": "info",
        "text": "_TODO: This section originally included a video demonstration. "
                "Consider adding screenshots or additional step-by-step detail.",
    }


def _conv_list_item(raw):
    return {
        "_type": "list_item",
        "text": decode_char_array(raw.get("c", [])),
        "plain": text_content(raw.get("c", [])),
        "listType": raw.get("lT", "ol"),
        "counterReset": raw.get("cR"),
        "indent": (raw.get("ds") or {}).get("it", 0),
    }


def _conv_quiz(raw):
    questions = []
    for _q_id, q in iter_ordered_map(raw.get("dt", {}).get("q", {})):
        # Question text
        q_parts = []
        for _, db in iter_ordered_map(q.get("d", {}).get("b", {})):
            q_parts.append(decode_char_array(db.get("c", [])))
        q_text = " ".join(q_parts).strip()

        # Options
        options = []
        correct = 0
        for idx, (_, opt) in enumerate(iter_ordered_map(q.get("c", {}))):
            opt_parts = []
            for _, ob in iter_ordered_map(opt.get("t", {}).get("b", {})):
                opt_parts.append(decode_char_array(ob.get("c", [])))
            options.append(" ".join(opt_parts).strip())
            if opt.get("c") is True:
                correct = idx

        # Feedback
        rationale_parts = []
        for key in ("c", "i"):
            fb = q.get("f", {}).get(key, {}).get("b", {})
            for _, fb_blk in iter_ordered_map(fb):
                rationale_parts.append(decode_char_array(fb_blk.get("c", [])))
        rationale = " ".join(rationale_parts).strip()

        questions.append({
            "question": q_text,
            "options": options,
            "answerIndex": correct,
            "rationale": rationale or "_TODO: Add rationale.",
        })
    return questions


# ---------------------------------------------------------------------------
# Block normalization (handles iSpring quirks across chapters)
# ---------------------------------------------------------------------------

# Section labels that are decorative, not real content
_LABEL_WORDS = {"description", "summary", "overview", "tutorial tasks", "video"}


def normalize_blocks(blocks):
    """Post-process converted blocks to handle cross-chapter inconsistencies.

    - Removes decorative headings/labels (Tutorial Tasks, Video, etc.)
    - Converts 'Task N:' paragraphs to h3 headings
    - Converts numbered paragraphs ('1. ...') to list items
    - Merges 'Caption:'/'Alt Text:' paragraphs into preceding image blocks
    - Treats short text after images as informal captions
    """
    result = []
    for b in blocks:
        # --- Headings: strip decorative section headers ---
        if b.get("type") == "heading":
            heading_text = strip_html(b.get("text", "")).strip().lower()
            if heading_text in ("tutorial tasks", "video"):
                continue
            result.append(b)
            continue

        # --- Paragraphs: detect special patterns ---
        if b.get("type") == "paragraph":
            plain = strip_html(b.get("text", "")).strip()
            plain_lower = plain.lower()

            # Skip empty
            if not plain:
                continue

            # Skip section label paragraphs
            if plain_lower in _LABEL_WORDS:
                continue

            # Skip markdown annotations like ">[!Note]" and placeholders
            if plain.startswith(">[!") or plain.startswith(">["):
                continue
            if plain.startswith("<<") and plain.endswith(">>"):
                continue

            # "Caption: ..." → update preceding image
            if plain_lower.startswith("caption:"):
                caption = plain[len("Caption:"):].strip()
                for j in range(len(result) - 1, -1, -1):
                    if result[j].get("type") == "image":
                        result[j]["caption"] = caption
                        break
                continue

            # "Alt Text: ..." → update preceding image
            if plain_lower.startswith("alt text:"):
                alt = plain[len("Alt Text:"):].strip()
                for j in range(len(result) - 1, -1, -1):
                    if result[j].get("type") == "image":
                        result[j]["alt"] = alt
                        break
                continue

            # "Task N: Title" paragraphs → h3 heading
            if re.match(r"^Task\s+\d+\s*:", plain):
                result.append({
                    "type": "heading", "level": 3, "text": plain,
                })
                continue

            # Numbered step paragraphs ("1. ...", "2. ...") → list items
            m = re.match(r"^(\d+)\.\s+(.+)", plain)
            if m:
                # Strip number prefix from HTML text too
                html_text = re.sub(r"^\d+\.\s+", "", b["text"])
                result.append({
                    "_type": "list_item",
                    "text": html_text,
                    "plain": m.group(2),
                    "listType": "ol",
                    "counterReset": 1 if m.group(1) == "1" else None,
                    "indent": 0,
                })
                continue

            # Short text after an image → treat as informal caption
            if (len(plain) < 60 and not plain.endswith(".")
                    and result and result[-1].get("type") == "image"):
                result[-1]["alt"] = plain
                if not result[-1].get("caption"):
                    result[-1]["caption"] = plain
                continue

            result.append(b)
            continue

        # --- All other block types pass through ---
        result.append(b)

    return result


# ---------------------------------------------------------------------------
# Topic splitting
# ---------------------------------------------------------------------------

def find_task_boundaries(blocks):
    """Return indices where exercise tasks begin.

    After normalization, all task boundaries are h3 headings with 'Task'.
    Falls back to cR=1 list items only if no task headings found.
    """
    # Primary: h3/h4 headings containing "task"
    h3_tasks = []
    for i, b in enumerate(blocks):
        if (b.get("type") == "heading"
                and b.get("level") in (3, 4)
                and re.search(r"\btask\b", b.get("text", ""), re.I)):
            h3_tasks.append(i)
    if h3_tasks:
        return h3_tasks

    # Fallback: ordered list restarts (cR=1) with minimum spacing
    boundaries = []
    for i, b in enumerate(blocks):
        if (b.get("_type") == "list_item"
                and b.get("listType") == "ol"
                and b.get("counterReset") == 1):
            if not boundaries or i - boundaries[-1] > 3:
                boundaries.append(i)
    return boundaries


def split_concept_zone(blocks, module_idx):
    """Split concept blocks into 1+ concept topics by h2 headings."""
    platform_blocks = [b for b in blocks if b.get("type")]
    if not platform_blocks:
        return []

    # Split on h2 headings
    groups = []
    current = []
    for b in platform_blocks:
        if b.get("type") == "heading" and b.get("level") == 2 and current:
            groups.append(current)
            current = [b]
        else:
            current.append(b)
    if current:
        groups.append(current)

    # If first group is tiny (1-2 blocks), merge with second
    if len(groups) > 1 and len(groups[0]) <= 2:
        groups[1] = groups[0] + groups[1]
        groups = groups[1:]

    topics = []
    for t_idx, grp in enumerate(groups):
        # Derive title from first heading, else from first paragraph
        title = None
        for b in grp:
            if b.get("type") == "heading":
                title = strip_html(b.get("text", ""))
                break
        if not title:
            for b in grp:
                if b.get("type") == "paragraph":
                    raw = strip_html(b.get("text", ""))
                    title = raw[:60] + ("..." if len(raw) > 60 else "")
                    break
        if not title:
            title = "Overview"

        # Add placeholder for interactive element
        grp.append({
            "type": "callout",
            "variant": "info",
            "text": "_TODO: Add an interactive element (interactive-match or "
                    "interactive-sort) to reinforce this topic's concepts.",
        })

        topics.append({
            "id": f"m{module_idx}t{t_idx + 1}",
            "title": title,
            "estimatedMinutes": max(5, len(grp) * 2),
            "content": grp,
            "keyTakeaways": [
                "_TODO: Add 3-4 key takeaways for this topic.",
            ],
        })
    return topics


def build_exercise_topic(task_blocks, module_idx, topic_num, exercise_num):
    """Build an exercise topic from task heading + list items + images."""
    # Extract title from heading
    title = None
    for b in task_blocks:
        if b.get("type") == "heading":
            title = strip_html(b.get("text", ""))
            break
    if not title:
        title = f"Exercise {exercise_num}"

    # Strip "Task N:" prefix for clean title
    task_title = re.sub(r"^Task\s+\d+[.:]\s*", "", title, flags=re.I).strip()
    topic_title = f"Exercise \u2014 {task_title}"

    # Build steps from ordered list items (both native li and normalized)
    steps = []
    for b in task_blocks:
        if b.get("_type") == "list_item" and b.get("listType") == "ol":
            steps.append({
                "action": b["text"],
                "detail": "",
                "hint": None,
            })

    # Build content blocks
    content_blocks = []
    if task_title:
        content_blocks.append({
            "type": "paragraph",
            "text": f"In this exercise you will "
                    f"{task_title[0].lower()}{task_title[1:]}.",
        })
    else:
        content_blocks.append({
            "type": "paragraph",
            "text": "Complete this exercise.",
        })

    # Include any images or callouts from the task section
    for b in task_blocks:
        if b.get("type") in ("image", "callout"):
            content_blocks.append(b)

    # Exercise block
    ex_id = f"ex{exercise_num}"
    content_blocks.append({
        "type": "exercise",
        "exerciseId": ex_id,
        "title": task_title,
        "objective": f"Complete the {task_title.lower()} procedure.",
        "tasks": [{
            "id": f"{ex_id}-t1",
            "title": task_title,
            "steps": steps if steps else [{
                "action": "_TODO: Add step-by-step instructions.",
                "detail": "",
                "hint": None,
            }],
        }],
    })

    return {
        "id": f"m{module_idx}t{topic_num}",
        "title": topic_title,
        "estimatedMinutes": max(5, 3 + len(steps) * 2),
        "isExercise": True,
        "content": content_blocks,
        "keyTakeaways": [
            "_TODO: Add 3-4 key takeaways for this exercise.",
        ],
    }


def chapter_to_topics(blocks, module_idx, exercise_counter):
    """Split chapter blocks into concept + exercise topics.

    Returns (topics_list, num_exercises, exerciseTopicStart_or_None).
    """
    blocks = normalize_blocks(blocks)
    task_boundaries = find_task_boundaries(blocks)
    concept_end = task_boundaries[0] if task_boundaries else len(blocks)

    # Concept topics
    concept_topics = split_concept_zone(blocks[:concept_end], module_idx)

    # Exercise topics
    exercise_topics = []
    for t_idx, start in enumerate(task_boundaries):
        end = (task_boundaries[t_idx + 1]
               if t_idx + 1 < len(task_boundaries)
               else len(blocks))
        ex_num = exercise_counter + t_idx + 1
        topic_num = len(concept_topics) + t_idx + 1
        exercise_topics.append(
            build_exercise_topic(blocks[start:end], module_idx,
                                 topic_num, ex_num)
        )

    all_topics = concept_topics + exercise_topics
    ex_start = len(concept_topics) + 1 if exercise_topics else None
    return all_topics, len(exercise_topics), ex_start


# ---------------------------------------------------------------------------
# Image extraction & renaming
# ---------------------------------------------------------------------------

def plan_image_names(image_refs, chapters):
    """Create descriptive filenames for extracted images."""
    # Map original src -> (module_idx, nearby_heading) for context
    src_context = {}
    for ch_idx, ch in enumerate(chapters):
        last_heading = ch["title"]
        for b in ch["blocks"]:
            if b.get("t") == "p" and b.get("v") in ("h2", "h3"):
                last_heading = text_content(b.get("c", []))
            if b.get("t") == "c":
                for img in b.get("is", []):
                    s = img.get("s", "")
                    if s:
                        src_context[s] = (ch_idx + 1, last_heading)

    name_map = {}
    used = set()
    for idx, src in enumerate(image_refs):
        ext = os.path.splitext(src)[1] or ".png"
        ctx = src_context.get(src)
        if ctx:
            m_idx, heading = ctx
            slug = slugify(heading)[:30]
            base = f"m{m_idx}-{slug}"
        else:
            base = f"image-{idx + 1}"
        # Ensure uniqueness
        name = f"{base}{ext}"
        counter = 2
        while name in used:
            name = f"{base}-{counter}{ext}"
            counter += 1
        used.add(name)
        name_map[src] = name

    return name_map


def extract_images(zf, image_refs, name_map, output_dir):
    """Extract images from ZIP, rename, and write to output_dir."""
    os.makedirs(output_dir, exist_ok=True)
    extracted = 0
    seen = set()
    for src in image_refs:
        if src in seen:
            continue
        seen.add(src)
        zip_path = f"res/{src}"
        new_name = name_map.get(src, os.path.basename(src))
        try:
            img_data = zf.read(zip_path)
            out_path = os.path.join(output_dir, new_name)
            with open(out_path, "wb") as f:
                f.write(img_data)
            extracted += 1
        except KeyError:
            print(f"  WARNING: Image not found in ZIP: {zip_path}")
    return extracted


def update_image_srcs(topics, name_map):
    """Replace _orig_src with final images/ path in all content blocks."""
    for topic in topics:
        for block in topic.get("content", []):
            if block.get("type") == "image" and "_orig_src" in block:
                orig = block.pop("_orig_src")
                block["src"] = f"images/{name_map.get(orig, os.path.basename(orig))}"


# ---------------------------------------------------------------------------
# Output generation
# ---------------------------------------------------------------------------

def format_course_title(manifest_title, family):
    """Format course title with product family prefix."""
    family_names = {
        "windchill": "Windchill",
        "codebeamer": "Codebeamer",
        "creo": "Creo",
    }
    prefix = family_names.get(family, family.title())
    cleaned = re.sub(rf"^{re.escape(prefix)}\s*:?\s*", "",
                     manifest_title, flags=re.I)
    return f"{prefix}: {cleaned}" if cleaned else manifest_title


def generate_course_json(course_id, title, modules_meta):
    return {
        "id": course_id,
        "title": title,
        "description": "_TODO: Add course description.",
        "prerequisite": None,
        "modules": modules_meta,
    }


def generate_module_json(module_id, title, topics):
    return {
        "id": module_id,
        "title": title,
        "description": f"_TODO: Add description for {title}.",
        "topics": topics,
    }


def generate_quiz_json(module_id, module_title, questions, concept_topic_ids):
    """Build quiz JSON. Pad with _TODO placeholders to reach 4 questions."""
    quiz_questions = []
    for i, q in enumerate(questions):
        qid = f"{module_id}-kc-{i + 1:03d}"
        opts = q["options"]
        # Pad to 4 options if needed
        while len(opts) < 4:
            opts.append("_TODO: Add option")
        quiz_questions.append({
            "id": qid,
            "question": q["question"],
            "options": opts[:4],
            "answerIndex": q["answerIndex"],
            "rationale": q["rationale"],
            "topic": concept_topic_ids[0] if concept_topic_ids
                     else f"{module_id}t1",
        })

    # Pad to 4 questions
    while len(quiz_questions) < 4:
        n = len(quiz_questions) + 1
        quiz_questions.append({
            "id": f"{module_id}-kc-{n:03d}",
            "question": f"_TODO: Add question {n} for {module_title}.",
            "options": ["_TODO: Option A", "_TODO: Option B",
                        "_TODO: Option C", "_TODO: Option D"],
            "answerIndex": 0,
            "rationale": "_TODO: Add rationale.",
            "topic": concept_topic_ids[0] if concept_topic_ids
                     else f"{module_id}t1",
        })

    return {
        "moduleId": module_id,
        "title": f"{module_title} Knowledge Check",
        "questions": quiz_questions,
    }


def generate_glossary_json(all_topics):
    """Build glossary skeleton from bold terms found in content."""
    bold_terms = set()
    for topic in all_topics:
        for block in topic.get("content", []):
            text = block.get("text", "")
            for match in re.finditer(r"<strong>([^<]+)</strong>", text):
                term = match.group(1).strip()
                if 2 < len(term) < 60:
                    bold_terms.add(term)
            # Also scan exercise steps
            if block.get("type") == "exercise":
                for task in block.get("tasks", []):
                    for step in task.get("steps", []):
                        for field in ("action", "detail"):
                            val = step.get(field, "") or ""
                            for m in re.finditer(
                                    r"<strong>([^<]+)</strong>", val):
                                term = m.group(1).strip()
                                if 2 < len(term) < 60:
                                    bold_terms.add(term)

    terms = sorted(bold_terms, key=str.lower)
    if not terms:
        terms_list = [{"term": "_TODO", "definition": "_TODO: Add terms."}]
    else:
        terms_list = [{"term": t, "definition": f"_TODO: Define {t}."}
                      for t in terms]
    return {"terms": terms_list}


def write_json(path, data):
    """Write JSON with pretty formatting."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


# ---------------------------------------------------------------------------
# Catalog registration (--register)
# ---------------------------------------------------------------------------

def _build_catalog_entry(course_id, title, description, num_modules,
                         estimated_hours):
    """Build a catalog entry dict for both catalog.json and catalog-bundle."""
    # Catalog titles omit the product family prefix
    short_title = re.sub(
        r"^(Windchill|Codebeamer|Creo)\s*:\s*", "", title
    )
    # Clean up _TODO description
    if description.startswith("_TODO"):
        description = short_title
    return {
        "id": course_id,
        "title": short_title,
        "description": description,
        "modules": num_modules,
        "estimatedHours": estimated_hours,
        "locales": ["en"],
        "comingSoon": False,
    }


def _insert_into_catalog(catalog, family, entry):
    """Insert entry into the correct family's courses list. Returns True."""
    for fam in catalog.get("families", []):
        if fam["id"] == family:
            if any(c["id"] == entry["id"] for c in fam["courses"]):
                return False  # already present
            fam["courses"].append(entry)
            return True
    return False


def register_course(course_id, title, description, family, num_modules,
                    total_minutes):
    """Add course to catalog.json and catalog-bundle.js, run build-bundles."""
    estimated_hours = max(1, math.ceil(total_minutes / 60))
    entry = _build_catalog_entry(course_id, title, description,
                                 num_modules, estimated_hours)

    print("\nRegistering course in catalog...")

    # --- catalog.json ---
    catalog_path = os.path.join(DOCS_DIR, "catalog.json")
    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    if _insert_into_catalog(catalog, family, entry):
        with open(catalog_path, "w", encoding="utf-8") as f:
            json.dump(catalog, f, indent=1, ensure_ascii=False)
            f.write("\n")
        print(f"  catalog.json -- added {course_id} to {family}")
    else:
        print(f"  catalog.json -- {course_id} already present, skipped")

    # --- catalog-bundle.js ---
    bundle_path = os.path.join(DOCS_DIR, "js", "catalog-bundle.js")
    with open(bundle_path, "r", encoding="utf-8") as f:
        bundle_text = f.read()

    marker = "OB._catalogBundle = "
    marker_pos = bundle_text.index(marker) + len(marker)

    # Parse the embedded JSON object using raw_decode
    decoder = json.JSONDecoder()
    bundle_catalog, json_end = decoder.raw_decode(bundle_text, marker_pos)

    if _insert_into_catalog(bundle_catalog, family, entry):
        new_json = json.dumps(bundle_catalog, indent=1, ensure_ascii=False)
        bundle_text = (bundle_text[:marker_pos]
                       + new_json
                       + bundle_text[json_end:])
        with open(bundle_path, "w", encoding="utf-8") as f:
            f.write(bundle_text)
        print(f"  catalog-bundle.js -- added {course_id} to {family}")
    else:
        print(f"  catalog-bundle.js -- {course_id} already present, skipped")

    # --- build-bundles.py ---
    print("  Running build-bundles.py...")
    result = subprocess.run(
        [sys.executable, os.path.join(DOCS_DIR, "build-bundles.py")],
        cwd=DOCS_DIR, capture_output=True, text=True,
    )
    if result.returncode == 0:
        # Show just the line for this course
        for line in result.stdout.splitlines():
            if course_id in line or line.startswith("["):
                pass  # skip per-course headers
            if line.startswith("Done"):
                print(f"  {line}")
    else:
        print(f"  WARNING: build-bundles.py failed:\n{result.stderr}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Import iSpring SCORM 1.2 package into the onboarding "
                    "platform"
    )
    parser.add_argument("--zip", required=True,
                        help="Path to SCORM ZIP file")
    parser.add_argument("--course-id", required=True,
                        help="Course ID (e.g. wcba-uag)")
    parser.add_argument("--family", required=True,
                        help="Product family (windchill, codebeamer, creo)")
    parser.add_argument("--output", default=None,
                        help="Output dir (default: courses/<course-id>)")
    parser.add_argument("--register", action="store_true",
                        help="Auto-update catalog.json, catalog-bundle.js, "
                             "and run build-bundles.py")
    args = parser.parse_args()

    zip_path = os.path.abspath(args.zip)
    course_id = args.course_id
    output_dir = args.output or os.path.join(COURSES_DIR, course_id)

    print(f"Importing SCORM package: {os.path.basename(zip_path)}")
    print(f"Course ID: {course_id}")
    print(f"Output: {output_dir}")
    print()

    # 1. Open and validate
    zf, data_path = open_scorm_zip(zip_path)
    manifest_title = parse_manifest(zf)
    data = load_ispring_data(zf, data_path)
    print(f"Course title: {manifest_title}")

    # 2. Extract chapters
    chapters = extract_chapters(data)
    print(f"Chapters found: {len(chapters)}")
    for i, ch in enumerate(chapters):
        print(f"  {i + 1}. {ch['title']} ({len(ch['blocks'])} blocks)")
    print()

    # 3. Process each chapter into a module
    modules_meta = []
    all_module_data = []  # (content_file_path, module_json)
    all_quiz_data = []    # (quiz_file_path, quiz_json)
    all_image_refs = []
    all_topics_flat = []
    exercise_counter = 0
    total_quiz_extracted = 0

    for ch_idx, chapter in enumerate(chapters):
        m_idx = ch_idx + 1
        m_id = f"m{m_idx}"
        ch_slug = slugify(chapter["title"])

        # Convert blocks
        blocks, quiz_qs, img_refs = convert_blocks(chapter["blocks"])
        all_image_refs.extend(img_refs)
        total_quiz_extracted += len(quiz_qs)

        # Split into topics
        topics, num_exercises, ex_start = chapter_to_topics(
            blocks, m_idx, exercise_counter
        )
        exercise_counter += num_exercises
        all_topics_flat.extend(topics)

        # Module metadata
        total_minutes = sum(t.get("estimatedMinutes", 5) for t in topics)
        meta = {
            "id": m_id,
            "title": chapter["title"],
            "description": f"_TODO: Add description for {chapter['title']}.",
            "estimatedMinutes": total_minutes,
            "topicCount": len(topics),
            "contentFile": f"modules/{m_id}-{ch_slug}.json",
            "quizFile": f"quizzes/q{m_idx}-{ch_slug}.json",
        }
        if ex_start:
            meta["exerciseTopicStart"] = ex_start
        modules_meta.append(meta)

        # Module content JSON
        mod_json = generate_module_json(m_id, chapter["title"], topics)
        all_module_data.append((meta["contentFile"], mod_json))

        # Quiz JSON
        concept_ids = [t["id"] for t in topics if not t.get("isExercise")]
        quiz_json = generate_quiz_json(m_id, chapter["title"],
                                       quiz_qs, concept_ids)
        all_quiz_data.append((meta["quizFile"], quiz_json))

        print(f"Module {m_idx}: {chapter['title']}")
        print(f"  Topics: {len(topics)} "
              f"({len(topics) - num_exercises} concept, "
              f"{num_exercises} exercise)")
        print(f"  Quiz Qs: {len(quiz_qs)} extracted + "
              f"{max(0, 4 - len(quiz_qs))} _TODO")

    print()

    # 4. Extract and rename images
    name_map = plan_image_names(all_image_refs, chapters)
    images_dir = os.path.join(output_dir, "images")
    extracted = extract_images(zf, all_image_refs, name_map, images_dir)
    print(f"Images extracted: {extracted}")

    # Update image src paths in all topics
    for _, mod_json in all_module_data:
        update_image_srcs(mod_json["topics"], name_map)

    # 5. Generate course.json
    title = format_course_title(manifest_title, args.family)
    course_json = generate_course_json(course_id, title, modules_meta)

    # 6. Generate glossary
    glossary_json = generate_glossary_json(all_topics_flat)

    # 7. Write all files
    print(f"\nWriting course files to {output_dir}/")

    write_json(os.path.join(output_dir, "course.json"), course_json)
    print("  course.json")

    write_json(os.path.join(output_dir, "glossary.json"), glossary_json)
    print(f"  glossary.json ({len(glossary_json['terms'])} terms)")

    for content_file, mod_data in all_module_data:
        write_json(os.path.join(output_dir, content_file), mod_data)
        print(f"  {content_file}")

    for quiz_file, quiz_data in all_quiz_data:
        write_json(os.path.join(output_dir, quiz_file), quiz_data)
        print(f"  {quiz_file}")

    bundles_dir = os.path.join(output_dir, "bundles")
    os.makedirs(bundles_dir, exist_ok=True)
    print("  bundles/ (empty)")

    zf.close()

    # 8. Register in catalog if requested
    if args.register:
        total_minutes = sum(m.get("estimatedMinutes", 0)
                            for m in modules_meta)
        register_course(course_id, title, course_json["description"],
                        args.family, len(chapters), total_minutes)

    # 9. Count _TODOs across all output
    all_json_str = json.dumps(course_json) + json.dumps(glossary_json)
    for _, md in all_module_data:
        all_json_str += json.dumps(md)
    for _, qd in all_quiz_data:
        all_json_str += json.dumps(qd)
    todo_count = all_json_str.count("_TODO")

    # 10. Report
    print(f"\n{'=' * 60}")
    print("IMPORT COMPLETE")
    print(f"{'=' * 60}")
    print(f"Course: {course_id}")
    print(f"Modules: {len(chapters)}")
    print(f"Topics: {len(all_topics_flat)}")
    print(f"Images: {extracted}")
    print(f"Quiz Qs extracted: {total_quiz_extracted}")
    print(f"_TODO markers: {todo_count}")
    if args.register:
        print(f"Catalog: registered in {args.family}")
        print(f"Bundle: generated")
    print()
    print("Action items:")
    n = 1
    print(f"  {n}. Review generated JSON -- search for _TODO markers"); n += 1
    print(f"  {n}. Add interactive elements to concept topics "
          f"(match, sort, reveal-cards)"); n += 1
    print(f"  {n}. Complete quiz questions "
          f"(need ~{4 * len(chapters) - total_quiz_extracted} more)"); n += 1
    print(f"  {n}. Review and complete glossary definitions"); n += 1
    if not args.register:
        print(f"  {n}. Update docs/catalog.json AND "
              f"docs/js/catalog-bundle.js"); n += 1
        print(f"  {n}. Run: cd docs && python build-bundles.py"); n += 1
    print(f"  {n}. Validate: python -m json.tool < "
          f"courses/{course_id}/course.json")


if __name__ == "__main__":
    main()
