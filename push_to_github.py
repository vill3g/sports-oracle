import os
import subprocess
import urllib.request
import json
import base64

base_dir = r"C:\Users\vill3\.gemini\antigravity\scratch\sports-oracle"

def get_token():
    try:
        out = subprocess.check_output(["gh.exe", "auth", "token"]).decode().strip()
        if out: return out
    except Exception:
        pass
    return ""

def upload_repo(repo="vill3g/sports-oracle"):
    token = get_token()
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
            if ext in ignore_exts: continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, base_dir).replace("\\", "/")
            files_to_upload.append((rel_path, full_path))

    print(f"Uploading {len(files_to_upload)} files to {repo}...")
    for rel_path, full_path in files_to_upload:
        try:
            with open(full_path, "rb") as fp:
                content_bytes = fp.read()
            b64_content = base64.b64encode(content_bytes).decode("utf-8")
            url = f"https://api.github.com/repos/{repo}/contents/{rel_path}"
            
            sha = None
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req) as resp:
                    data = json.loads(resp.read().decode())
                    sha = data.get("sha")
            except urllib.error.HTTPError as e:
                if e.code != 404:
                    print(f"Error checking {rel_path}: {e}")

            payload = {
                "message": f"Add {rel_path}",
                "content": b64_content
            }
            if sha:
                payload["sha"] = sha

            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="PUT")
            with urllib.request.urlopen(req) as resp:
                print(f"OK: {rel_path}")
        except Exception as err:
            print(f"ERR {rel_path}: {err}")

    print("All files pushed to GitHub successfully!")

if __name__ == "__main__":
    upload_repo()