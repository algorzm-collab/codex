from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
site = root / "site"

assert (site / "index.html").exists()
assert (site / "style.css").exists()
assert (site / "app.js").exists()

with (site / "data.json").open(encoding="utf-8") as f:
    data = json.load(f)

assert "brief" in data
assert "next_prompts" in data
