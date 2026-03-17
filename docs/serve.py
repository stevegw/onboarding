"""
Dev server for the onboarding platform.
Drop-in replacement for `python -m http.server 8050` that also handles
POST /api/save-catalog to write catalog changes directly to disk.

Usage:
    cd docs && python serve.py
"""

import http.server
import json
import os
import re
import ssl
import subprocess
import sys

PORT = 8050
CERTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "certs")
CERT_FILE = os.path.join(CERTS_DIR, "localhost.pem")
KEY_FILE = os.path.join(CERTS_DIR, "localhost-key.pem")


def ensure_certs():
    """Generate self-signed localhost certs if they don't exist."""
    if os.path.exists(CERT_FILE) and os.path.exists(KEY_FILE):
        return True
    os.makedirs(CERTS_DIR, exist_ok=True)
    try:
        subprocess.run([
            "openssl", "req", "-x509", "-newkey", "rsa:2048",
            "-keyout", KEY_FILE, "-out", CERT_FILE,
            "-days", "365", "-nodes",
            "-subj", "/CN=localhost",
        ], check=True, capture_output=True)
        print("[OB] Generated self-signed certs in certs/")
        return True
    except (FileNotFoundError, subprocess.CalledProcessError) as e:
        print(f"[OB] Could not generate certs (openssl not found?): {e}")
        return False


class DevHandler(http.server.SimpleHTTPRequestHandler):

    def do_POST(self):
        if self.path == "/api/save-catalog":
            self._handle_save_catalog()
        else:
            self.send_error(404, "Not found")

    def _handle_save_catalog(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            catalog = body["catalog"]

            # 1. Write catalog.json
            with open("catalog.json", "w", encoding="utf-8") as f:
                json.dump(catalog, f, indent=2, ensure_ascii=False)
                f.write("\n")

            # 2. Rebuild catalog-bundle.js preserving _uiStringsEn
            bundle_path = os.path.join("js", "catalog-bundle.js")
            ui_strings_block = ""
            if os.path.exists(bundle_path):
                existing = open(bundle_path, "r", encoding="utf-8").read()
                m = re.search(
                    r"OB\._uiStringsEn\s*=\s*(\{[\s\S]*?\});",
                    existing,
                )
                if m:
                    ui_strings_block = m.group(1)

            if not ui_strings_block:
                ui_strings_block = "{}"

            catalog_json = json.dumps(catalog, indent=1, ensure_ascii=False)
            bundle_content = (
                '/**\n'
                ' * OB -- Catalog Bundle\n'
                ' * =====================\n'
                ' * Catalog data embedded as JS for file:// compatibility.\n'
                ' * When present, content.js uses this instead of fetch("catalog.json").\n'
                ' */\n'
                '(function () {\n'
                ' "use strict";\n'
                ' var OB = window.OB = window.OB || {};\n'
                '\n'
                f' OB._uiStringsEn = {ui_strings_block};\n'
                '\n'
                f' OB._catalogBundle = {catalog_json};\n'
                '})();\n'
            )

            with open(bundle_path, "w", encoding="utf-8") as f:
                f.write(bundle_content)

            self._json_response(200, {"ok": True})

        except Exception as e:
            self._json_response(500, {"error": str(e)})

    def _json_response(self, code, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        # Colour POST lines green for visibility
        msg = format % args
        if "POST" in msg:
            sys.stderr.write(f"\033[32m{self.log_date_time_string()} {msg}\033[0m\n")
        else:
            super().log_message(format, *args)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)) or ".")
    use_https = "--https" in sys.argv

    with http.server.HTTPServer(("", PORT), DevHandler) as httpd:
        protocol = "http"
        if use_https:
            if ensure_certs():
                ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
                ctx.load_cert_chain(CERT_FILE, KEY_FILE)
                httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
                protocol = "https"
            else:
                print("[OB] Falling back to HTTP (no certs)")

        print(f"Serving on {protocol}://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down.")
