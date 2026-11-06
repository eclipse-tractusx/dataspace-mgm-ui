#!/usr/bin/env python3
#################################################################################
#  Copyright (c) 2026 Catena-X Automotive Network e.V.
#  Copyright (c) 2026 Contributors to the Eclipse Foundation
#
#  See the NOTICE file(s) distributed with this work for additional
#  information regarding copyright ownership.
#
#  This program and the accompanying materials are made available under the
#  terms of the Apache License, Version 2.0 which is available at
#  https://www.apache.org/licenses/LICENSE-2.0.
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#  License for the specific language governing permissions and limitations
#  under the License.
#
#  AI Disclosure: This file was entirely AI-generated.
#  The AI-generated portions are made available under CC0-1.0 and not subject
#  to the project's license. The human contributor has reviewed and verified
#  that the code is correct.
#
#  SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
#  Assisted-By: Claude Code (claude-opus-5-5)
#################################################################################
"""Check a branch before its pull request to eclipse-tractusx/dataspace-mgm-ui, read-only.

Usage: merge-guard.py [base] [--run] [--strict]

  base       what the PR merges into (default: origin/main; upstream/main when that remote exists)
  --run      also run the CI gate: npx nx affected -t lint typecheck test build check-api
  --strict   exit 1 on a blocker or high finding

Checks the rules of the frontend architecture (portal-frontend-spec, chapters 01, 05, 13) on the added
lines: no tokens or Keycloak in the browser, framework-free core packages, MUI only in ui-mui,
openapi-fetch only in core infrastructure, no fetchBaseQuery, no WebSockets, generated code untouched,
no new legacy shared components, no deep imports; plus license headers (TRG 7.02), DEPENDENCIES when
the lock file changes (TRG 7.04), commits (AI disclosure, Conventional Commits) and secrets.
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # keep the repository free of __pycache__
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "portal-spec-sources" / "scripts"))
import specs  # noqa: E402

ORDER = ["blocker", "high", "medium", "low", "info"]
CONVENTIONAL = re.compile(r"^(feat|fix|docs|chore|refactor|test|ci|build|perf|style|revert)(\([^)]+\))?!?: .+")
SECRETS = [
    (re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----"), "private key"),
    (re.compile(r"(?i)client[_-]?secret[\"']?\s*[:=]\s*[\"'][^\"'\s]{8,}"), "client secret"),
    (re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"), "JWT"),
    (re.compile(r"\bgh[pousr]_[A-Za-z0-9]{30,}"), "GitHub token"),
]
TEST_VALUE = re.compile(r"(?i)(test-only|example|dummy|placeholder|changeme)")
CODE = (".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs")
FRAMEWORKS = re.compile(r"""from\s+['"](react|react-dom|react-router[^'"]*|@reduxjs/[^'"]+|react-redux|@mui/[^'"]+|"""
                        r"""vue|@angular/[^'"]+|msw[^'"]*)['"]""")
# (pattern, where it is allowed, severity, finding, rule)
RULES = [
    (re.compile(r"""from\s+['"]keycloak-js['"]|new\s+Keycloak\("""), None, "blocker",
     "keycloak-js in the frontend; sign-in and tokens belong to the BFF", "frontend 01.1, 05, decision 2"),
    (re.compile(r"""(?i)(localStorage|sessionStorage)\.setItem\([^)]*token"""), None, "blocker",
     "a token stored in the browser; the browser holds only the HttpOnly session cookie", "frontend 05"),
    (re.compile(r"""['"]Authorization['"]\s*:|Bearer\s+\$\{"""), None, "blocker",
     "an Authorization header built in the frontend; the API attaches tokens upstream", "frontend 05"),
    (re.compile(r"""\bnew\s+WebSocket\("""), None, "high", "WebSocket; live updates come as SSE", "frontend 01.8"),
    (re.compile(r"""\bfetchBaseQuery\b"""), None, "high",
     "fetchBaseQuery; RTK Query endpoints use queryFn calling core use cases", "decision 17"),
    (re.compile(r"""from\s+['"]@mui/"""), re.compile(r"^libs/shared/ui-mui/"), "high",
     "@mui import outside libs/shared/ui-mui", "frontend 01.6, 09"),
    (re.compile(r"""from\s+['"]openapi-fetch['"]"""), re.compile(r"^packages/[^/]+/src/infrastructure/"), "high",
     "openapi-fetch outside the infrastructure of a core package", "frontend 01.6, decision 15"),
    (re.compile(r"""from\s+['"]@catena-x/portal-shared-components"""), None, "high",
     "new import of the legacy portal-shared-components", "frontend 12 done-when"),
    (re.compile(r"""from\s+['"]@portal/[^'"]+/src/"""), None, "high",
     "deep import into another package or lib; import its barrel (src/index.ts)", "frontend 01.7"),
    (re.compile(r"""from\s+['"]class-validator['"]"""), None, "medium", "class-validator; use zod", "frontend 01.7"),
]


def git(*args: str) -> str:
    return subprocess.run(["git", *args], capture_output=True, text=True, check=True).stdout


