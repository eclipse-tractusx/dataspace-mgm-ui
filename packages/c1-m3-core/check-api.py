# Copyright (c) 2026 Contributors to the Eclipse Foundation
# SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
# AI Disclosure: AI-generated with Codex (GPT-6); human review required.
# Assisted-By: Codex (GPT-6)
"""Generate to temporary files and compare bytes, including untracked generated files."""
from pathlib import Path
import subprocess
import tempfile
import sys

root = Path(__file__).resolve().parents[2]
with tempfile.TemporaryDirectory(prefix="review-api-") as directory:
    for spec, generated in [("openapi.yaml", "c1-m3-api.d.ts"), ("registration.openapi.yaml", "registration-api.d.ts")]:
        output = Path(directory) / generated
        subprocess.run(["npx", "--yes", "--package=openapi-typescript@7.13.0", "openapi-typescript", str(root / "specs/c1-m3" / spec), "-o", str(output)], check=True, cwd=directory)
        if output.read_bytes() != (root / "packages/c1-m3-core/src/generated" / generated).read_bytes():
            sys.exit(f"Stale generated API: {generated}; run nx run c1-m3-core:generate-api")
print("C1-M3 and registration reference types match their specs.")
