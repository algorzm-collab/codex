import hashlib
import json
import subprocess
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "static"
RELEASE = ROOT / "release"
BUILD_LABEL = "20260708-v10-evidence-os"
ZIP_NAME = f"strategy_static_{BUILD_LABEL}.zip"
MANIFEST_NAME = f"strategy_static_{BUILD_LABEL}_manifest.json"


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def run_static_check():
    result = subprocess.run(
        [sys.executable, str(ROOT / "check_static_release.py")],
        cwd=str(ROOT),
        text=True,
        capture_output=True,
    )
    if result.returncode != 0:
        if result.stdout:
            print(result.stdout.strip())
        if result.stderr:
            print(result.stderr.strip())
        raise SystemExit(result.returncode)
    print(result.stdout.strip())


def iter_static_files():
    return sorted(path for path in STATIC.rglob("*") if path.is_file())


def package():
    RELEASE.mkdir(exist_ok=True)
    zip_path = RELEASE / ZIP_NAME
    manifest_path = RELEASE / MANIFEST_NAME
    files = iter_static_files()
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in files:
            archive.write(path, path.relative_to(STATIC).as_posix())
    manifest = {
        "build_label": BUILD_LABEL,
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "static_root": str(STATIC),
        "zip": {
            "name": zip_path.name,
            "bytes": zip_path.stat().st_size,
            "sha256": sha256(zip_path),
        },
        "files": [
            {
                "path": path.relative_to(STATIC).as_posix(),
                "bytes": path.stat().st_size,
                "sha256": sha256(path),
            }
            for path in files
        ],
    }
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"OK: packaged {zip_path}")
    print(f"OK: wrote {manifest_path}")


def main():
    run_static_check()
    package()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

