"""Fail when the installed RenderCV version differs from the project pin."""

from __future__ import annotations

import importlib.metadata
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
REQUIREMENTS_FILE = PROJECT_ROOT / "requirements-rendercv.txt"
CV_FILE = PROJECT_ROOT / "cv" / "cv.yaml"
PIN_PATTERN = re.compile(r"^rendercv(?:\[[^]]+\])?==([^\s;]+)$", re.IGNORECASE)
SCHEMA_PATTERN = re.compile(r"/refs/tags/v([^/]+)/schema\.json")


def expected_version() -> str:
    for raw_line in REQUIREMENTS_FILE.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        match = PIN_PATTERN.fullmatch(line)
        if match:
            return match.group(1)

    raise SystemExit(
        f"Expected one exact RenderCV pin in {REQUIREMENTS_FILE}, for example "
        "rendercv[full]==2.6"
    )


expected = expected_version()
actual = importlib.metadata.version("rendercv")
schema_match = SCHEMA_PATTERN.search(CV_FILE.read_text(encoding="utf-8").splitlines()[0])

if actual != expected:
    raise SystemExit(f"RenderCV version mismatch: expected {expected}, found {actual}")

if not schema_match or schema_match.group(1) != expected:
    found = schema_match.group(1) if schema_match else "missing"
    raise SystemExit(
        f"RenderCV schema mismatch in {CV_FILE}: expected {expected}, found {found}"
    )

print(f"RenderCV version and schema verified: {actual}")
