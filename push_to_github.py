import os
import subprocess
import urllib.request
import urllib.error
import json
import base64
import hashlib
import time

base_dir = r"C:\Users\vill3\.gemini\antigravity\scratch\sports-oracle"

def get_token():
    try:
        out = subprocess.check_output(["gh.exe", "auth", "token"]).decode().strip()
        if out:
            return out
    except Exception:
        pass
    return ""

def git_blob_sha(content_bytes: bytes) -> str:
    header = f"blob {len(content_bytes)}\0".encode("utf-8")
    return hashlib.sha1(header + content_bytes).hexdigest()

def upload_repo(repo="vill3g/sports-oracle"):
    token = get_token()
    if not token:
        print("Error: No GitHub token found via gh auth token.")
        return

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "SportsOracle-Uploader",
        "Authorization": f"Bearer {token}"
    }

    ignore_dirs = {".git", "node_modules", ".system_generated", "__pycache__", "dist", ".vite"}
    ignore_exts = {".pyc", ".log", ".tmp"}

    files_to_upload = []
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ignore_exts:
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, base_dir).replace("\\", "/")
            files_to_upload.append((rel_path, full_path))

    print(f"Checking {len(files_to_upload)} files against repository {repo}...")
    updated_count = 0
    skipped_count = 0

    for rel_path, full_path in files_to_upload:
        try:
            with open(full_path, "rb") as fp:
                content_bytes = fp.read()
            local_sha = git_blob_sha(content_bytes)
            b64_content = base64.b64encode(content_bytes).decode("utf-8")

            url = f"https://api.github.com/repos/{repo}/contents/{rel_path}"
            remote_sha = None

            # Check if file exists and compare sha
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req) as resp:
                    data = json.loads(resp.read().decode())
                    remote_sha = data.get("sha")
            except urllib.error.HTTPError as e:
                if e.code != 404:
                    print(f"Notice checking {rel_path}: {e}")

            if remote_sha == local_sha:
                print(f"[UNCHANGED] {rel_path}")
                skipped_count += 1
                continue

            # Need to create or update
            action = "Update" if remote_sha else "Create"
            payload = {
                "message": f"{action} {rel_path} (High-signal ML models, weather, and sharp data layers)",
                "content": b64_content
            }
            if remote_sha:
                payload["sha"] = remote_sha

            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="PUT"
            )
            with urllib.request.urlopen(req) as resp:
                print(f"[{action.upper()} OK] {rel_path}")
                updated_count += 1

            # Brief pause to respect GitHub rate limits
            time.sleep(0.3)

        except Exception as err:
            print(f"[ERROR] {rel_path}: {err}")

    print(f"\nCompleted! {updated_count} files updated/created, {skipped_count} files up to date.")

if __name__ == "__main__":
    upload_repo()