def main(argv: list[str]) -> int:
    if argv and argv[0] in ("-h", "--help"):
        print(__doc__)
        return 0
    pos = [a for a in argv if not a.startswith("--")]
    base = pos[0] if pos else ("upstream/main" if "upstream" in git("remote").split() else "origin/main")
    root = specs.repo_root()
    try:
        mb = git("merge-base", base, "HEAD").strip()
    except subprocess.CalledProcessError:
        print(f"Cannot find a merge base with {base}. Fetch it first: git fetch {base.split('/')[0]}")
        return 2
    findings: list[tuple[str, str, str]] = []

    def add(sev: str, what: str, rule: str) -> None:
        findings.append((sev, what, rule))

    changes = [ln.split("\t") for ln in git("diff", "--name-status", "--no-renames", f"{mb}..HEAD").splitlines() if ln]
    paths = [c[-1] for c in changes]
    added = {c[-1] for c in changes if c[0] == "A"}

    # --- structure
    for p in paths:
        if p.startswith("packages/") and p.endswith((".tsx", ".jsx")):
            add("high", f"{p}: .tsx in a core package; React lives only in libs/*/feature, libs/shared/ui-* and apps",
                "frontend 01.7")
    gen = [p for p in paths if "/src/generated/" in p]
    if gen and not any(p.startswith("specs/") for p in paths):
        add("high", f"generated code changed without a spec change: {', '.join(gen[:3])}; never edit src/generated/ "
                    "by hand, regenerate with nx run <module>-core:generate-api", "frontend 01.7, 10")
    if any(p.startswith("specs/") for p in paths):
        add("info", "specs/ changed: compare the copies with the backend spec "
                    "(.claude/skills/contract-seam/scripts/seam-check.py vendored)", "decision 13, 19")
    if {"package.json", "package-lock.json"} & set(paths) and "DEPENDENCIES" not in paths:
        add("high", "package.json or package-lock.json changed but DEPENDENCIES did not; run the dependencies-and-dash "
                    "skill", "TRG 7.04, workflow dependencies.yml")

    # --- added lines
    diff = git("diff", "-U0", "--no-color", f"{mb}..HEAD")
    current = ""
    for ln in diff.splitlines():
        if ln.startswith("+++ "):
            current = ln[6:] if ln.startswith("+++ b/") else ""
            continue
        if not ln.startswith("+") or not current or "/src/generated/" in current:
            continue
        line = ln[1:]
        if current.endswith(CODE) and not re.search(r"\.(spec|test)\.|/mocks/|/testing/", current):
            for rx, allowed, sev, what, rule in RULES:
                if rx.search(line) and not (allowed and allowed.match(current)):
                    add(sev, f"{current}: {what}", rule)
            if current.startswith("packages/") and FRAMEWORKS.search(line):
                add("blocker", f"{current}: imports {FRAMEWORKS.search(line).group(1)}; core packages are "
                               "framework-free", "frontend 01.2, 01.6")
        for rx, what in SECRETS:
            if rx.search(line) and not TEST_VALUE.search(line):
                add("blocker", f"{current}: added line looks like a {what}", "TRG 8, frontend 05")
                break

    # --- license headers
    for p in sorted(added):
        f = root / p
        if f.suffix in CODE + (".yaml", ".yml", ".sh", ".css", ".scss") and f.is_file() and "/src/generated/" not in p:
            head = "\n".join(f.read_text(encoding="utf-8", errors="replace").splitlines()[:25])
            if "Copyright (c)" not in head or "SPDX-License-Identifier" not in head:
                add("medium", f"{p}: license header missing (Copyright + SPDX-License-Identifier)", "TRG 7.02")

    # --- commits
    log = git("log", "--format=%H%x1f%an%x1f%ae%x1f%s%x1f%b%x1e", f"{mb}..HEAD")
    commits = [c.strip("\n").split("\x1f") for c in log.split("\x1e") if c.strip()]
    rows, unconventional, noreply = [], [], {}
    for sha, name, email, subject, body in commits:
        ai = re.search(r"(?im)^assisted-by:\s*(.+)$", body)
        coauth_ai = re.search(r"(?im)^co-authored-by:.*(claude|copilot|anthropic|openai)", body)
        rows.append([sha[:8], f"{name} <{email}>", subject[:70], ai.group(1).strip() if ai else "–"])
        if not CONVENTIONAL.match(subject):
            unconventional.append(sha[:8])
        if coauth_ai and not ai:
            add("medium", f"{sha[:8]} names an AI as co-author; disclose AI help with an Assisted-by trailer",
                "Eclipse Project Handbook (AI)")
        if email.endswith("users.noreply.github.com"):
            noreply.setdefault(email, []).append(sha[:8])
    if unconventional:
        add("low", f"{len(unconventional)} commit subject(s) are not Conventional Commits; the PR title must be one",
            "TRG 1.03")
    for email, shas in noreply.items():
        add("low", f"{len(shas)} commit(s) authored as {email}: make sure the ECA covers this address", "ECA")

    print(f"merge-guard (UI): {len(commits)} commit(s), {len(paths)} changed file(s) since {base} ({mb[:8]})\n")
    if rows:
        print(specs.table(rows, ["Commit", "Author", "Subject", "Assisted-by"]) + "\n")
    findings = sorted(set(findings), key=lambda f: (ORDER.index(f[0]), f[1]))
    print(specs.table([list(f) for f in findings], ["Severity", "Finding", "Rule"]) if findings else "No findings.")
    counts = {s: sum(f[0] == s for f in findings) for s in ORDER}
    if findings:
        print("\n" + ", ".join(f"{n} {s}" for s, n in counts.items() if n))
    rc = 0
    if "--run" in argv:
        cmd = ["npx", "nx", "affected", "-t", "lint", "typecheck", "test", "build", "check-api", f"--base={mb}"]
        print(f"\n$ {' '.join(cmd)}")
        rc = subprocess.run(cmd, cwd=root).returncode
        print(f"exit code {rc}")
    if "--strict" in argv and (counts["blocker"] or counts["high"]):
        return 1
    return rc


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
