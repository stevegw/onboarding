"""
OB Dev Server — serves static files + author-mode API endpoints.
Replaces `python -m http.server 8050` during development.

Usage:  cd docs && python server.py
        Open http://localhost:8050

Endpoints:
  GET  /api/module-structure?courseId=X&moduleFile=Y
  POST /api/image           (multipart file upload)
  POST /api/content-block   (JSON body — insert block)
  PUT  /api/content-block   (JSON body — update block at index)
  PUT  /api/quiz-question   (update question at index)
  POST /api/quiz-question   (insert question at index)
  DELETE /api/quiz-question (delete question at index)
  PUT  /api/glossary-term   (update term at index)
  POST /api/glossary-term   (append term)
  DELETE /api/glossary-term (delete term at index)
  PUT  /api/topic-metadata  (update topic title, minutes, etc.)
  PUT  /api/module-metadata (update module title, description)
  POST /api/undo           (restore .bak snapshot)

stdlib-only — no pip dependencies required.
"""

import hashlib
import http.server
import json
import os
import re
import shutil
import sys
from email import policy
from email.parser import BytesParser
from urllib.parse import urlparse, parse_qs

PORT = 8050
COURSES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "courses")


def safe_path(base, *parts):
    """Resolve path and ensure it stays under base directory."""
    joined = os.path.join(base, *parts)
    resolved = os.path.realpath(joined)
    base_resolved = os.path.realpath(base)
    if not resolved.startswith(base_resolved + os.sep) and resolved != base_resolved:
        return None
    return resolved


def sanitize_filename(name):
    """Strip path separators and dangerous chars from filename."""
    name = os.path.basename(name)
    name = re.sub(r'[^\w.\-]', '_', name)
    if not name or name.startswith('.'):
        name = 'image' + name
    return name


def unique_path(directory, filename):
    """Return a path that doesn't collide. Appends -1, -2, etc."""
    filepath = os.path.join(directory, filename)
    if not os.path.exists(filepath):
        return filepath
    base, ext = os.path.splitext(filename)
    counter = 1
    while True:
        candidate = os.path.join(directory, f"{base}-{counter}{ext}")
        if not os.path.exists(candidate):
            return candidate
        counter += 1


def parse_multipart(content_type, body):
    """Parse multipart form data using the email module (Python 3.13+ safe)."""
    raw = b"Content-Type: " + content_type.encode() + b"\r\n\r\n" + body
    msg = BytesParser(policy=policy.default).parsebytes(raw)
    parts = {}
    for part in msg.iter_parts():
        cd = part["Content-Disposition"] or ""
        name_match = re.search(r'name="([^"]+)"', cd)
        if not name_match:
            continue
        name = name_match.group(1)
        fn_match = re.search(r'filename="([^"]*)"', cd)
        if fn_match:
            parts[name] = {
                "filename": fn_match.group(1),
                "data": part.get_payload(decode=True),
            }
        else:
            parts[name] = part.get_payload(decode=True).decode("utf-8", errors="replace")
    return parts


