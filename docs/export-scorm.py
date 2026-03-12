"""
Export full modules as SCORM 1.2 packages for LMS upload.

Generates a self-contained HTML SPA with sidebar navigation, all topic content
(paragraphs, tables, callouts, reveal cards, match/sort interactives, exercises,
images), and the module quiz. SCORM tracks topic completion + quiz score.

Usage:
  cd docs && python export-scorm.py --course wc-ocp1 --module m1 --output ../dist/scorm/
  cd docs && python export-scorm.py --course wc-ocp1 --output ../dist/scorm/   # all modules
"""

import argparse
import html
import json
import os
import sys
import zipfile

DOCS_DIR = os.path.dirname(os.path.abspath(__file__))
COURSES_DIR = os.path.join(DOCS_DIR, "courses")


def load_course(course_id):
    """Load course.json for a given course."""
    path = os.path.join(COURSES_DIR, course_id, "course.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_quiz(course_id, quiz_file):
    """Load a quiz JSON file for a given course."""
    path = os.path.join(COURSES_DIR, course_id, quiz_file)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_module(course_id, content_file):
    """Load module JSON (topics + content blocks)."""
    path = os.path.join(COURSES_DIR, course_id, content_file)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def collect_images(course_id, module_data):
    """Scan image blocks in module, return (relative_src, abs_path) tuples."""
    images = []
    seen = set()
    for topic in module_data.get("topics", []):
        for block in topic.get("content", []):
            if block.get("type") == "image" and block.get("src"):
                src = block["src"]
                if src not in seen:
                    seen.add(src)
                    abs_path = os.path.join(COURSES_DIR, course_id, src)
                    images.append((src, abs_path))
    return images


def generate_manifest(course_title, module_title, sco_id, passing_score, image_files):
    """Generate imsmanifest.xml content."""
    title_full = f"{course_title} - {module_title}"

    file_entries = '      <file href="index.html"/>\n'
    for img_src, _ in image_files:
        file_entries += f'      <file href="{html.escape(img_src)}"/>\n'

    return f"""\
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="{sco_id}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org-1">
    <organization identifier="org-1">
      <title>{html.escape(title_full)}</title>
      <item identifier="item-1" identifierref="res-1">
        <title>{html.escape(module_title)}</title>
        <adlcp:masteryscore>{passing_score}</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res-1" type="webcontent" adlcp:scormtype="sco" href="index.html">
{file_entries}    </resource>
  </resources>
</manifest>"""


def generate_full_html(module_data, quiz_data, course_title, module_title, module_meta, passing_score):
    """Generate the complete SPA with all content + quiz."""
    module_json = json.dumps(module_data, ensure_ascii=False)
    quiz_json = json.dumps(quiz_data, ensure_ascii=False)
    mod_id = module_meta.get("id", "m1")
    mod_idx = mod_id.replace("m", "")
    exercise_topic_start = module_meta.get("exerciseTopicStart", 999)
    title = f"{course_title} — {module_title}"

    return f"""\
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{html.escape(title)}</title>
<style>
/* === Theme variables === */
[data-theme="dark"] {{
  --c-bg-base: #0f172a;
  --c-bg-surface: #1e293b;
  --c-bg-surface-hover: #1a2744;
  --c-bg-surface-active: #253347;
  --c-border: #334155;
  --c-border-hover: #475569;
  --c-text-primary: #f1f5f9;
  --c-text: #e2e8f0;
  --c-text-secondary: #cbd5e1;
  --c-text-muted: #94a3b8;
  --c-text-dim: #64748b;
  --c-accent: #22c55e;
  --c-accent-hover: #16a34a;
  --c-on-accent: #0f172a;
  --c-danger: #ef4444;
  --c-warning: #f59e0b;
  --c-warning-light: #fcd34d;
  --c-info: #3b82f6;
  --c-info-light: #60a5fa;
  --c-info-lighter: #93c5fd;
  --c-ref-purple: #c084fc;
  --c-accent-004: rgba(34,197,94,0.04);
  --c-accent-006: rgba(34,197,94,0.06);
  --c-accent-008: rgba(34,197,94,0.08);
  --c-accent-020: rgba(34,197,94,0.2);
  --c-accent-030: rgba(34,197,94,0.3);
  --c-danger-008: rgba(239,68,68,0.08);
  --c-warning-008: rgba(245,158,11,0.08);
  --c-warning-020: rgba(245,158,11,0.2);
  --c-info-004: rgba(59,130,246,0.04);
  --c-info-006: rgba(59,130,246,0.06);
  --c-info-008: rgba(59,130,246,0.08);
  --c-info-020: rgba(59,130,246,0.2);
  --c-purple-008: rgba(192,132,252,0.08);
  --c-purple-020: rgba(192,132,252,0.2);
  --c-neutral-004: rgba(148,163,184,0.04);
}}
[data-theme="light"] {{
  --c-bg-base: #f8fafc;
  --c-bg-surface: #ffffff;
  --c-bg-surface-hover: #f1f5f9;
  --c-bg-surface-active: #e2e8f0;
  --c-border: #e2e8f0;
  --c-border-hover: #cbd5e1;
  --c-text-primary: #0f172a;
  --c-text: #1e293b;
  --c-text-secondary: #475569;
  --c-text-muted: #64748b;
  --c-text-dim: #94a3b8;
  --c-accent: #16a34a;
  --c-accent-hover: #15803d;
  --c-on-accent: #ffffff;
  --c-danger: #dc2626;
  --c-warning: #d97706;
  --c-warning-light: #b45309;
  --c-info: #2563eb;
  --c-info-light: #3b82f6;
  --c-info-lighter: #1d4ed8;
  --c-ref-purple: #9333ea;
  --c-accent-004: rgba(22,163,74,0.04);
  --c-accent-006: rgba(22,163,74,0.06);
  --c-accent-008: rgba(22,163,74,0.08);
  --c-accent-020: rgba(22,163,74,0.2);
  --c-accent-030: rgba(22,163,74,0.3);
  --c-danger-008: rgba(220,38,38,0.08);
  --c-warning-008: rgba(217,119,6,0.1);
  --c-warning-020: rgba(217,119,6,0.2);
  --c-info-004: rgba(37,99,235,0.06);
  --c-info-006: rgba(37,99,235,0.08);
  --c-info-008: rgba(37,99,235,0.1);
  --c-info-020: rgba(37,99,235,0.2);
  --c-purple-008: rgba(147,51,234,0.1);
  --c-purple-020: rgba(147,51,234,0.15);
  --c-neutral-004: rgba(100,116,139,0.06);
}}

/* === Base === */
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--c-bg-base);
  color: var(--c-text);
  line-height: 1.6;
  height: 100vh;
  overflow: hidden;
  display: flex;
}}
h1 {{ font-size: 22px; font-weight: 700; color: var(--c-text-primary); margin-bottom: 6px; }}
h2 {{ font-size: 18px; font-weight: 700; color: var(--c-text-primary); margin-bottom: 4px; }}
h3 {{ font-size: 15px; font-weight: 700; color: var(--c-text-primary); margin-bottom: 4px; }}
p {{ margin-bottom: 12px; font-size: 14px; line-height: 1.7; }}
a {{ color: var(--c-accent); text-decoration: none; }}
.text-muted {{ color: var(--c-text-muted); }}
.text-dim {{ color: var(--c-text-dim); }}
.text-sm {{ font-size: 12px; }}
.mt-lg {{ margin-top: 24px; }}
.mb-sm {{ margin-bottom: 8px; }}
.mb-md {{ margin-bottom: 16px; }}
.mb-lg {{ margin-bottom: 24px; }}

/* === Scrollbar === */
* {{ scrollbar-width: thin; scrollbar-color: var(--c-border) transparent; }}
::-webkit-scrollbar {{ width: 6px; }}
::-webkit-scrollbar-track {{ background: transparent; }}
::-webkit-scrollbar-thumb {{ background: var(--c-border); border-radius: 3px; }}

/* === Layout === */
.scorm-sidebar {{
  width: 260px; flex-shrink: 0;
  background: var(--c-bg-surface);
  border-right: 1px solid var(--c-border);
  display: flex; flex-direction: column;
  height: 100vh; overflow: hidden;
}}
.scorm-sidebar-header {{
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--c-border);
}}
.scorm-sidebar-header h3 {{
  font-size: 13px; font-weight: 700;
  color: var(--c-text-primary); margin: 0;
}}
.scorm-sidebar-header p {{
  font-size: 11px; color: var(--c-text-dim); margin: 4px 0 0;
}}
.scorm-sidebar-nav {{
  flex: 1; overflow-y: auto; padding: 8px 0;
}}
.scorm-topic-link {{
  display: flex; align-items: center; gap: 10px;
  padding: 8px 16px; cursor: pointer;
  font-size: 13px; color: var(--c-text-muted);
  transition: all 0.12s; border-left: 3px solid transparent;
}}
.scorm-topic-link:hover {{ background: var(--c-bg-surface-hover); color: var(--c-text); }}
.scorm-topic-link.active {{ background: var(--c-bg-surface-hover); color: var(--c-text-primary); border-left-color: var(--c-accent); font-weight: 600; }}
.scorm-topic-link.completed {{ color: var(--c-text-dim); }}
.scorm-topic-check {{
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid var(--c-border-hover);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; flex-shrink: 0; transition: all 0.15s;
}}
.scorm-topic-link.completed .scorm-topic-check {{
  background: var(--c-accent); border-color: var(--c-accent); color: var(--c-on-accent);
}}
.scorm-sidebar-section {{
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; color: var(--c-text-dim);
  padding: 12px 16px 4px;
}}
.scorm-main {{
  flex: 1; overflow-y: auto; padding: 32px 40px;
  max-width: 760px; height: 100vh;
}}

/* === Buttons === */
.btn {{
  padding: 10px 24px; border-radius: 6px; font-size: 13px;
  font-weight: 600; cursor: pointer; font-family: inherit;
  border: none; transition: all 0.15s; display: inline-flex;
  align-items: center; gap: 8px;
}}
.btn-primary {{ background: var(--c-accent); color: var(--c-on-accent); }}
.btn-primary:hover {{ background: var(--c-accent-hover); }}
.btn-outline {{
  background: transparent; border: 1px solid var(--c-border);
  color: var(--c-text-muted); padding: 9px 23px;
}}
.btn-outline:hover {{ border-color: var(--c-border-hover); color: var(--c-text); background: var(--c-bg-surface-active); }}
.btn-sm {{ padding: 6px 14px; font-size: 12px; }}
.nav-btns {{
  display: flex; justify-content: space-between;
  margin-top: 32px; padding-top: 20px;
  border-top: 1px solid var(--c-border);
}}

/* === Cards === */
.card {{
  background: var(--c-bg-surface); border: 1px solid var(--c-border);
  border-radius: 8px; padding: 16px; margin-bottom: 8px;
}}

/* === Callouts === */
.callout {{
  padding: 14px 16px; border-radius: 8px; margin-bottom: 16px;
  font-size: 13px; line-height: 1.6; display: flex; gap: 12px;
}}
.callout-icon {{ font-size: 16px; flex-shrink: 0; margin-top: 1px; }}
.callout-content {{ flex: 1; }}
.callout-content p {{ margin-bottom: 6px; }}
.callout-content p:last-child {{ margin-bottom: 0; }}
.callout.info {{ background: var(--c-info-008); border: 1px solid var(--c-info-020); color: var(--c-info-lighter); }}
.callout.tip {{ background: var(--c-accent-008); border: 1px solid var(--c-accent-020); color: var(--c-accent); }}
.callout.warning {{ background: var(--c-warning-008); border: 1px solid var(--c-warning-020); color: var(--c-warning-light); }}
.callout.insight {{ background: var(--c-purple-008); border: 1px solid var(--c-purple-020); color: var(--c-ref-purple); }}

/* === Tables === */
.data-table {{
  width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px;
}}
.data-table th {{
  text-align: left; padding: 10px 14px; background: var(--c-bg-surface-active);
  border: 1px solid var(--c-border); font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px; color: var(--c-text-muted);
}}
.data-table td {{
  padding: 10px 14px; border: 1px solid var(--c-border);
  color: var(--c-text-secondary); vertical-align: top;
}}
.data-table tbody tr:hover {{ background: var(--c-neutral-004); }}

/* === Topic content === */
.topic-header {{ margin-bottom: 24px; }}
.topic-content {{ margin-bottom: 24px; }}
.topic-content h2 {{ margin-top: 24px; margin-bottom: 12px; }}
.topic-content h3 {{ margin-top: 20px; margin-bottom: 8px; }}
.topic-content code {{
  font-family: "SF Mono", "Fira Code", "Consolas", monospace;
  font-size: 0.9em; background: var(--c-bg-surface-active);
  padding: 1px 5px; border-radius: 3px;
}}

/* === Takeaways === */
.takeaways-box {{
  padding: 16px 20px; background: var(--c-accent-006);
  border: 1px solid var(--c-accent-020); border-radius: 8px; margin: 24px 0;
}}
.takeaways-box h3 {{ color: var(--c-accent); font-size: 13px; margin-bottom: 8px; }}
.takeaways-box ul {{ list-style: none; padding: 0; }}
.takeaways-box li {{
  font-size: 13px; color: var(--c-text-secondary);
  padding: 4px 0 4px 20px; position: relative;
}}
.takeaways-box li::before {{ content: '\\2713'; position: absolute; left: 0; color: var(--c-accent); font-weight: 700; }}

/* === Mark complete === */
.mark-complete-bar {{
  display: flex; align-items: center; justify-content: center;
  padding: 16px; margin: 24px 0;
  border: 2px dashed var(--c-border); border-radius: 8px; transition: all 0.15s;
}}
.mark-complete-bar.completed {{
  border-color: var(--c-accent-030); background: var(--c-accent-006); border-style: solid;
}}

/* === Images === */
.image-block {{ margin: 16px 0; text-align: center; }}
.image-block img {{
  max-width: 100%; height: auto; border-radius: 8px;
  border: 1px solid var(--c-border);
}}
.image-block figcaption {{
  margin-top: 8px; font-size: 12px; color: var(--c-text-dim); font-style: italic;
}}
.image-block-medium img {{ max-width: 560px; }}
.image-block-small img {{ max-width: 360px; }}

/* === Reveal cards === */
.reveal-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 16px 0; }}
.reveal-card {{
  padding: 16px; background: var(--c-bg-surface);
  border: 1px solid var(--c-border); border-radius: 8px;
  cursor: pointer; transition: all 0.15s; min-height: 80px;
}}
.reveal-card:hover {{ border-color: var(--c-border-hover); }}
.reveal-card .reveal-front {{ font-size: 14px; font-weight: 600; color: var(--c-text-primary); }}
.reveal-card .reveal-hint {{ font-size: 11px; color: var(--c-text-dim); margin-top: 4px; }}
.reveal-card .reveal-back {{ display: none; font-size: 13px; color: var(--c-text-secondary); line-height: 1.5; }}
.reveal-card.flipped {{ background: var(--c-accent-004); border-color: var(--c-accent-020); }}
.reveal-card.flipped .reveal-front {{ color: var(--c-accent); font-size: 12px; margin-bottom: 6px; }}
.reveal-card.flipped .reveal-hint {{ display: none; }}
.reveal-card.flipped .reveal-back {{ display: block; }}

/* === Match === */
.match-container {{ margin: 16px 0; }}
.match-columns {{ display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }}
.match-column-label {{ font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--c-text-dim); margin-bottom: 8px; }}
.match-item {{
  padding: 10px 14px; background: var(--c-bg-surface);
  border: 2px solid var(--c-border); border-radius: 6px;
  margin-bottom: 6px; cursor: pointer; font-size: 13px;
  color: var(--c-text); transition: all 0.15s;
}}
.match-item:hover {{ border-color: var(--c-border-hover); }}
.match-item.selected {{ border-color: var(--c-accent); background: var(--c-accent-006); }}
.match-item.matched {{ border-color: var(--c-accent); background: var(--c-accent-008); opacity: 0.7; cursor: default; }}
.match-item.wrong {{ border-color: var(--c-danger); background: var(--c-danger-008); animation: shake 0.3s; }}
.match-feedback {{ font-size: 13px; margin-top: 8px; padding: 10px 14px; border-radius: 6px; }}
.match-feedback.success {{ background: var(--c-accent-008); color: var(--c-accent); border: 1px solid var(--c-accent-020); }}

@keyframes shake {{
  0%, 100% {{ transform: translateX(0); }}
  25% {{ transform: translateX(-4px); }}
  75% {{ transform: translateX(4px); }}
}}

/* === Sort === */
.sort-container {{ margin: 16px 0; }}
.sort-item {{
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; background: var(--c-bg-surface);
  border: 1px solid var(--c-border); border-radius: 6px;
  margin-bottom: 6px; cursor: grab; font-size: 13px;
  color: var(--c-text); transition: all 0.15s; user-select: none;
}}
.sort-item:active {{ cursor: grabbing; }}
.sort-item .sort-handle {{ color: var(--c-text-dim); font-size: 14px; }}
.sort-item .sort-num {{
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--c-border); display: flex; align-items: center;
  justify-content: center; font-size: 11px; font-weight: 700;
  color: var(--c-text-muted); flex-shrink: 0;
}}
.sort-item.correct .sort-num {{ background: var(--c-accent); color: var(--c-on-accent); }}
.sort-item.dragging {{ opacity: 0.5; border-color: var(--c-accent); }}
.sort-item.drag-over {{ border-color: var(--c-accent); background: var(--c-accent-004); }}

/* === Exercise === */
.exercise-objective {{
  padding: 16px 20px; background: var(--c-purple-008);
  border: 1px solid var(--c-purple-020); border-radius: 8px; margin-bottom: 20px;
}}
.exercise-objective-label {{
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; color: var(--c-ref-purple); margin-bottom: 4px;
}}
.exercise-objective p {{ font-size: 13px; color: var(--c-text-secondary); margin: 0; line-height: 1.5; }}
.exercise-progress {{ margin-bottom: 24px; }}
.exercise-progress-label {{ font-size: 12px; color: var(--c-text-dim); margin-bottom: 6px; }}
.exercise-progress-bar {{ height: 6px; background: var(--c-border); border-radius: 3px; overflow: hidden; }}
.exercise-progress-fill {{ height: 100%; background: var(--c-accent); border-radius: 3px; transition: width 0.3s ease; }}
.exercise-task {{ margin-bottom: 24px; border: 1px solid var(--c-border); border-radius: 8px; overflow: hidden; }}
.exercise-task-header {{
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px; background: var(--c-bg-surface);
  border-bottom: 1px solid var(--c-border); border-left: 3px solid var(--c-ref-purple);
}}
.exercise-task-header h3 {{ font-size: 14px; font-weight: 600; color: var(--c-text-primary); margin: 0; }}
.exercise-task-progress {{ font-size: 11px; color: var(--c-text-dim); white-space: nowrap; }}
.exercise-steps {{ padding: 16px 16px 8px 16px; }}
.exercise-step {{
  position: relative; padding-left: 32px; padding-bottom: 16px;
  border-left: 2px solid var(--c-border); margin-left: 9px; cursor: pointer;
}}
.exercise-step:last-child {{ border-left-color: transparent; }}
.exercise-step-indicator {{
  position: absolute; left: -10px; top: 0;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--c-bg-surface); border: 2px solid var(--c-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: var(--c-text-dim); transition: all 0.15s;
}}
.exercise-step.done .exercise-step-indicator {{ background: var(--c-accent); border-color: var(--c-accent); color: var(--c-on-accent); }}
.exercise-step.active .exercise-step-indicator {{ border-color: var(--c-ref-purple); color: var(--c-ref-purple); background: var(--c-purple-008); }}
.exercise-step-action-text {{ font-size: 13px; color: var(--c-text-muted); line-height: 1.4; }}
.exercise-step.done .exercise-step-action-text {{ color: var(--c-text-dim); }}
.exercise-step.active .exercise-step-action-text {{ color: var(--c-text); font-weight: 500; }}
.exercise-step-detail {{ display: none; margin-top: 10px; }}
.exercise-step.active .exercise-step-detail,
.exercise-step.expanded .exercise-step-detail {{ display: block; }}
.exercise-step-box {{
  padding: 10px 14px; border-radius: 6px; margin-bottom: 8px;
  font-size: 13px; line-height: 1.5;
}}
.exercise-step-box-label {{
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; margin-bottom: 4px;
}}
.exercise-step-box.detail-box {{ background: var(--c-info-004); border: 1px solid var(--c-info-020); }}
.exercise-step-box.detail-box .exercise-step-box-label {{ color: var(--c-info); }}
.exercise-step-box.detail-box p {{ margin: 0; color: var(--c-text-secondary); }}
.exercise-hint-toggle {{
  font-size: 12px; color: var(--c-text-dim); cursor: pointer;
  display: inline-flex; align-items: center; gap: 4px; padding: 4px 0; user-select: none;
}}
.exercise-hint-toggle:hover {{ color: var(--c-text-muted); }}
.exercise-hint-text {{
  display: none; font-size: 12px; color: var(--c-text-muted);
  padding: 8px 12px; background: var(--c-neutral-004);
  border-radius: 4px; margin-top: 4px; line-height: 1.5;
}}
.exercise-hint-text.expanded {{ display: block; }}
.exercise-step-actions {{ display: flex; gap: 8px; align-items: center; margin-top: 10px; }}

/* === Topic list items (overview) === */
.topic-list-item {{
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; background: var(--c-bg-surface);
  border: 1px solid var(--c-border); border-radius: 8px;
  margin-bottom: 8px; cursor: pointer; transition: all 0.15s;
}}
.topic-list-item:hover {{ border-color: var(--c-border-hover); background: var(--c-bg-surface-hover); }}
.topic-list-item .topic-check {{
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid var(--c-border-hover);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: var(--c-on-accent); flex-shrink: 0;
}}
.topic-list-item.completed .topic-check {{ background: var(--c-accent); border-color: var(--c-accent); }}
.topic-list-item .topic-info {{ flex: 1; }}
.topic-list-item .topic-title {{ font-size: 14px; font-weight: 600; color: var(--c-text); }}
.topic-list-item .topic-meta {{ font-size: 11px; color: var(--c-text-dim); margin-top: 2px; }}
.topic-list-item .topic-arrow {{ color: var(--c-text-dim); font-size: 14px; }}
.topic-list-item.exercise-item {{ border-left: 3px solid var(--c-ref-purple); }}
.exercise-icon {{ margin-right: 4px; }}

/* === Progress bar === */
.progress-inline {{
  display: flex; align-items: center; gap: 12px;
  padding: 16px; background: var(--c-bg-surface);
  border: 1px solid var(--c-border); border-radius: 8px;
}}
.progress-inline .progress-bar {{ flex: 1; height: 6px; background: var(--c-border); border-radius: 3px; overflow: hidden; }}
.progress-inline .progress-fill {{ height: 100%; background: linear-gradient(90deg, var(--c-accent), var(--c-accent-hover)); border-radius: 3px; transition: width 0.3s; }}
.progress-inline .progress-text {{ font-size: 13px; font-weight: 700; color: var(--c-accent); min-width: 45px; text-align: right; }}

/* === Quiz === */
.quiz-header {{ margin-bottom: 24px; text-align: center; }}
.quiz-progress-dots {{ display: flex; justify-content: center; gap: 6px; margin-top: 12px; }}
.quiz-dot {{ width: 10px; height: 10px; border-radius: 50%; background: var(--c-border); transition: all 0.2s; }}
.quiz-dot.current {{ background: var(--c-accent); transform: scale(1.2); }}
.quiz-dot.correct {{ background: var(--c-accent); }}
.quiz-dot.incorrect {{ background: var(--c-danger); }}
.quiz-question-card {{
  padding: 24px; background: var(--c-bg-surface);
  border: 1px solid var(--c-border); border-radius: 10px; margin-bottom: 16px;
}}
.quiz-question-text {{ font-size: 16px; font-weight: 600; color: var(--c-text-primary); margin-bottom: 20px; line-height: 1.5; }}
.quiz-option {{
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border: 1px solid var(--c-border);
  border-radius: 8px; margin-bottom: 8px; cursor: pointer;
  transition: all 0.15s; font-size: 14px; color: var(--c-text);
}}
.quiz-option:hover {{ border-color: var(--c-border-hover); background: var(--c-bg-surface-hover); }}
.quiz-option .option-letter {{
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--c-border); display: flex; align-items: center;
  justify-content: center; font-size: 12px; font-weight: 700;
  color: var(--c-text-muted); flex-shrink: 0; transition: all 0.15s;
}}
.quiz-option.correct {{ border-color: var(--c-accent); background: var(--c-accent-008); }}
.quiz-option.correct .option-letter {{ background: var(--c-accent); color: var(--c-on-accent); }}
.quiz-option.incorrect {{ border-color: var(--c-danger); background: var(--c-danger-008); }}
.quiz-option.incorrect .option-letter {{ background: var(--c-danger); color: #fff; }}
.quiz-option.disabled {{ pointer-events: none; opacity: 0.6; }}
.quiz-option.disabled.correct {{ opacity: 1; }}
.quiz-option.disabled.incorrect {{ opacity: 1; }}
.quiz-rationale {{
  padding: 14px 16px; background: var(--c-info-006);
  border: 1px solid var(--c-info-020); border-radius: 8px;
  margin-top: 12px; font-size: 13px; color: var(--c-text-secondary); line-height: 1.6;
}}
.quiz-results {{ text-align: center; padding: 32px 20px; }}
.quiz-score-ring {{ width: 100px; height: 100px; margin: 0 auto 16px; position: relative; }}
.quiz-score-ring svg {{ width: 100%; height: 100%; transform: rotate(-90deg); }}
.quiz-score-ring .ring-bg {{ fill: none; stroke: var(--c-border); stroke-width: 6; }}
.quiz-score-ring .ring-fill {{ fill: none; stroke: var(--c-accent); stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.5s ease; }}
.quiz-score-ring .ring-fill.low {{ stroke: var(--c-danger); }}
.quiz-score-text {{
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 22px; font-weight: 700; color: var(--c-text-primary);
}}

/* === Quiz card (overview) === */
.quiz-card {{
  margin-top: 20px; padding: 16px 20px;
  background: var(--c-bg-surface); border: 1px solid var(--c-border);
  border-radius: 8px; display: flex; align-items: center; gap: 16px;
  cursor: pointer; transition: all 0.15s;
}}
.quiz-card:hover {{ border-color: var(--c-accent-030); background: var(--c-bg-surface-hover); }}
.quiz-card .quiz-icon {{ font-size: 22px; }}
.quiz-card .quiz-info {{ flex: 1; }}
.quiz-card .quiz-title {{ font-size: 14px; font-weight: 600; color: var(--c-text); }}
.quiz-card .quiz-meta {{ font-size: 11px; color: var(--c-text-dim); margin-top: 2px; }}

/* === Module header (overview) === */
.module-header {{ margin-bottom: 24px; }}
.module-badge {{
  display: inline-block; padding: 3px 10px; border-radius: 4px;
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; margin-bottom: 8px;
  background: rgba(78,168,222,0.15); color: #4ea8de;
}}

/* === Theme toggle === */
.theme-toggle {{
  position: fixed; top: 12px; right: 16px; z-index: 10;
  background: var(--c-bg-surface); border: 1px solid var(--c-border);
  border-radius: 6px; padding: 6px 10px; cursor: pointer;
  font-size: 14px; color: var(--c-text-muted);
}}
.theme-toggle:hover {{ border-color: var(--c-border-hover); }}

/* === Misc === */
.scorm-warn {{
  text-align: center; padding: 8px; font-size: 12px;
  color: var(--c-text-muted); opacity: 0.6;
}}
@keyframes fadeInUp {{
  from {{ opacity: 0; transform: translateY(12px); }}
  to {{ opacity: 1; transform: translateY(0); }}
}}
.stagger > * {{ animation: fadeInUp 0.3s ease both; }}
.stagger > *:nth-child(1) {{ animation-delay: 0s; }}
.stagger > *:nth-child(2) {{ animation-delay: 0.05s; }}
.stagger > *:nth-child(3) {{ animation-delay: 0.1s; }}
.stagger > *:nth-child(4) {{ animation-delay: 0.15s; }}
.stagger > *:nth-child(5) {{ animation-delay: 0.2s; }}

/* === Responsive === */
@media (max-width: 768px) {{
  body {{ flex-direction: column; height: auto; overflow: auto; }}
  .scorm-sidebar {{ width: 100%; height: auto; max-height: 40vh; border-right: none; border-bottom: 1px solid var(--c-border); }}
  .scorm-main {{ padding: 20px 16px; height: auto; max-width: 100%; }}
  .reveal-grid {{ grid-template-columns: 1fr; }}
  .match-columns {{ grid-template-columns: 1fr; }}
}}
</style>
</head>
<body>
<div class="scorm-sidebar" id="sidebar"></div>
<div class="scorm-main" id="main"></div>
<button class="theme-toggle" id="theme-toggle" title="Toggle theme">&#9788;</button>
<script>
(function() {{
"use strict";

/* ============================================================
   Utilities
   ============================================================ */
function esc(str) {{
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}}

function safeHtml(str) {{
  if (str == null) return "";
  str = String(str);
  if (str.indexOf("<") === -1) return esc(str);
  var doc = new DOMParser().parseFromString(str, "text/html");
  return walkNodes(doc.body);
}}

function walkNodes(parent) {{
  var out = "";
  var child = parent.firstChild;
  while (child) {{
    if (child.nodeType === 3) {{
      out += esc(child.textContent);
    }} else if (child.nodeType === 1) {{
      var tag = child.nodeName.toLowerCase();
      if (tag === "b") tag = "strong";
      if (tag === "i") tag = "em";
      if (tag === "strong" || tag === "em" || tag === "code") {{
        out += "<" + tag + ">" + walkNodes(child) + "</" + tag + ">";
      }} else if (tag === "br") {{
        out += "<br>";
      }} else if (tag === "div" || tag === "p") {{
        var inner = walkNodes(child);
        if (inner && out) out += "<br>";
        out += inner;
      }} else {{
        out += walkNodes(child);
      }}
    }}
    child = child.nextSibling;
  }}
  return out;
}}

function shuffleArray(arr) {{
  for (var i = arr.length - 1; i > 0; i--) {{
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }}
  return arr;
}}

/* ============================================================
   Theme toggle
   ============================================================ */
(function() {{
  var html = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var saved = null;
  try {{ saved = localStorage.getItem("scorm_theme"); }} catch(e) {{}}
  if (saved === "light") html.setAttribute("data-theme", "light");
  btn.addEventListener("click", function() {{
    var cur = html.getAttribute("data-theme");
    var next = cur === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    try {{ localStorage.setItem("scorm_theme", next); }} catch(e) {{}}
  }});
}})();

/* ============================================================
   SCORM 1.2 API
   ============================================================ */
var SCORM = (function() {{
  var api = null;
  var initialized = false;
  var finished = false;

  function findAPI(win) {{
    var attempts = 0;
    while (win && !win.API && attempts < 10) {{
      if (win.parent && win.parent !== win) {{ win = win.parent; }}
      else if (win.opener) {{ win = win.opener; }}
      else {{ break; }}
      attempts++;
    }}
    return win && win.API ? win.API : null;
  }}

  function init() {{
    api = findAPI(window);
    if (!api) {{
      console.warn("SCORM API not found — running in standalone mode.");
      return false;
    }}
    var result = api.LMSInitialize("");
    initialized = (result === "true" || result === true);
    if (initialized) {{
      api.LMSSetValue("cmi.core.lesson_status", "incomplete");
      api.LMSCommit("");
    }}
    return initialized;
  }}

  function reportScore(raw, max, passed) {{
    if (!api || !initialized) return;
    api.LMSSetValue("cmi.core.score.raw", String(raw));
    api.LMSSetValue("cmi.core.score.min", "0");
    api.LMSSetValue("cmi.core.score.max", String(max));
    api.LMSSetValue("cmi.core.lesson_status", passed ? "passed" : "failed");
    api.LMSCommit("");
  }}

  function saveSuspendData(obj) {{
    if (!api || !initialized) return;
    try {{
      api.LMSSetValue("cmi.suspend_data", JSON.stringify(obj));
      api.LMSCommit("");
    }} catch(e) {{}}
  }}

  function loadSuspendData() {{
    if (!api || !initialized) return null;
    try {{
      var data = api.LMSGetValue("cmi.suspend_data");
      return data ? JSON.parse(data) : null;
    }} catch(e) {{ return null; }}
  }}

  function finish() {{
    if (!api || !initialized || finished) return;
    finished = true;
    api.LMSFinish("");
  }}

  return {{
    init: init,
    reportScore: reportScore,
    saveSuspendData: saveSuspendData,
    loadSuspendData: loadSuspendData,
    finish: finish,
    isAvailable: function() {{ return !!api && initialized; }}
  }};
}})();

/* ============================================================
   Embedded Data
   ============================================================ */
var MODULE_DATA = {module_json};
var QUIZ_DATA = {quiz_json};
var PASSING_SCORE = {passing_score};
var MOD_ID = "{mod_id}";
var MOD_IDX = "{mod_idx}";
var EXERCISE_TOPIC_START = {exercise_topic_start};

/* ============================================================
   State Manager (SCORM suspend_data with localStorage fallback)
   ============================================================ */
var State = (function() {{
  // State shape: {{ v: "#/overview", t: {{}}, e: {{}}, q: {{ i: 0, a: [] }}, r: null }}
  var state = {{ v: "#/overview", t: {{}}, e: {{}}, q: {{ i: 0, a: [] }}, r: null }};
  var storageKey = "scorm_state_" + MOD_ID;

  function load() {{
    var data = SCORM.loadSuspendData();
    if (data) {{ state = data; return; }}
    try {{
      var raw = localStorage.getItem(storageKey);
      if (raw) state = JSON.parse(raw);
    }} catch(e) {{}}
  }}

  function save() {{
    SCORM.saveSuspendData(state);
    try {{ localStorage.setItem(storageKey, JSON.stringify(state)); }} catch(e) {{}}
  }}

  function isTopicCompleted(topicId) {{ return !!state.t[topicId]; }}
  function completeTopic(topicId) {{ state.t[topicId] = 1; save(); }}
  function uncompleteTopic(topicId) {{ delete state.t[topicId]; save(); }}

  function isStepDone(exId, taskId, stepIdx) {{
    var key = exId + "-" + taskId + "-" + stepIdx;
    return !!(state.e[exId] && state.e[exId][key]);
  }}
  function completeStep(exId, taskId, stepIdx) {{
    if (!state.e[exId]) state.e[exId] = {{}};
    state.e[exId][exId + "-" + taskId + "-" + stepIdx] = 1;
    save();
  }}
  function getExerciseProgress(exId, tasks) {{
    var total = 0, done = 0;
    for (var ti = 0; ti < tasks.length; ti++) {{
      for (var si = 0; si < tasks[ti].steps.length; si++) {{
        total++;
        if (isStepDone(exId, tasks[ti].id, si)) done++;
      }}
    }}
    return {{ done: done, total: total }};
  }}

  function getCompletedTopicCount() {{
    var count = 0;
    for (var k in state.t) {{ if (state.t[k]) count++; }}
    return count;
  }}

  function getQuizState() {{ return state.q; }}
  function setQuizState(q) {{ state.q = q; save(); }}

  function getQuizResult() {{ return state.r; }}
  function setQuizResult(r) {{ state.r = r; save(); }}

  function getLastView() {{ return state.v || "#/overview"; }}
  function setLastView(v) {{ state.v = v; save(); }}

  return {{
    load: load, save: save,
    isTopicCompleted: isTopicCompleted, completeTopic: completeTopic, uncompleteTopic: uncompleteTopic,
    isStepDone: isStepDone, completeStep: completeStep, getExerciseProgress: getExerciseProgress,
    getCompletedTopicCount: getCompletedTopicCount,
    getQuizState: getQuizState, setQuizState: setQuizState,
    getQuizResult: getQuizResult, setQuizResult: setQuizResult,
    getLastView: getLastView, setLastView: setLastView
  }};
}})();

/* ============================================================
   Content Renderers
   ============================================================ */
function renderBlock(block, idx) {{
  switch (block.type) {{
    case "heading":
      var tag = block.level === 3 ? "h3" : "h2";
      return "<" + tag + ">" + safeHtml(block.text) + "</" + tag + ">";

    case "paragraph":
      return "<p>" + safeHtml(block.text) + "</p>";

    case "callout":
      var icon = {{ info: "&#8505;", tip: "&#9733;", warning: "&#9888;", insight: "&#128161;" }}[block.variant] || "&#8505;";
      return '<div class="callout ' + (block.variant || "info") + '">' +
        '<span class="callout-icon">' + icon + '</span>' +
        '<div class="callout-content"><p>' + safeHtml(block.text) + '</p></div></div>';

    case "comparison-table":
      var tbl = '<div style="overflow-x:auto"><table class="data-table"><thead><tr>';
      block.headers.forEach(function(h) {{ tbl += "<th>" + safeHtml(h) + "</th>"; }});
      tbl += "</tr></thead><tbody>";
      block.rows.forEach(function(row) {{
        tbl += "<tr>";
        row.forEach(function(cell) {{ tbl += "<td>" + safeHtml(cell) + "</td>"; }});
        tbl += "</tr>";
      }});
      tbl += "</tbody></table></div>";
      return tbl;

    case "reveal-cards":
      var rc = '<div class="reveal-grid">';
      block.cards.forEach(function(card, ci) {{
        rc += '<div class="reveal-card" data-reveal="' + ci + '">';
        rc += '<div class="reveal-front">' + safeHtml(card.front) + '</div>';
        rc += '<div class="reveal-hint">Click to reveal</div>';
        rc += '<div class="reveal-back">' + safeHtml(card.back) + '</div>';
        rc += '</div>';
      }});
      rc += '</div>';
      return rc;

    case "interactive-match":
      return renderMatchBlock(block, idx);

    case "interactive-sort":
      return renderSortBlock(block, idx);

    case "exercise":
      return renderExerciseBlock(block, idx);

    case "image":
      var sizeClass = block.size ? " image-block-" + block.size : "";
      var figHtml = '<figure class="image-block' + sizeClass + '">';
      figHtml += '<img src="' + esc(block.src) + '" alt="' + esc(block.alt || '') + '">';
      if (block.caption) figHtml += '<figcaption>' + safeHtml(block.caption) + '</figcaption>';
      figHtml += '</figure>';
      return figHtml;

    default:
      return "";
  }}
}}

function renderMatchBlock(block, idx) {{
  var html = '<div class="match-container" data-match="' + idx + '">';
  html += '<p style="font-size:13px;color:var(--c-text-muted);margin-bottom:12px">' + safeHtml(block.prompt) + '</p>';
  html += '<div class="match-columns">';
  html += '<div>';
  html += '<div class="match-column-label">Scenario</div>';
  block.pairs.forEach(function(p, i) {{
    html += '<div class="match-item" data-match-left="' + idx + '-' + i + '">' + safeHtml(p.left) + '</div>';
  }});
  html += '</div>';
  var shuffled = block.pairs.map(function(p, i) {{ return {{ text: p.right, origIdx: i }}; }});
  shuffleArray(shuffled);
  html += '<div>';
  html += '<div class="match-column-label">Strategy</div>';
  shuffled.forEach(function(s) {{
    html += '<div class="match-item" data-match-right="' + idx + '-' + s.origIdx + '">' + safeHtml(s.text) + '</div>';
  }});
  html += '</div></div>';
  html += '<div class="match-feedback" id="match-feedback-' + idx + '" style="display:none"></div>';
  html += '</div>';
  return html;
}}

function renderSortBlock(block, idx) {{
  var items = block.items.map(function(item, i) {{ return {{ text: item, origIdx: i }}; }});
  shuffleArray(items);
  var html = '<div class="sort-container" data-sort="' + idx + '">';
  html += '<p style="font-size:13px;color:var(--c-text-muted);margin-bottom:12px">' + safeHtml(block.prompt) + '</p>';
  items.forEach(function(item, i) {{
    html += '<div class="sort-item" draggable="true" data-sort-idx="' + item.origIdx + '">';
    html += '<span class="sort-handle">&#9776;</span>';
    html += '<span class="sort-num">' + (i + 1) + '</span>';
    html += '<span>' + safeHtml(item.text) + '</span>';
    html += '</div>';
  }});
  html += '</div>';
  return html;
}}

function renderExerciseBlock(block, idx) {{
  var exId = block.exerciseId;
  var tasks = block.tasks;
  var prog = State.getExerciseProgress(exId, tasks);
  var pct = prog.total > 0 ? Math.round((prog.done / prog.total) * 100) : 0;

  var activeTaskId = null, activeStepIdx = -1;
  for (var ti = 0; ti < tasks.length && activeStepIdx === -1; ti++) {{
    for (var si = 0; si < tasks[ti].steps.length; si++) {{
      if (!State.isStepDone(exId, tasks[ti].id, si)) {{
        activeTaskId = tasks[ti].id;
        activeStepIdx = si;
        break;
      }}
    }}
  }}

  var html = '<div class="exercise-block" data-exercise="' + exId + '">';
  html += '<div class="exercise-objective">';
  html += '<div class="exercise-objective-label">Objective</div>';
  html += '<p>' + safeHtml(block.objective) + '</p></div>';

  html += '<div class="exercise-progress">';
  html += '<div class="exercise-progress-label">' + prog.done + ' of ' + prog.total + ' steps completed</div>';
  html += '<div class="exercise-progress-bar"><div class="exercise-progress-fill" style="width:' + pct + '%"></div></div>';
  html += '</div>';

  tasks.forEach(function(task) {{
    var taskDone = 0;
    task.steps.forEach(function(_s, si) {{
      if (State.isStepDone(exId, task.id, si)) taskDone++;
    }});
    html += '<div class="exercise-task">';
    html += '<div class="exercise-task-header"><h3>' + safeHtml(task.title) + '</h3>';
    html += '<span class="exercise-task-progress">' + taskDone + '/' + task.steps.length + '</span></div>';
    html += '<div class="exercise-steps">';

    task.steps.forEach(function(step, si) {{
      var isDone = State.isStepDone(exId, task.id, si);
      var isActive = (task.id === activeTaskId && si === activeStepIdx);
      var cls = isDone ? "done" : (isActive ? "active" : "upcoming");

      html += '<div class="exercise-step ' + cls + '" data-ex="' + exId + '" data-task="' + task.id + '" data-step="' + si + '">';
      html += '<div class="exercise-step-indicator">' + (isDone ? "&#10003;" : (si + 1)) + '</div>';
      html += '<div class="exercise-step-action-text">' + safeHtml(step.action) + '</div>';
      html += '<div class="exercise-step-detail">';

      if (step.detail) {{
        html += '<div class="exercise-step-box detail-box">';
        html += '<div class="exercise-step-box-label">Why it matters</div>';
        html += '<p>' + safeHtml(step.detail) + '</p></div>';
      }}

      if (step.hint) {{
        html += '<div class="exercise-hint-toggle" data-hint="' + exId + '-' + task.id + '-' + si + '">&#9654; Show Hint</div>';
        html += '<div class="exercise-hint-text" id="hint-' + exId + '-' + task.id + '-' + si + '">' + safeHtml(step.hint) + '</div>';
      }}

      if (!isDone) {{
        html += '<div class="exercise-step-actions">';
        html += '<button class="btn btn-primary btn-sm exercise-step-done" data-ex="' + exId + '" data-task="' + task.id + '" data-step="' + si + '">Done — Next Step</button>';
        html += '</div>';
      }}

      html += '</div></div>';
    }});

    html += '</div></div>';
  }});

  html += '</div>';
  return html;
}}

/* ============================================================
   Interaction Binders
   ============================================================ */
function bindInteractions() {{
  // Reveal cards
  document.querySelectorAll(".reveal-card").forEach(function(card) {{
    card.addEventListener("click", function() {{ card.classList.toggle("flipped"); }});
  }});

  // Match interactions
  document.querySelectorAll(".match-container").forEach(function(container) {{
    var matchIdx = container.getAttribute("data-match");
    var selectedLeft = null;
    var matchedCount = 0;
    var totalPairs = container.querySelectorAll("[data-match-left]").length;

    container.querySelectorAll("[data-match-left]").forEach(function(el) {{
      el.addEventListener("click", function() {{
        if (el.classList.contains("matched")) return;
        container.querySelectorAll("[data-match-left]").forEach(function(e) {{ e.classList.remove("selected"); }});
        el.classList.add("selected");
        selectedLeft = el.getAttribute("data-match-left");
      }});
    }});

    container.querySelectorAll("[data-match-right]").forEach(function(el) {{
      el.addEventListener("click", function() {{
        if (!selectedLeft || el.classList.contains("matched")) return;
        var rightKey = el.getAttribute("data-match-right");
        if (selectedLeft === rightKey) {{
          var leftEl = container.querySelector('[data-match-left="' + selectedLeft + '"]');
          if (leftEl) leftEl.classList.add("matched");
          el.classList.add("matched");
          matchedCount++;
          selectedLeft = null;
          if (matchedCount === totalPairs) {{
            var fb = document.getElementById("match-feedback-" + matchIdx);
            if (fb) {{ fb.className = "match-feedback success"; fb.textContent = "All matched correctly!"; fb.style.display = ""; }}
          }}
        }} else {{
          el.classList.add("wrong");
          setTimeout(function() {{ el.classList.remove("wrong"); }}, 500);
        }}
      }});
    }});
  }});

  // Sort drag-and-drop
  document.querySelectorAll(".sort-container").forEach(function(container) {{
    var items = container.querySelectorAll(".sort-item");
    var dragEl = null;
    items.forEach(function(item) {{
      item.addEventListener("dragstart", function(e) {{
        dragEl = item; item.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
      }});
      item.addEventListener("dragend", function() {{
        item.classList.remove("dragging");
        container.querySelectorAll(".sort-item").forEach(function(el) {{ el.classList.remove("drag-over"); }});
        updateSortNumbers(container);
      }});
      item.addEventListener("dragover", function(e) {{
        e.preventDefault();
        if (dragEl !== item) item.classList.add("drag-over");
      }});
      item.addEventListener("dragleave", function() {{ item.classList.remove("drag-over"); }});
      item.addEventListener("drop", function(e) {{
        e.preventDefault();
        item.classList.remove("drag-over");
        if (dragEl && dragEl !== item) {{
          var parent = item.parentNode;
          var allItems = Array.from(parent.querySelectorAll(".sort-item"));
          var dragIdx = allItems.indexOf(dragEl);
          var dropIdx = allItems.indexOf(item);
          if (dragIdx < dropIdx) parent.insertBefore(dragEl, item.nextSibling);
          else parent.insertBefore(dragEl, item);
          updateSortNumbers(parent);
        }}
      }});
    }});
  }});

  // Exercise step done buttons
  document.querySelectorAll(".exercise-step-done").forEach(function(btn) {{
    btn.addEventListener("click", function(e) {{
      e.stopPropagation();
      var exId = btn.getAttribute("data-ex");
      var taskId = btn.getAttribute("data-task");
      var stepIdx = parseInt(btn.getAttribute("data-step"), 10);
      State.completeStep(exId, taskId, stepIdx);

      var stepEl = btn.closest(".exercise-step");
      var wasActive = stepEl && stepEl.classList.contains("active");
      if (stepEl) {{
        stepEl.classList.remove("active", "expanded", "upcoming");
        stepEl.classList.add("done");
        var indicator = stepEl.querySelector(".exercise-step-indicator");
        if (indicator) indicator.innerHTML = "&#10003;";
        var actions = stepEl.querySelector(".exercise-step-actions");
        if (actions) actions.remove();
      }}

      var exerciseBlock = document.querySelector('.exercise-block[data-exercise="' + exId + '"]');
      if (exerciseBlock && wasActive) {{
        var allSteps = exerciseBlock.querySelectorAll(".exercise-step");
        var activated = false;
        allSteps.forEach(function(s) {{
          if (!activated && s.classList.contains("upcoming")) {{
            s.classList.remove("upcoming"); s.classList.add("active"); activated = true;
          }}
        }});
      }}

      if (exerciseBlock) {{
        var taskEls = exerciseBlock.querySelectorAll(".exercise-task");
        var totalDone = 0, totalSteps = 0;
        taskEls.forEach(function(taskEl) {{
          var doneInTask = taskEl.querySelectorAll(".exercise-step.done").length;
          var stepsInTask = taskEl.querySelectorAll(".exercise-step").length;
          totalDone += doneInTask; totalSteps += stepsInTask;
          var progLabel = taskEl.querySelector(".exercise-task-progress");
          if (progLabel) progLabel.textContent = doneInTask + "/" + stepsInTask;
        }});
        var pct = totalSteps > 0 ? Math.round((totalDone / totalSteps) * 100) : 0;
        var fill = exerciseBlock.querySelector(".exercise-progress-fill");
        if (fill) fill.style.width = pct + "%";
        var label = exerciseBlock.querySelector(".exercise-progress-label");
        if (label) label.textContent = totalDone + " of " + totalSteps + " steps completed";
      }}
    }});
  }});

  // Exercise hint toggles
  document.querySelectorAll(".exercise-hint-toggle").forEach(function(toggle) {{
    toggle.addEventListener("click", function(e) {{
      e.stopPropagation();
      var hintKey = toggle.getAttribute("data-hint");
      var hintEl = document.getElementById("hint-" + hintKey);
      if (hintEl) {{
        var isOpen = hintEl.classList.toggle("expanded");
        toggle.innerHTML = isOpen ? "&#9660; Hide Hint" : "&#9654; Show Hint";
      }}
    }});
  }});

  // Exercise step expand/collapse
  document.querySelectorAll(".exercise-step").forEach(function(step) {{
    step.addEventListener("click", function() {{
      if (step.classList.contains("active")) return;
      step.classList.toggle("expanded");
    }});
  }});
}}

function updateSortNumbers(container) {{
  var items = container.querySelectorAll(".sort-item");
  items.forEach(function(item, i) {{
    var num = item.querySelector(".sort-num");
    if (num) num.textContent = i + 1;
    var origIdx = parseInt(item.getAttribute("data-sort-idx"), 10);
    if (origIdx === i) item.classList.add("correct");
    else item.classList.remove("correct");
  }});
}}

/* ============================================================
   View Renderers
   ============================================================ */
var mainEl = document.getElementById("main");
function setMain(h) {{ mainEl.innerHTML = h; mainEl.scrollTop = 0; }}

function renderOverview() {{
  var topics = MODULE_DATA.topics;
  var completedCount = State.getCompletedTopicCount();
  var total = topics.length;
  var pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  var h = "";
  h += '<div class="module-header">';
  h += '<span class="module-badge">Module ' + MOD_IDX + '</span>';
  h += '<h1>' + esc(MODULE_DATA.title) + '</h1>';
  h += '<p class="text-muted">' + esc(MODULE_DATA.description) + '</p>';
  h += '</div>';

  h += '<div class="progress-inline mb-lg">';
  h += '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
  h += '<span class="progress-text">' + pct + '%</span>';
  h += '</div>';

  h += '<h2 class="mb-md">Topics</h2>';
  h += '<div class="stagger">';
  topics.forEach(function(topic, tIdx) {{
    var isDone = State.isTopicCompleted(topic.id);
    var isExercise = topic.isExercise || (tIdx + 1) >= EXERCISE_TOPIC_START;
    var cls = "topic-list-item" + (isDone ? " completed" : "") + (isExercise ? " exercise-item" : "");
    h += '<div class="' + cls + '" data-route="#/topic/' + topic.id + '">';
    h += '<div class="topic-check' + (isDone ? " done" : "") + '">' + (isDone ? "&#10003;" : "") + '</div>';
    h += '<div class="topic-info">';
    if (isExercise) {{
      var exNum = (tIdx + 1) - EXERCISE_TOPIC_START + 1;
      h += '<div class="topic-title"><span class="exercise-icon">&#128295;</span>Exercise ' + exNum + ': ' + esc(topic.title) + '</div>';
    }} else {{
      h += '<div class="topic-title">' + MOD_IDX + '.' + (tIdx + 1) + ' ' + esc(topic.title) + '</div>';
    }}
    h += '<div class="topic-meta">~' + (topic.estimatedMinutes || 5) + ' min</div>';
    h += '</div>';
    h += '<span class="topic-arrow">&#8250;</span>';
    h += '</div>';
  }});
  h += '</div>';

  // Quiz card
  var qr = State.getQuizResult();
  h += '<div class="quiz-card" data-route="#/quiz">';
  h += '<span class="quiz-icon">&#9997;</span>';
  h += '<div class="quiz-info">';
  h += '<div class="quiz-title">Module ' + MOD_IDX + ' Knowledge Check</div>';
  if (qr) {{
    h += '<div class="quiz-meta">Best: ' + qr.s + '/' + qr.t + '</div>';
  }} else {{
    h += '<div class="quiz-meta">Not attempted yet</div>';
  }}
  h += '</div><span class="topic-arrow">&#8250;</span></div>';

  if (!SCORM.isAvailable()) {{
    h += '<p class="scorm-warn mt-lg">SCORM API not detected — running in standalone preview mode.</p>';
  }}

  setMain(h);
  bindRouteClicks();
}}

function renderTopic(topicId) {{
  var topic = null;
  var topicIdx = -1;
  for (var i = 0; i < MODULE_DATA.topics.length; i++) {{
    if (MODULE_DATA.topics[i].id === topicId) {{
      topic = MODULE_DATA.topics[i];
      topicIdx = i;
      break;
    }}
  }}
  if (!topic) {{ setMain("<p>Topic not found.</p>"); return; }}

  var isCompleted = State.isTopicCompleted(topicId);
  var h = "";

  // Header
  h += '<div class="topic-header">';
  h += '<h1>' + esc(topic.title) + '</h1>';
  h += '<p class="text-dim text-sm">~' + (topic.estimatedMinutes || 5) + ' min</p>';
  h += '</div>';

  // Content blocks
  h += '<div class="topic-content">';
  topic.content.forEach(function(block, bi) {{ h += renderBlock(block, bi); }});
  h += '</div>';

  // Key takeaways
  if (topic.keyTakeaways && topic.keyTakeaways.length > 0) {{
    h += '<div class="takeaways-box"><h3>Key Takeaways</h3><ul>';
    topic.keyTakeaways.forEach(function(tk) {{ h += '<li>' + safeHtml(tk) + '</li>'; }});
    h += '</ul></div>';
  }}

  // Mark complete
  h += '<div class="mark-complete-bar' + (isCompleted ? " completed" : "") + '" id="mark-complete">';
  if (isCompleted) {{
    h += '<button class="btn btn-outline btn-sm" id="uncomplete-btn">&#10003; Completed (Undo)</button>';
  }} else {{
    h += '<button class="btn btn-primary" id="complete-btn">Mark as Complete</button>';
  }}
  h += '</div>';

  // Navigation
  h += '<div class="nav-btns">';
  if (topicIdx > 0) {{
    var prevId = MODULE_DATA.topics[topicIdx - 1].id;
    h += '<button class="btn btn-outline" data-route="#/topic/' + prevId + '">&#8592; Previous</button>';
  }} else {{
    h += '<button class="btn btn-outline" data-route="#/overview">&#8592; Overview</button>';
  }}
  if (topicIdx < MODULE_DATA.topics.length - 1) {{
    var nextId = MODULE_DATA.topics[topicIdx + 1].id;
    h += '<button class="btn btn-primary" data-route="#/topic/' + nextId + '">Next &#8594;</button>';
  }} else {{
    h += '<button class="btn btn-primary" data-route="#/quiz">Take Quiz &#8594;</button>';
  }}
  h += '</div>';

  setMain(h);
  bindInteractions();
  bindRouteClicks();
  bindCompletion(topicId);
}}

function bindCompletion(topicId) {{
  var completeBtn = document.getElementById("complete-btn");
  var uncompleteBtn = document.getElementById("uncomplete-btn");

  if (completeBtn) {{
    completeBtn.addEventListener("click", function() {{
      State.completeTopic(topicId);
      var bar = document.getElementById("mark-complete");
      bar.classList.add("completed");
      bar.innerHTML = '<button class="btn btn-outline btn-sm" id="uncomplete-btn">&#10003; Completed (Undo)</button>';
      bindCompletion(topicId);
      renderSidebar();
    }});
  }}

  if (uncompleteBtn) {{
    uncompleteBtn.addEventListener("click", function() {{
      State.uncompleteTopic(topicId);
      var bar = document.getElementById("mark-complete");
      bar.classList.remove("completed");
      bar.innerHTML = '<button class="btn btn-primary" id="complete-btn">Mark as Complete</button>';
      bindCompletion(topicId);
      renderSidebar();
    }});
  }}
}}

/* ============================================================
   Quiz Engine
   ============================================================ */
function renderQuiz() {{
  var qs = State.getQuizState();
  var currentQ = qs.i || 0;
  var answers = qs.a || [];
  var q = QUIZ_DATA.questions[currentQ];
  var total = QUIZ_DATA.questions.length;
  var answered = answers[currentQ] != null;

  var h = "";
  h += '<div class="quiz-header">';
  h += '<h2>Module ' + MOD_IDX + ' Knowledge Check</h2>';
  h += '<p class="text-muted text-sm">Question ' + (currentQ + 1) + ' of ' + total + '</p>';
  h += '<div class="quiz-progress-dots">';
  for (var i = 0; i < total; i++) {{
    var dc = "quiz-dot";
    if (i === currentQ) dc += " current";
    else if (answers[i] != null) dc += (answers[i] === QUIZ_DATA.questions[i].answerIndex ? " correct" : " incorrect");
    h += '<div class="' + dc + '"></div>';
  }}
  h += '</div></div>';

  h += '<div class="quiz-question-card">';
  h += '<div class="quiz-question-text">' + esc(q.question) + '</div>';
  var letters = ["A", "B", "C", "D"];
  for (var oi = 0; oi < q.options.length; oi++) {{
    var oc = "quiz-option";
    if (answered) {{
      oc += " disabled";
      if (oi === q.answerIndex) oc += " correct";
      else if (oi === answers[currentQ] && oi !== q.answerIndex) oc += " incorrect";
    }}
    h += '<div class="' + oc + '" data-option="' + oi + '">';
    h += '<span class="option-letter">' + letters[oi] + '</span>';
    h += '<span>' + esc(q.options[oi]) + '</span></div>';
  }}
  h += '</div>';

  if (answered) {{
    h += '<div class="quiz-rationale">' + esc(q.rationale) + '</div>';
  }}

  h += '<div class="nav-btns">';
  if (currentQ > 0) {{
    h += '<button class="btn btn-outline" id="quiz-prev">&#8592; Previous</button>';
  }} else {{
    h += '<button class="btn btn-outline" data-route="#/overview">&#8592; Overview</button>';
  }}
  if (answered) {{
    if (currentQ < total - 1) {{
      h += '<button class="btn btn-primary" id="quiz-next">Next &#8594;</button>';
    }} else {{
      h += '<button class="btn btn-primary" id="quiz-finish">See Results &#8594;</button>';
    }}
  }} else {{
    h += '<span></span>';
  }}
  h += '</div>';

  setMain(h);

  // Option clicks
  if (!answered) {{
    document.querySelectorAll(".quiz-option").forEach(function(el) {{
      el.addEventListener("click", function() {{
        var idx = parseInt(el.getAttribute("data-option"), 10);
        answers[currentQ] = idx;
        State.setQuizState({{ i: currentQ, a: answers }});
        renderQuiz();
      }});
    }});
  }}

  // Nav
  var prevBtn = document.getElementById("quiz-prev");
  if (prevBtn) prevBtn.addEventListener("click", function() {{
    State.setQuizState({{ i: currentQ - 1, a: answers }});
    renderQuiz();
  }});
  var nextBtn = document.getElementById("quiz-next");
  if (nextBtn) nextBtn.addEventListener("click", function() {{
    State.setQuizState({{ i: currentQ + 1, a: answers }});
    renderQuiz();
  }});
  var finishBtn = document.getElementById("quiz-finish");
  if (finishBtn) finishBtn.addEventListener("click", function() {{
    window.location.hash = "#/results";
  }});
  bindRouteClicks();
}}

function renderResults() {{
  var qs = State.getQuizState();
  var answers = qs.a || [];
  var total = QUIZ_DATA.questions.length;
  var correct = 0;
  for (var i = 0; i < total; i++) {{
    if (answers[i] === QUIZ_DATA.questions[i].answerIndex) correct++;
  }}

  var pct = Math.round((correct / total) * 100);
  var passed = pct >= PASSING_SCORE;
  SCORM.reportScore(pct, 100, passed);
  State.setQuizResult({{ s: correct, t: total }});

  var circumference = 2 * Math.PI * 42;
  var offset = circumference - (pct / 100) * circumference;

  var h = "";
  h += '<div class="quiz-results">';
  h += '<div class="quiz-score-ring"><svg viewBox="0 0 100 100">';
  h += '<circle class="ring-bg" cx="50" cy="50" r="42"/>';
  h += '<circle class="ring-fill' + (pct < 50 ? " low" : "") + '" cx="50" cy="50" r="42" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '"/>';
  h += '</svg><div class="quiz-score-text">' + correct + '/' + total + '</div></div>';

  var heading = pct >= 75 ? "Great Job!" : pct >= 50 ? "Good Effort!" : "Keep Studying";
  h += '<h2>' + heading + '</h2>';
  h += '<p class="text-muted">You scored ' + pct + '% on this knowledge check.</p>';
  if (SCORM.isAvailable()) {{
    h += '<p class="text-muted text-sm" style="margin-top:4px">Status: ' + (passed ? "Passed" : "Failed") + ' (passing score: ' + PASSING_SCORE + '%)</p>';
  }}
  h += '</div>';

  h += '<h3 class="mb-md mt-lg">Question Review</h3>';
  for (var qi = 0; qi < QUIZ_DATA.questions.length; qi++) {{
    var q = QUIZ_DATA.questions[qi];
    var isCorrect = answers[qi] === q.answerIndex;
    h += '<div class="card mb-sm">';
    h += '<p style="font-size:13px;font-weight:600;color:var(--c-text-primary);margin-bottom:8px">';
    h += (isCorrect ? "&#10003; " : "&#10007; ") + esc(q.question) + '</p>';
    if (!isCorrect) {{
      h += '<p style="font-size:12px;color:var(--c-danger);margin-bottom:4px">Your answer: ' + esc(q.options[answers[qi]]) + '</p>';
      h += '<p style="font-size:12px;color:var(--c-accent);margin-bottom:4px">Correct: ' + esc(q.options[q.answerIndex]) + '</p>';
    }}
    h += '<p style="font-size:12px;color:var(--c-text-muted)">' + esc(q.rationale) + '</p>';
    h += '</div>';
  }}

  h += '<div class="nav-btns">';
  h += '<button class="btn btn-outline" data-route="#/overview">&#8592; Overview</button>';
  h += '<button class="btn btn-primary" id="quiz-retry">Retry Quiz</button>';
  h += '</div>';

  if (!SCORM.isAvailable()) {{
    h += '<p class="scorm-warn">SCORM API not detected — running in standalone preview mode.</p>';
  }}

  setMain(h);

  var retryBtn = document.getElementById("quiz-retry");
  if (retryBtn) retryBtn.addEventListener("click", function() {{
    State.setQuizState({{ i: 0, a: [] }});
    window.location.hash = "#/quiz";
  }});
  bindRouteClicks();
}}

/* ============================================================
   Sidebar
   ============================================================ */
function renderSidebar() {{
  var sidebarEl = document.getElementById("sidebar");
  var topics = MODULE_DATA.topics;
  var hash = window.location.hash || "#/overview";

  var h = "";
  h += '<div class="scorm-sidebar-header">';
  h += '<h3>' + esc(MODULE_DATA.title) + '</h3>';
  h += '<p>Module ' + MOD_IDX + '</p>';
  h += '</div>';
  h += '<div class="scorm-sidebar-nav">';

  // Overview link
  var ovCls = "scorm-topic-link" + (hash === "#/overview" || hash === "#/" ? " active" : "");
  h += '<div class="' + ovCls + '" data-route="#/overview">';
  h += '<span style="font-size:14px">&#9776;</span>';
  h += '<span>Overview</span></div>';

  h += '<div class="scorm-sidebar-section">Topics</div>';

  topics.forEach(function(topic, idx) {{
    var isCompleted = State.isTopicCompleted(topic.id);
    var isActive = hash === "#/topic/" + topic.id;
    var cls = "scorm-topic-link" + (isActive ? " active" : "") + (isCompleted ? " completed" : "");
    h += '<div class="' + cls + '" data-route="#/topic/' + topic.id + '">';
    h += '<span class="scorm-topic-check">' + (isCompleted ? "&#10003;" : "") + '</span>';
    h += '<span>' + MOD_IDX + '.' + (idx + 1) + ' ' + esc(topic.title) + '</span>';
    h += '</div>';
  }});

  h += '<div class="scorm-sidebar-section">Assessment</div>';
  var quizActive = hash === "#/quiz" || hash === "#/results";
  var quizCls = "scorm-topic-link" + (quizActive ? " active" : "");
  h += '<div class="' + quizCls + '" data-route="#/quiz">';
  h += '<span style="font-size:14px">&#9997;</span>';
  h += '<span>Knowledge Check</span></div>';

  h += '</div>';
  sidebarEl.innerHTML = h;

  // Bind sidebar clicks
  sidebarEl.querySelectorAll("[data-route]").forEach(function(el) {{
    el.addEventListener("click", function() {{
      window.location.hash = el.getAttribute("data-route");
    }});
  }});
}}

/* ============================================================
   Router
   ============================================================ */
function bindRouteClicks() {{
  document.getElementById("main").querySelectorAll("[data-route]").forEach(function(el) {{
    el.addEventListener("click", function() {{
      window.location.hash = el.getAttribute("data-route");
    }});
  }});
}}

function route() {{
  var hash = window.location.hash || "#/overview";
  State.setLastView(hash);
  renderSidebar();

  if (hash === "#/overview" || hash === "#/") {{
    renderOverview();
  }} else if (hash.indexOf("#/topic/") === 0) {{
    var topicId = hash.replace("#/topic/", "");
    renderTopic(topicId);
  }} else if (hash === "#/quiz") {{
    renderQuiz();
  }} else if (hash === "#/results") {{
    renderResults();
  }} else {{
    renderOverview();
  }}
}}

/* ============================================================
   Init
   ============================================================ */
SCORM.init();
State.load();

// Resume at last view if available
var resumeHash = State.getLastView();
if (resumeHash && resumeHash !== "#/overview" && resumeHash !== "#/") {{
  window.location.hash = resumeHash;
}} else {{
  window.location.hash = "#/overview";
}}

window.addEventListener("hashchange", route);
route();

// Cleanup on exit
window.addEventListener("beforeunload", function() {{
  State.save();
  SCORM.finish();
}});

}})();
</script>
</body>
</html>"""


def export_module(course_id, course_data, module, output_dir, passing_score):
    """Export a single module as a SCORM 1.2 ZIP."""
    content_file = module.get("contentFile")
    quiz_file = module.get("quizFile")

    if not content_file:
        print(f"  Skipping {module['id']}: no contentFile defined")
        return None
    if not quiz_file:
        print(f"  Skipping {module['id']}: no quizFile defined")
        return None

    module_data = load_module(course_id, content_file)
    quiz_data = load_quiz(course_id, quiz_file)
    course_title = course_data.get("title", course_id)
    module_title = module.get("title", module["id"])
    sco_id = f"{course_id}-{module['id']}-scorm12"

    # Collect images
    image_files = collect_images(course_id, module_data)
    for img_src, abs_path in image_files:
        if not os.path.exists(abs_path):
            print(f"  WARNING: Image not found: {abs_path}")

    manifest_xml = generate_manifest(
        course_title, module_title, sco_id, passing_score, image_files
    )
    full_html = generate_full_html(
        module_data, quiz_data, course_title, module_title, module, passing_score
    )

    zip_name = f"{sco_id}.zip"
    zip_path = os.path.join(output_dir, zip_name)

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("imsmanifest.xml", manifest_xml)
        zf.writestr("index.html", full_html)
        for img_src, abs_path in image_files:
            if os.path.exists(abs_path):
                zf.write(abs_path, img_src)

    size_kb = os.path.getsize(zip_path) / 1024
    img_count = len([1 for _, p in image_files if os.path.exists(p)])
    print(f"  {zip_name} ({size_kb:.0f} KB, {len(module_data.get('topics', []))} topics, {img_count} images)")
    return zip_path


def main():
    parser = argparse.ArgumentParser(
        description="Export full modules as SCORM 1.2 packages"
    )
    parser.add_argument(
        "--course",
        required=True,
        help="Course ID (e.g. wc-ocp1)",
    )
    parser.add_argument(
        "--module",
        help="Module ID to export (e.g. m1). If omitted, exports all modules.",
    )
    parser.add_argument(
        "--output",
        required=True,
        help="Output directory for SCORM ZIP files",
    )
    parser.add_argument(
        "--passing-score",
        type=int,
        default=75,
        help="Passing score percentage (default: 75)",
    )

    args = parser.parse_args()
    course_id = args.course

    # Load course metadata
    try:
        course_data = load_course(course_id)
    except FileNotFoundError:
        print(f"Error: course '{course_id}' not found.", file=sys.stderr)
        sys.exit(1)

    # Determine which modules to export
    modules = course_data.get("modules", [])
    if args.module:
        modules = [m for m in modules if m["id"] == args.module]
        if not modules:
            print(
                f"Error: module '{args.module}' not found in course '{course_id}'.",
                file=sys.stderr,
            )
            sys.exit(1)

    output_dir = os.path.abspath(args.output)
    os.makedirs(output_dir, exist_ok=True)

    print(f"Exporting SCORM 1.2 packages for: {course_data.get('title', course_id)}")
    print(f"Modules: {', '.join(m['id'] for m in modules)}")
    print(f"Passing score: {args.passing_score}%")
    print(f"Output: {output_dir}")
    print()

    exported = 0
    for module in modules:
        result = export_module(
            course_id, course_data, module, output_dir, args.passing_score
        )
        if result:
            exported += 1

    print(f"\nDone — {exported} SCORM package(s) exported.")


if __name__ == "__main__":
    main()
