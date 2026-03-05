"""
OB Dev Server — serves static files + author-mode API endpoints.
Replaces `python -m http.server 8050` during development.

Usage:  cd docs && python server.py
        Open http://localhost:8050

Endpoints:
  GET  /api/module-structure?courseId=X&moduleFile=Y
  POST /api/image           (multipart file upload)
  POST /api/content-block   (JSON body)

stdlib-only — no pip dependencies required.
"""

import http.server
import json
import os
import re
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
        else:
            super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/image":
            self.handle_image_upload()
        elif parsed.path == "/api/content-block":
            self.handle_content_block()
        else:
            self.send_error(404)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/content-block":
            self.handle_delete_block()
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
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS")
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

        try:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(module, f, indent=2, ensure_ascii=False)
                f.write("\n")
        except OSError as e:
            self.send_json_error(500, f"Failed to write module: {e}")
            return

        self.send_json(200, {
            "ok": True,
            "topicId": topic_id,
            "insertIndex": insert_index,
            "blockCount": len(content),
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

        # If the removed block is an image, delete the file from disk
        if removed.get("type") == "image" and removed.get("src"):
            img_path = safe_path(COURSES_DIR, course_id, removed["src"])
            if img_path and os.path.isfile(img_path):
                try:
                    os.remove(img_path)
                except OSError:
                    pass  # non-fatal

        try:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(module, f, indent=2, ensure_ascii=False)
                f.write("\n")
        except OSError as e:
            self.send_json_error(500, f"Failed to write module: {e}")
            return

        self.send_json(200, {
            "ok": True,
            "topicId": topic_id,
            "removedIndex": block_index,
            "blockCount": len(content),
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

        try:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(module, f, indent=2, ensure_ascii=False)
                f.write("\n")
        except OSError as e:
            self.send_json_error(500, f"Failed to write module: {e}")
            return

        self.send_json(200, {
            "ok": True,
            "topicId": topic_id,
            "blockIndex": block_index,
            "newIndex": swap_index,
            "blockCount": len(content),
        })

    def end_headers(self):
        """Add no-cache header to all responses so edits are seen on refresh."""
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format, *args):
        """Prefix log with [OB] for clarity."""
        sys.stderr.write(f"[OB] {args[0]}\n")


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = http.server.HTTPServer(("", PORT), DevHandler)
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