class DevHandler(http.server.SimpleHTTPRequestHandler):
    """Serves static files + API endpoints for author mode."""

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/module-structure":
            self.handle_module_structure(parse_qs(parsed.query))
        elif parsed.path == "/api/exact-steps":
            self.handle_get_exact_steps(parse_qs(parsed.query))
        else:
            super().do_GET()

    def do_PUT(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/content-block":
            self.handle_update_block()
        elif parsed.path == "/api/quiz-question":
            self.handle_update_quiz_question()
        elif parsed.path == "/api/glossary-term":
            self.handle_update_glossary_term()
        elif parsed.path == "/api/topic-metadata":
            self.handle_update_topic_metadata()
        elif parsed.path == "/api/module-metadata":
            self.handle_update_module_metadata()
        elif parsed.path == "/api/exact-steps":
            self.handle_update_exact_steps()
        else:
            self.send_error(404)

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/image":
            self.handle_image_upload()
        elif parsed.path == "/api/content-block":
            self.handle_content_block()
        elif parsed.path == "/api/quiz-question":
            self.handle_add_quiz_question()
        elif parsed.path == "/api/glossary-term":
            self.handle_add_glossary_term()
        elif parsed.path == "/api/exact-steps":
            self.handle_create_exact_steps()
        elif parsed.path == "/api/undo":
            self.handle_undo()
        else:
            self.send_error(404)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/content-block":
            self.handle_delete_block()
        elif parsed.path == "/api/quiz-question":
            self.handle_delete_quiz_question()
        elif parsed.path == "/api/glossary-term":
            self.handle_delete_glossary_term()
        else:
            self.send_error(404)

    def do_PATCH(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/content-block":
            self.handle_move_block()
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def send_json(self, status, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_cors_headers()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_json_error(self, status, message):
        self.send_json(status, {"error": message})

    # ── GET /api/module-structure ──

    def handle_module_structure(self, qs):
        course_id = (qs.get("courseId") or [None])[0]
        module_file = (qs.get("moduleFile") or [None])[0]

        if not course_id or not module_file:
            self.send_json_error(400, "courseId and moduleFile are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, module_file)
        if not filepath:
            self.send_json_error(403, "Invalid path")
            return

        if not os.path.isfile(filepath):
            self.send_json_error(404, f"Module file not found: {module_file}")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                module = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read module: {e}")
            return

        # Build topic summaries with content block previews
        topics = []
        for topic in module.get("topics", []):
            blocks = []
            for i, block in enumerate(topic.get("content", [])):
                preview = self._block_preview(block)
                blocks.append({
                    "index": i,
                    "type": block.get("type", "unknown"),
                    "preview": preview,
                })
            topics.append({
                "id": topic.get("id", ""),
                "title": topic.get("title", ""),
                "blockCount": len(blocks),
                "blocks": blocks,
            })

        self.send_json(200, {
            "moduleId": module.get("id", ""),
            "moduleTitle": module.get("title", ""),
            "topics": topics,
        })

    def _block_preview(self, block):
        """Generate a short preview string for a content block."""
        btype = block.get("type", "")
        if btype in ("paragraph", "heading"):
            text = block.get("text", "")
            return text[:80] + ("..." if len(text) > 80 else "")
        if btype == "callout":
            text = block.get("text", "")
            variant = block.get("variant", "")
            prefix = f"[{variant}] " if variant else ""
            return prefix + text[:60] + ("..." if len(text) > 60 else "")
        if btype == "image":
            return block.get("alt", block.get("src", ""))
        if btype == "comparison-table":
            headers = block.get("headers", [])
            return "Table: " + ", ".join(headers[:4])
        if btype == "reveal-cards":
            count = len(block.get("cards", []))
            return f"{count} cards"
        if btype == "interactive-match":
            return block.get("prompt", "Match activity")[:60]
        if btype == "interactive-sort":
            return block.get("prompt", "Sort activity")[:60]
        return btype

    # ── POST /api/image ──

    def handle_image_upload(self):
        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type:
            self.send_json_error(400, "Expected multipart/form-data")
            return

        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > 20 * 1024 * 1024:  # 20 MB limit
            self.send_json_error(413, "File too large (max 20 MB)")
            return

        body = self.rfile.read(content_length)

        try:
            parts = parse_multipart(content_type, body)
        except Exception as e:
            self.send_json_error(400, f"Failed to parse upload: {e}")
            return

        course_id = parts.get("courseId", "")
        file_part = parts.get("file")

        if not course_id or not file_part or not isinstance(file_part, dict):
            self.send_json_error(400, "courseId and file are required")
            return

        filename = sanitize_filename(file_part["filename"])
        images_dir = safe_path(COURSES_DIR, course_id, "images")
        if not images_dir:
            self.send_json_error(403, "Invalid course path")
            return

        os.makedirs(images_dir, exist_ok=True)

        dest = unique_path(images_dir, filename)
        final_name = os.path.basename(dest)

        try:
            with open(dest, "wb") as f:
                f.write(file_part["data"])
        except OSError as e:
            self.send_json_error(500, f"Failed to write file: {e}")
            return

        self.send_json(200, {
            "path": f"images/{final_name}",
            "filename": final_name,
            "size": len(file_part["data"]),
        })

    # ── POST /api/content-block ──

    def handle_content_block(self):
        content_type = self.headers.get("Content-Type", "")
        if "application/json" not in content_type:
            self.send_json_error(400, "Expected application/json")
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_json_error(400, "Invalid JSON")
            return

        course_id = data.get("courseId")
        module_file = data.get("moduleFile")
        topic_id = data.get("topicId")
        insert_index = data.get("insertIndex")
        block = data.get("block")

        if not all([course_id, module_file, topic_id, block]) or insert_index is None:
            self.send_json_error(400, "courseId, moduleFile, topicId, insertIndex, and block are required")
            return

        if not isinstance(insert_index, int) or insert_index < 0:
            self.send_json_error(400, "insertIndex must be a non-negative integer")
            return

        filepath = safe_path(COURSES_DIR, course_id, module_file)
        if not filepath:
            self.send_json_error(403, "Invalid path")
            return

        if not os.path.isfile(filepath):
            self.send_json_error(404, f"Module file not found: {module_file}")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                module = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read module: {e}")
            return

        # Find topic
        topic = None
        for t in module.get("topics", []):
            if t.get("id") == topic_id:
                topic = t
                break

        if topic is None:
            self.send_json_error(404, f"Topic not found: {topic_id}")
            return

        content = topic.get("content", [])
        if insert_index > len(content):
            insert_index = len(content)

        content.insert(insert_index, block)
        topic["content"] = content

        undo_id = self._write_json(filepath, module)
        if undo_id is False:
            return  # _write_json already sent error

        self.send_json(200, {
            "ok": True,
            "topicId": topic_id,
            "insertIndex": insert_index,
            "blockCount": len(content),
            "undoId": undo_id,
            "filePath": self._rel_path(filepath, course_id),
        })

    # ── DELETE /api/content-block ──

    def handle_delete_block(self):
        content_type = self.headers.get("Content-Type", "")
        if "application/json" not in content_type:
            self.send_json_error(400, "Expected application/json")
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_json_error(400, "Invalid JSON")
            return

        course_id = data.get("courseId")
        module_file = data.get("moduleFile")
        topic_id = data.get("topicId")
        block_index = data.get("blockIndex")

        if not all([course_id, module_file, topic_id]) or block_index is None:
            self.send_json_error(400, "courseId, moduleFile, topicId, and blockIndex are required")
            return

        if not isinstance(block_index, int) or block_index < 0:
            self.send_json_error(400, "blockIndex must be a non-negative integer")
            return

        filepath = safe_path(COURSES_DIR, course_id, module_file)
        if not filepath:
            self.send_json_error(403, "Invalid path")
            return

        if not os.path.isfile(filepath):
            self.send_json_error(404, f"Module file not found: {module_file}")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                module = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read module: {e}")
            return

        topic = None
        for t in module.get("topics", []):
            if t.get("id") == topic_id:
                topic = t
                break

        if topic is None:
            self.send_json_error(404, f"Topic not found: {topic_id}")
            return

        content = topic.get("content", [])
        if block_index >= len(content):
            self.send_json_error(400, f"blockIndex {block_index} out of range (topic has {len(content)} blocks)")
            return

        removed = content.pop(block_index)
        topic["content"] = content

        # If the removed block is an image, move the file to .bak (undoable)
        if removed.get("type") == "image" and removed.get("src"):
            img_path = safe_path(COURSES_DIR, course_id, removed["src"])
            if img_path and os.path.isfile(img_path):
                try:
                    shutil.move(img_path, img_path + ".bak")
                except OSError:
                    pass  # non-fatal

        undo_id = self._write_json(filepath, module)
        if undo_id is False:
            return

        self.send_json(200, {
            "ok": True,
            "topicId": topic_id,
            "removedIndex": block_index,
            "blockCount": len(content),
            "undoId": undo_id,
            "filePath": self._rel_path(filepath, course_id),
        })

    # ── PATCH /api/content-block ──

    def handle_move_block(self):
        content_type = self.headers.get("Content-Type", "")
        if "application/json" not in content_type:
            self.send_json_error(400, "Expected application/json")
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_json_error(400, "Invalid JSON")
            return

        course_id = data.get("courseId")
        module_file = data.get("moduleFile")
        topic_id = data.get("topicId")
        block_index = data.get("blockIndex")
        direction = data.get("direction")

        if not all([course_id, module_file, topic_id, direction]) or block_index is None:
            self.send_json_error(400, "courseId, moduleFile, topicId, blockIndex, and direction are required")
            return

        if direction not in ("up", "down"):
            self.send_json_error(400, "direction must be 'up' or 'down'")
            return

        if not isinstance(block_index, int) or block_index < 0:
            self.send_json_error(400, "blockIndex must be a non-negative integer")
            return

        filepath = safe_path(COURSES_DIR, course_id, module_file)
        if not filepath:
            self.send_json_error(403, "Invalid path")
            return

        if not os.path.isfile(filepath):
            self.send_json_error(404, f"Module file not found: {module_file}")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                module = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read module: {e}")
            return

        topic = None
        for t in module.get("topics", []):
            if t.get("id") == topic_id:
                topic = t
                break

        if topic is None:
            self.send_json_error(404, f"Topic not found: {topic_id}")
            return

        content = topic.get("content", [])
        if block_index >= len(content):
            self.send_json_error(400, f"blockIndex {block_index} out of range")
            return

        swap_index = block_index - 1 if direction == "up" else block_index + 1

        # Bounds check: no-op if already at edge
        if swap_index < 0 or swap_index >= len(content):
            self.send_json(200, {
                "ok": True,
                "topicId": topic_id,
                "blockIndex": block_index,
                "newIndex": block_index,
                "blockCount": len(content),
            })
            return

        content[block_index], content[swap_index] = content[swap_index], content[block_index]
        topic["content"] = content

        undo_id = self._write_json(filepath, module)
        if undo_id is False:
            return

        self.send_json(200, {
            "ok": True,
            "topicId": topic_id,
            "blockIndex": block_index,
            "newIndex": swap_index,
            "blockCount": len(content),
            "undoId": undo_id,
            "filePath": self._rel_path(filepath, course_id),
        })

    # ── PUT /api/content-block ──

    def handle_update_block(self):
        content_type = self.headers.get("Content-Type", "")
        if "application/json" not in content_type:
            self.send_json_error(400, "Expected application/json")
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_json_error(400, "Invalid JSON")
            return

        course_id = data.get("courseId")
        module_file = data.get("moduleFile")
        topic_id = data.get("topicId")
        block_index = data.get("blockIndex")
        block = data.get("block")

        if not all([course_id, module_file, topic_id, block]) or block_index is None:
            self.send_json_error(400, "courseId, moduleFile, topicId, blockIndex, and block are required")
            return

        if not isinstance(block_index, int) or block_index < 0:
            self.send_json_error(400, "blockIndex must be a non-negative integer")
            return

        filepath = safe_path(COURSES_DIR, course_id, module_file)
        if not filepath:
            self.send_json_error(403, "Invalid path")
            return

        if not os.path.isfile(filepath):
            self.send_json_error(404, f"Module file not found: {module_file}")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                module = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read module: {e}")
            return

        topic = None
        for t in module.get("topics", []):
            if t.get("id") == topic_id:
                topic = t
                break

        if topic is None:
            self.send_json_error(404, f"Topic not found: {topic_id}")
            return

        content = topic.get("content", [])
        if block_index >= len(content):
            self.send_json_error(400, f"blockIndex {block_index} out of range (topic has {len(content)} blocks)")
            return

        content[block_index] = block
        topic["content"] = content

        undo_id = self._write_json(filepath, module)
        if undo_id is False:
            return

        self.send_json(200, {
            "ok": True,
            "topicId": topic_id,
            "blockIndex": block_index,
            "blockCount": len(content),
            "undoId": undo_id,
            "filePath": self._rel_path(filepath, course_id),
        })

    # ── PUT /api/quiz-question ──

    def handle_update_quiz_question(self):
        data = self._read_json_body()
        if data is None:
            return

        course_id = data.get("courseId")
        quiz_file = data.get("quizFile")
        question_index = data.get("questionIndex")
        question = data.get("question")

        if not all([course_id, quiz_file, question]) or question_index is None:
            self.send_json_error(400, "courseId, quizFile, questionIndex, and question are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, quiz_file)
        if not filepath:
            self.send_json_error(403, "Invalid path")
            return

        if not os.path.isfile(filepath):
            self.send_json_error(404, f"Quiz file not found: {quiz_file}")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                quiz = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read quiz: {e}")
            return

        questions = quiz.get("questions", [])
        if not isinstance(question_index, int) or question_index < 0 or question_index >= len(questions):
            self.send_json_error(400, f"questionIndex {question_index} out of range")
            return

        questions[question_index] = question

        undo_id = self._write_json(filepath, quiz)
        if undo_id is False:
            return
        self.send_json(200, {"ok": True, "questionIndex": question_index,
                             "undoId": undo_id, "filePath": self._rel_path(filepath, course_id)})

    # ── POST /api/quiz-question ──

    def handle_add_quiz_question(self):
        data = self._read_json_body()
        if data is None:
            return

        course_id = data.get("courseId")
        quiz_file = data.get("quizFile")
        insert_index = data.get("insertIndex")
        question = data.get("question")

        if not all([course_id, quiz_file, question]) or insert_index is None:
            self.send_json_error(400, "courseId, quizFile, insertIndex, and question are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, quiz_file)
        if not filepath:
            self.send_json_error(403, "Invalid path")
            return

        if not os.path.isfile(filepath):
            self.send_json_error(404, f"Quiz file not found: {quiz_file}")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                quiz = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read quiz: {e}")
            return

        questions = quiz.get("questions", [])
        if insert_index > len(questions):
            insert_index = len(questions)
        questions.insert(insert_index, question)

        undo_id = self._write_json(filepath, quiz)
        if undo_id is False:
            return
        self.send_json(200, {"ok": True, "insertIndex": insert_index, "questionCount": len(questions),
                             "undoId": undo_id, "filePath": self._rel_path(filepath, course_id)})

    # ── DELETE /api/quiz-question ──

    def handle_delete_quiz_question(self):
        data = self._read_json_body()
        if data is None:
            return

        course_id = data.get("courseId")
        quiz_file = data.get("quizFile")
        question_index = data.get("questionIndex")

        if not all([course_id, quiz_file]) or question_index is None:
            self.send_json_error(400, "courseId, quizFile, and questionIndex are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, quiz_file)
        if not filepath:
            self.send_json_error(403, "Invalid path")
            return

        if not os.path.isfile(filepath):
            self.send_json_error(404, f"Quiz file not found: {quiz_file}")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                quiz = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read quiz: {e}")
            return

        questions = quiz.get("questions", [])
        if not isinstance(question_index, int) or question_index < 0 or question_index >= len(questions):
            self.send_json_error(400, f"questionIndex {question_index} out of range")
            return

        questions.pop(question_index)

        undo_id = self._write_json(filepath, quiz)
        if undo_id is False:
            return
        self.send_json(200, {"ok": True, "questionCount": len(questions),
                             "undoId": undo_id, "filePath": self._rel_path(filepath, course_id)})

    # ── PUT /api/glossary-term ──

    def handle_update_glossary_term(self):
        data = self._read_json_body()
        if data is None:
            return

        course_id = data.get("courseId")
        term_index = data.get("termIndex")
        term = data.get("term")

        if not all([course_id, term]) or term_index is None:
            self.send_json_error(400, "courseId, termIndex, and term are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, "glossary.json")
        if not filepath or not os.path.isfile(filepath):
            self.send_json_error(404, "Glossary not found")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                glossary = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read glossary: {e}")
            return

        terms = glossary.get("terms", [])
        if not isinstance(term_index, int) or term_index < 0 or term_index >= len(terms):
            self.send_json_error(400, f"termIndex {term_index} out of range")
            return

        terms[term_index] = term

        undo_id = self._write_json(filepath, glossary)
        if undo_id is False:
            return
        self.send_json(200, {"ok": True, "termIndex": term_index,
                             "undoId": undo_id, "filePath": self._rel_path(filepath, course_id)})

    # ── POST /api/glossary-term ──

    def handle_add_glossary_term(self):
        data = self._read_json_body()
        if data is None:
            return

        course_id = data.get("courseId")
        term = data.get("term")

        if not all([course_id, term]):
            self.send_json_error(400, "courseId and term are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, "glossary.json")
        if not filepath or not os.path.isfile(filepath):
            self.send_json_error(404, "Glossary not found")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                glossary = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read glossary: {e}")
            return

        terms = glossary.get("terms", [])
        terms.append(term)

        undo_id = self._write_json(filepath, glossary)
        if undo_id is False:
            return
        self.send_json(200, {"ok": True, "termCount": len(terms),
                             "undoId": undo_id, "filePath": self._rel_path(filepath, course_id)})

    # ── DELETE /api/glossary-term ──

    def handle_delete_glossary_term(self):
        data = self._read_json_body()
        if data is None:
            return

        course_id = data.get("courseId")
        term_index = data.get("termIndex")

        if not all([course_id]) or term_index is None:
            self.send_json_error(400, "courseId and termIndex are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, "glossary.json")
        if not filepath or not os.path.isfile(filepath):
            self.send_json_error(404, "Glossary not found")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                glossary = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read glossary: {e}")
            return

        terms = glossary.get("terms", [])
        if not isinstance(term_index, int) or term_index < 0 or term_index >= len(terms):
            self.send_json_error(400, f"termIndex {term_index} out of range")
            return

        terms.pop(term_index)

        undo_id = self._write_json(filepath, glossary)
        if undo_id is False:
            return
        self.send_json(200, {"ok": True, "termCount": len(terms),
                             "undoId": undo_id, "filePath": self._rel_path(filepath, course_id)})

    # ── PUT /api/topic-metadata ──

    def handle_update_topic_metadata(self):
        data = self._read_json_body()
        if data is None:
            return

        course_id = data.get("courseId")
        module_file = data.get("moduleFile")
        topic_id = data.get("topicId")
        metadata = data.get("metadata")

        if not all([course_id, module_file, topic_id, metadata]):
            self.send_json_error(400, "courseId, moduleFile, topicId, and metadata are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, module_file)
        if not filepath or not os.path.isfile(filepath):
            self.send_json_error(404, f"Module file not found: {module_file}")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                module = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read module: {e}")
            return

        topic = None
        for t in module.get("topics", []):
            if t.get("id") == topic_id:
                topic = t
                break

        if topic is None:
            self.send_json_error(404, f"Topic not found: {topic_id}")
            return

        # Update allowed fields
        for key in ("title", "estimatedMinutes", "isExercise", "keyTakeaways"):
            if key in metadata:
                topic[key] = metadata[key]

        undo_id = self._write_json(filepath, module)
        if undo_id is False:
            return
        self.send_json(200, {"ok": True, "topicId": topic_id,
                             "undoId": undo_id, "filePath": self._rel_path(filepath, course_id)})

    # ── PUT /api/module-metadata ──

    def handle_update_module_metadata(self):
        data = self._read_json_body()
        if data is None:
            return

        course_id = data.get("courseId")
        module_file = data.get("moduleFile")
        metadata = data.get("metadata")

        if not all([course_id, module_file, metadata]):
            self.send_json_error(400, "courseId, moduleFile, and metadata are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, module_file)
        if not filepath or not os.path.isfile(filepath):
            self.send_json_error(404, f"Module file not found: {module_file}")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                module = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read module: {e}")
            return

        for key in ("title", "description"):
            if key in metadata:
                module[key] = metadata[key]

        undo_id = self._write_json(filepath, module)
        if undo_id is False:
            return
        self.send_json(200, {"ok": True,
                             "undoId": undo_id, "filePath": self._rel_path(filepath, course_id)})

    # ── GET /api/exact-steps ──

    def handle_get_exact_steps(self, qs):
        course_id = (qs.get("courseId") or [None])[0]
        exercise_id = (qs.get("exerciseId") or [None])[0]

        if not course_id or not exercise_id:
            self.send_json_error(400, "courseId and exerciseId are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, "exercises", exercise_id + ".json")
        if not filepath or not os.path.isfile(filepath):
            self.send_json_error(404, "Exact steps not found")
            return

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            self.send_json_error(500, f"Failed to read exact steps: {e}")
            return

        self.send_json(200, data)

    # ── POST /api/exact-steps ──

    def handle_create_exact_steps(self):
        data = self._read_json_body()
        if data is None:
            return

        course_id = data.get("courseId")
        exercise_id = data.get("exerciseId")
        content = data.get("content")

        if not all([course_id, exercise_id, content]):
            self.send_json_error(400, "courseId, exerciseId, and content are required")
            return

        exercises_dir = safe_path(COURSES_DIR, course_id, "exercises")
        if not exercises_dir:
            self.send_json_error(403, "Invalid path")
            return

        os.makedirs(exercises_dir, exist_ok=True)

        filepath = safe_path(exercises_dir, exercise_id + ".json")
        if not filepath:
            self.send_json_error(403, "Invalid exercise ID")
            return

        undo_id = self._write_json(filepath, content)
        if undo_id is False:
            return
        self.send_json(200, {"ok": True,
                             "undoId": undo_id, "filePath": self._rel_path(filepath, course_id)})

    # ── PUT /api/exact-steps ──

    def handle_update_exact_steps(self):
        data = self._read_json_body()
        if data is None:
            return

        course_id = data.get("courseId")
        exercise_id = data.get("exerciseId")
        content = data.get("content")

        if not all([course_id, exercise_id, content]):
            self.send_json_error(400, "courseId, exerciseId, and content are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, "exercises", exercise_id + ".json")
        if not filepath:
            self.send_json_error(403, "Invalid path")
            return

        if not os.path.isfile(filepath):
            os.makedirs(os.path.dirname(filepath), exist_ok=True)

        undo_id = self._write_json(filepath, content)
        if undo_id is False:
            return
        self.send_json(200, {"ok": True,
                             "undoId": undo_id, "filePath": self._rel_path(filepath, course_id)})

    # ── POST /api/undo ──

    def handle_undo(self):
        data = self._read_json_body()
        if data is None:
            return

        course_id = data.get("courseId")
        file_path = data.get("filePath")
        undo_id = data.get("undoId")

        if not all([course_id, file_path, undo_id]):
            self.send_json_error(400, "courseId, filePath, and undoId are required")
            return

        filepath = safe_path(COURSES_DIR, course_id, file_path)
        if not filepath:
            self.send_json_error(403, "Invalid path")
            return

        bak = filepath + ".bak"
        if not os.path.isfile(bak):
            self.send_json_error(404, "No backup found — change may have been superseded")
            return

        # Validate undoId matches current .bak mtime
        mtime = str(os.path.getmtime(bak))
        expected_id = hashlib.sha256((filepath + "|" + mtime).encode()).hexdigest()[:16]
        if undo_id != expected_id:
            self.send_json_error(409, "Undo expired — a newer edit has superseded this change")
            return

        try:
            shutil.copy2(bak, filepath)
            os.remove(bak)
        except OSError as e:
            self.send_json_error(500, f"Undo failed: {e}")
            return

        # Restore any .bak image files in the course's images/ dir
        images_dir = safe_path(COURSES_DIR, course_id, "images")
        if images_dir and os.path.isdir(images_dir):
            for fname in os.listdir(images_dir):
                if fname.endswith(".bak"):
                    orig = os.path.join(images_dir, fname[:-4])
                    bakimg = os.path.join(images_dir, fname)
                    try:
                        shutil.move(bakimg, orig)
                    except OSError:
                        pass

        self.send_json(200, {"ok": True})

    # ── Shared helpers ──

    def _read_json_body(self):
        """Read and parse JSON from request body. Returns None on error (sends error response)."""
        content_type = self.headers.get("Content-Type", "")
        if "application/json" not in content_type:
            self.send_json_error(400, "Expected application/json")
            return None

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            return json.loads(body)
        except json.JSONDecodeError:
            self.send_json_error(400, "Invalid JSON")
            return None

    def _make_backup(self, filepath):
        """Copy file to .bak before writing. Returns undoId hash or None."""
        if not os.path.isfile(filepath):
            return None
        bak = filepath + ".bak"
        try:
            shutil.copy2(filepath, bak)
            mtime = str(os.path.getmtime(bak))
            return hashlib.sha256((filepath + "|" + mtime).encode()).hexdigest()[:16]
        except OSError:
            return None

    def _rel_path(self, filepath, course_id):
        """Return path relative to course dir."""
        course_dir = os.path.join(COURSES_DIR, course_id)
        try:
            return os.path.relpath(filepath, course_dir).replace("\\", "/")
        except ValueError:
            return os.path.basename(filepath)

    def _write_json(self, filepath, data):
        """Backup then write JSON data to file. Returns undoId, None (no backup), or False (write error)."""
        undo_id = self._make_backup(filepath)
        try:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                f.write("\n")
            return undo_id
        except OSError as e:
            self.send_json_error(500, f"Failed to write file: {e}")
            return False

    def end_headers(self):
        """Add no-cache header to all responses so edits are seen on refresh."""
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format, *args):
        """Prefix log with [OB] for clarity."""
        sys.stderr.write(f"[OB] {args[0]}\n")


class ReusableHTTPServer(http.server.HTTPServer):
    allow_reuse_address = True
    allow_reuse_port = True


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = ReusableHTTPServer(("", PORT), DevHandler)
    print(f"[OB] Dev server running at http://localhost:{PORT}")
    print(f"[OB] Serving from: {os.getcwd()}")
    print(f"[OB]")
    print(f"[OB]   View:  http://localhost:{PORT}?course=wc-ocp1")
    print(f"[OB]   Edit:  http://localhost:{PORT}?course=wc-ocp1&edit=true")
    print(f"[OB]")
    print(f"[OB] Press Ctrl+C to stop")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[OB] Stopped.")
        server.server_close()


if __name__ == "__main__":
    main()
