#!/usr/bin/env python3
#################################################################################
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
"""Mockups of portal screens: standalone HTML in mockups/<feature>/ that looks like the portal.

The tokens, the navigation and the icons are generated from the code of the portal (libs/shared/ui-mui,
apps/portal/src/features, @mui/icons-material), so a mockup never drifts from the app it proposes a change to.

  new <feature> --title T --module M --path /p --view slug[:Title] ...   scaffold the hub, the views, shared/
  view <feature> slug[:Title]                                            add a view (page, hub section, TOC)
  options <feature> <view>                                               side-by-side page for one question (the exception;
                                                                         by default a view has a configurator)
  sync <feature>                                                         regenerate tokens.css, nav.js, icons.js
  check <feature> [--strict]                                             the rules of the skill create-mockup
  status [<feature>] [--ready]                                           views: open, decided or deferred
  open <feature> [<view>]                                                open in the browser (file://)
  serve [--port 4290]                                                    serve the repository on localhost

Python 3.10+, standard library only. Run from anywhere inside the dataspace-mgm-ui repository.
"""
from __future__ import annotations

import argparse
import datetime as _dt
import functools
import html
import http.server
import re
import shutil
import subprocess
import sys
import webbrowser
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
TEMPLATES = SKILL / "templates"
SHELL_ICONS = ["Add", "AppsOutlined", "DarkModeOutlined", "LightModeOutlined", "NotificationsOutlined",
               "PersonOutlined", "InfoOutlined", "ErrorOutlineOutlined"]
DEFAULT_STATES = "loaded,empty,loading,error"
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

HEADER_CSS_JS = """/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * AI Disclosure: This file was entirely AI-generated.
 * The AI-generated portions are made available under CC0-1.0 and not subject
 * to the project's license. The human contributor has reviewed and verified
 * that the code is correct.
{notes} *
 * SPDX-License-Identifier: {spdx}
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/
"""


def header(spdx: str = "Apache-2.0 AND CC0-1.0", notes: str = "") -> str:
    return HEADER_CSS_JS.format(spdx=spdx, notes=notes)


# ── repository ──────────────────────────────────────────────────────────────

@functools.cache
def repo() -> Path:
    here = Path.cwd().resolve()
    for candidate in [here, *here.parents]:
        if (candidate / "nx.json").is_file() and (candidate / "libs/shared/ui-mui").is_dir():
            return candidate
    sys.exit("mockup.py: run it inside the dataspace-mgm-ui repository (nx.json and libs/shared/ui-mui not found)")


def mockup_dir(feature: str) -> Path:
    return repo() / "mockups" / feature


def need(feature: str) -> Path:
    folder = mockup_dir(feature)
    if not (folder / "index.html").is_file():
        sys.exit(f"mockup.py: no mockup {feature!r} (mockups/{feature}/index.html); create it with: mockup.py new {feature} ...")
    return folder


def meta(hub: str, name: str, default: str = "") -> str:
    found = re.search(rf'<meta name="mockup-{name}" content="([^"]*)">', hub)
    return html.unescape(found.group(1)) if found else default


def fill(text: str, values: dict[str, str]) -> str:
    for key, value in values.items():
        text = text.replace("{{" + key + "}}", value)
    return text


def write_new(path: Path, text: str) -> None:
    if path.exists():
        print(f"  kept     {path.relative_to(repo())} (exists)")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    print(f"  created  {path.relative_to(repo())}")


def write_generated(path: Path, text: str) -> None:
    old = path.read_text(encoding="utf-8") if path.exists() else None
    if old == text:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    print(f"  {'updated ' if old is not None else 'created '} {path.relative_to(repo())}")


# ── tokens from libs/shared/ui-mui ──────────────────────────────────────────

def rgba(hex_colour: str, alpha: float) -> str:
    value = hex_colour.lstrip("#")
    r, g, b = (int(value[i:i + 2], 16) for i in (0, 2, 4))
    return f"rgba({r}, {g}, {b}, {alpha})"


def read_theme() -> dict:
    src = repo() / "libs/shared/ui-mui/src/theme"
    palette = (src / "palette.ts").read_text(encoding="utf-8")
    brand_block = re.search(r"export const tractusx = \{(.*?)\} as const", palette, re.S)
    if not brand_block:
        sys.exit("mockup.py: `export const tractusx = {…} as const` not found in palette.ts")
    brand = dict(re.findall(r"(\w+):\s*'(#[0-9A-Fa-f]{6})'", brand_block.group(1)))
    ui: dict[str, dict[str, str]] = {}
    ui_block = re.search(r"export const uiTokens[^=]*=\s*\{(.*?)\n\};", palette, re.S)
    if not ui_block:
        sys.exit("mockup.py: `export const uiTokens` not found in palette.ts")
    for mode in ("dark", "light"):
        block = re.search(rf"\b{mode}:\s*\{{(.*?)\n\s*\}}", ui_block.group(1), re.S)
        if not block:
            sys.exit(f"mockup.py: uiTokens.{mode} not found in palette.ts")
        values = {}
        for key, raw in re.findall(r"(\w+):\s*([^\n]+?),?\s*$", block.group(1), re.M):
            raw = raw.strip().rstrip(",")
            if raw.startswith("tractusx."):
                values[key] = brand[raw.split(".", 1)[1]]
            else:
                values[key] = raw.strip("'\"")
        ui[mode] = values
    theme = (src / "theme.ts").read_text(encoding="utf-8")
    typography = (src / "typography.ts").read_text(encoding="utf-8")
    radius = re.search(r"export const RADIUS = (\d+)", theme)
    button = re.search(r"export const BUTTON_RADIUS = (\d+)", theme)
    font = re.search(r"export const fontFamily = '([^']+)'", typography)
    if not (radius and button and font):
        sys.exit("mockup.py: RADIUS, BUTTON_RADIUS (theme.ts) or fontFamily (typography.ts) not found")
    return {"brand": brand, "ui": ui, "radius": int(radius.group(1)), "button": int(button.group(1)),
            "font": font.group(1)}


def kebab(name: str) -> str:
    return re.sub(r"(?<!^)(?=[A-Z])", "-", name).lower()


def tokens_css() -> str:
    t = read_theme()
    b, ui = t["brand"], t["ui"]
    orange = b["orange"]
    lines = [header(), "/* Generated by mockup.py sync from libs/shared/ui-mui/src/theme (palette.ts, theme.ts, typography.ts).",
             "   Do not edit: change the theme of the portal and run `mockup.py sync <feature>`. */",
             '@import url("../../../node_modules/@fontsource-variable/manrope/index.css");', "", ":root {"]
    lines += [f"  --tx-{key}: {value};" for key, value in b.items()]
    lines += [
        f"  --radius: {t['radius']}px;",
        f"  --button-radius: {t['button']}px;",
        f"  --chip-radius: {t['button'] // 2}px;",
        f"  --font: {t['font']};",
        "  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;",
        f"  --accent-tint: {rgba(orange, 0.15)};",
        f"  --accent-hover: {rgba(orange, 0.08)};",
        f"  --hero-glow: 0 0 32px {rgba(orange, 0.12)};",
        "  --backdrop: rgba(0, 0, 0, 0.7);",
        "}", "",
    ]
    # Status colours, chip and input borders: MUI defaults, which theme.ts does not override.
    status = {
        "dark": {"success": "#66bb6a", "warning": "#ffa726", "error": "#f44336", "info": "#29b6f6",
                 "chip": "rgba(255, 255, 255, 0.16)", "input-border": "rgba(255, 255, 255, 0.23)"},
        "light": {"success": "#2e7d32", "warning": "#ed6c02", "error": "#d32f2f", "info": "#0288d1",
                  "chip": "rgba(0, 0, 0, 0.08)", "input-border": "rgba(0, 0, 0, 0.23)"},
    }
    for mode, selector in (("dark", ':root,\n[data-theme="dark"]'), ("light", '[data-theme="light"]')):
        dark = mode == "dark"
        lines.append(selector + " {")
        lines.append(f"  color-scheme: {mode};")
        lines.append(f"  --bg: {b['black'] if dark else b['white']};")
        lines.append(f"  --text: {b['white'] if dark else b['black']};")
        lines += [f"  --{kebab(key)}: {value};" for key, value in ui[mode].items()]
        lines.append(f"  --active: {b['orange'] if dark else b['black']};")
        lines.append(f"  --link: {b['orange'] if dark else b['black']};")
        for key, value in status[mode].items():
            lines.append(f"  --{key}: {value};")
        for key in ("success", "warning", "error", "info"):
            lines.append(f"  --{key}-tint: {rgba(status[mode][key], 0.12)};")
        lines.append("}")
        lines.append("")
    return "\n".join(lines)


# ── navigation from apps/portal/src/features ────────────────────────────────

def _field(text: str, name: str) -> str | None:
    found = re.search(rf"\b{name}:\s*'((?:[^'\\]|\\.)*)'", text)
    return found.group(1).replace("\\'", "'") if found else None


def read_nav() -> list[dict]:
    features = repo() / "apps/portal/src/features"
    main = (features / "main.tsx").read_text(encoding="utf-8")
    block = re.search(r"export const allFeatures[^=]*=\s*\[(.*?)\n\];", main, re.S)
    if not block:
        sys.exit("mockup.py: `export const allFeatures` not found in apps/portal/src/features/main.tsx")
    imports = dict(re.findall(r"import \{ (\w+) \} from '\./([\w-]+)/routes';", main))
    nav = []
    upcoming = re.compile(r"upcoming\(\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*'([\w-]+)',\s*<(\w+?)Icon\s*/>,"
                          r"\s*'([^']+)',\s*'([^']+)',?\s*\)", re.S)
    pos = 0
    text = block.group(1)
    token = re.compile(r"upcoming\(|\b(\w+Feature)\b")
    while (found := token.search(text, pos)):
        if found.group(0) == "upcoming(":
            entry = upcoming.match(text, found.start())
            if not entry:
                sys.exit(f"mockup.py: cannot read the upcoming(...) entry near: {text[found.start():found.start() + 80]!r}")
            name, description, category, icon, path, _version = entry.groups()
            nav.append({"name": name.replace("\\'", "'"), "description": description.replace("\\'", "'"),
                        "category": category, "icon": icon, "path": path, "disabled": True})
            pos = entry.end()
            continue
        variable = found.group(1)
        pos = found.end()
        folder = imports.get(variable)
        if not folder:
            continue
        routes = (features / folder / "routes.tsx").read_text(encoding="utf-8")
        icon = re.search(r"\bicon:\s*<(\w+?)Icon\s*/>", routes)
        disabled = re.search(r"\bdisabled:\s*(true|false)", routes)
        poc = re.search(r"\bstage:\s*'poc'", routes)
        nav.append({"name": _field(routes, "name") or variable, "description": _field(routes, "description") or "",
                    "category": _field(routes, "category") or "", "icon": icon.group(1) if icon else "AppsOutlined",
                    "path": _field(routes, "navigationPath") or "/",
                    "disabled": bool(disabled and disabled.group(1) == "true") or bool(poc)})
    return nav


def nav_js(hub: str) -> str:
    path, name, icon = meta(hub, "path", "/"), meta(hub, "nav-name"), meta(hub, "nav-icon")
    nav = read_nav()
    mine = next((item for item in nav if item["path"] == path), None)
    if mine is None:
        nav.append({"name": name or meta(hub, "title"), "description": "", "category": "", "icon": icon or "AppsOutlined",
                    "path": path, "disabled": False})
    else:
        mine["disabled"] = False
        if icon:
            mine["icon"] = icon
        if name:
            mine["name"] = name
    rows = ",\n".join(
        "  { name: %s, path: %s, icon: %s, disabled: %s }" % (js(item["name"]), js(item["path"]), js(item["icon"]),
                                                            "true" if item["disabled"] else "false")
        for item in nav)
    return (header() + "\n// Generated by mockup.py sync from apps/portal/src/features/main.tsx: the navigation of the portal,"
            f"\n// with this mockup's feature ({path}) enabled. Do not edit: run `mockup.py sync <feature>`.\n"
            f"window.MOCK_NAV = [\n{rows},\n];\n")


def js(value: str) -> str:
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"


# ── icons from @mui/icons-material ──────────────────────────────────────────

SHAPE = re.compile(r'\("(path|circle|rect|ellipse)",\s*\{(.*?)\}', re.S)
ATTR = re.compile(r'(\w+):\s*(?:"([^"]*)"|([\d.]+))')


def icon_svg(name: str) -> str | None:
    source = repo() / "node_modules/@mui/icons-material" / f"{name}.js"
    if not source.is_file():
        return None
    shapes = []
    for tag, attrs in SHAPE.findall(source.read_text(encoding="utf-8")):
        parts = []
        for key, text, number in ATTR.findall(attrs):
            if key in ("children", "key"):
                continue
            parts.append(f'{kebab(key)}="{text or number}"')
        shapes.append(f"<{tag} {' '.join(parts)}/>")
    return "".join(shapes) or None


def used_icons(folder: Path, hub: str) -> set[str]:
    names = set(SHELL_ICONS)
    for item in read_nav():
        names.add(item["icon"])
    if meta(hub, "nav-icon"):
        names.add(meta(hub, "nav-icon"))
    for file in folder.rglob("*"):
        if file.suffix in (".html", ".js") and file.name != "icons.js":
            text = file.read_text(encoding="utf-8")
            names.update(re.findall(r'data-icon="(\w+)"', text))
            names.update(re.findall(r"icon\(\s*'(\w+)'", text))
    return names


def existing_icons(path: Path) -> dict[str, str]:
    if not path.is_file():
        return {}
    return dict(re.findall(r"^  (\w+): '(.*)',$", path.read_text(encoding="utf-8"), re.M))


def icons_js(folder: Path, hub: str) -> tuple[str, list[str]]:
    current = existing_icons(folder / "shared/icons.js")
    icons, missing = {}, []
    for name in sorted(used_icons(folder, hub)):
        svg = icon_svg(name) or current.get(name)
        if svg:
            icons[name] = svg
        else:
            missing.append(name)
    rows = "\n".join(f"  {name}: '{svg}'," for name, svg in icons.items())
    notes = (" *\n * The SVG shapes are copied from @mui/icons-material (MIT, Copyright (c) 2014 Call-Em-All),\n"
             " * the Material Icons of Google (Apache-2.0), a dependency of the portal (DEPENDENCIES).\n")
    text = (header(spdx="Apache-2.0 AND CC0-1.0 AND MIT", notes=notes)
            + "\n// Generated by mockup.py sync: every icon the shell and this mockup use (data-icon=\"Name\", mock.icon('Name')),\n"
            "// named like @mui/icons-material without the Icon suffix. Do not edit: run `mockup.py sync <feature>`.\n"
            f"window.MOCK_ICONS = {{\n{rows}\n}};\n")
    return text, missing


def sync(feature: str, quiet: bool = False) -> list[str]:
    folder = need(feature)
    hub = (folder / "index.html").read_text(encoding="utf-8")
    write_generated(folder / "shared/tokens.css", tokens_css())
    write_generated(folder / "shared/nav.js", nav_js(hub))
    text, missing = icons_js(folder, hub)
    write_generated(folder / "shared/icons.js", text)
    if missing and not quiet:
        where = "node_modules is missing: run npm ci, then sync again" if not (repo() / "node_modules").is_dir() \
            else "no such file in node_modules/@mui/icons-material"
        print(f"  icons not found ({where}): {', '.join(missing)}")
    return missing


# ── new, view, options ──────────────────────────────────────────────────────

def parse_view(value: str) -> tuple[str, str]:
    slug, _, title = value.partition(":")
    if not SLUG.match(slug):
        sys.exit(f"mockup.py: view {slug!r}: use kebab-case, e.g. applications or review-case")
    return slug, title.strip() or slug.replace("-", " ").capitalize()


def template(name: str) -> str:
    return (TEMPLATES / name).read_text(encoding="utf-8")


def fragment(name: str) -> str:
    """A template without its license comment (it is inserted into a file that has one)."""
    return re.sub(r"\A<!--.*?-->\n", "", template(name), flags=re.S)


def add_view(feature: str, slug: str, title: str, values: dict[str, str]) -> None:
    folder = mockup_dir(feature)
    hub_path = folder / "index.html"
    hub = hub_path.read_text(encoding="utf-8")
    if f'id="view-{slug}"' in hub:
        print(f"  kept     view {slug} (already in the hub)")
    else:
        n = len(re.findall(r'<section class="hub-view" id=', hub)) + 1
        section = fill(fragment("view-section.html"), {**values, "VIEW_SLUG": slug, "VIEW_TITLE": html.escape(title), "N": str(n)})
        toc = f'      <a href="#view-{slug}"><span class="hub-num">{n}</span>{html.escape(title)}</a>\n'
        hub = hub.replace("      <section class=\"hub-next\">", section + "\n      <section class=\"hub-next\">", 1)
        hub = hub.replace("      <div class=\"hub-toc__sep\"></div>", toc + "      <div class=\"hub-toc__sep\"></div>", 1)
        hub_path.write_text(hub, encoding="utf-8")
        print(f"  updated  {hub_path.relative_to(repo())} (view {slug})")
    write_new(folder / "views" / f"{slug}.html",
              fill(template("view.html"), {**values, "VIEW_SLUG": slug, "VIEW_TITLE": html.escape(title)}))


def values_from_hub(hub: str) -> dict[str, str]:
    return {"FEATURE_TITLE": html.escape(meta(hub, "title")), "MODULE": meta(hub, "module"),
            "ACTIVE_PATH": meta(hub, "path", "/"), "STATES": meta(hub, "states", DEFAULT_STATES)}


def cmd_new(args) -> int:
    if not SLUG.match(args.feature):
        sys.exit("mockup.py: the feature name is kebab-case, e.g. onboarding or connectors")
    if not args.path.startswith("/"):
        sys.exit("mockup.py: --path is the navigation path of the feature, e.g. /onboarding")
    folder = mockup_dir(args.feature)
    print(f"mockups/{args.feature}/")
    values = {"FEATURE": args.feature, "FEATURE_TITLE": html.escape(args.title), "MODULE": args.module,
              "ACTIVE_PATH": args.path, "NAV_NAME": html.escape(args.name or ""), "NAV_ICON": args.icon or "",
              "STATES": args.states, "DATE": _dt.date.today().isoformat(), "TOC": "", "VIEW_SECTIONS": ""}
    write_new(folder / "index.html", fill(template("hub.html"), values))
    for name in ("shell.css", "shell.js", "hub.css", "data.js"):
        write_new(folder / "shared" / name, template(f"shared/{name}"))
    for view in args.view or []:
        slug, title = parse_view(view)
        add_view(args.feature, slug, title, values)
    sync(args.feature)
    print(f"\nNext: build each view in mockups/{args.feature}/views/, then `mockup.py check {args.feature}` and "
          f"`mockup.py open {args.feature}`.")
    return 0


def cmd_view(args) -> int:
    folder = need(args.feature)
    slug, title = parse_view(args.view)
    add_view(args.feature, slug, title, values_from_hub((folder / "index.html").read_text(encoding="utf-8")))
    sync(args.feature, quiet=True)
    return 0


def cmd_options(args) -> int:
    folder = need(args.feature)
    hub_path = folder / "index.html"
    hub = hub_path.read_text(encoding="utf-8")
    section = re.search(rf'<section class="hub-view" id="view-{re.escape(args.view)}".*?</section>', hub, re.S)
    if not section:
        sys.exit(f"mockup.py: no view {args.view!r} in the hub; add it with: mockup.py view {args.feature} {args.view}")
    title = re.search(r'<h2 class="tx-h2">(.*?)</h2>', section.group(0))
    name = f"{args.view}-options.html"
    values = {**values_from_hub(hub), "VIEW_SLUG": args.view, "VIEW_TITLE": title.group(1) if title else args.view}
    write_new(folder / "options" / name, fill(template("options.html"), values))
    if f'href="options/{name}"' not in section.group(0):
        card = (f'          <a class="hub-card" href="options/{name}">\n'
                f'            <span class="hub-card__frame"><iframe src="options/{name}" title="Options" loading="lazy" tabindex="-1"></iframe></span>\n'
                '            <span class="hub-card__name">Options</span>\n          </a>\n')
        updated = section.group(0).replace("        </div>\n        <div class=\"hub-columns\">",
                                           card + "        </div>\n        <div class=\"hub-columns\">", 1)
        hub_path.write_text(hub.replace(section.group(0), updated), encoding="utf-8")
        print(f"  updated  {hub_path.relative_to(repo())} (options of {args.view})")
    return 0


def cmd_sync(args) -> int:
    missing = sync(args.feature)
    return 1 if missing else 0


# ── check ───────────────────────────────────────────────────────────────────

EXTERNAL = [
    (re.compile(r"<(?:script|img|iframe|source|video|audio|embed)\b[^>]*\bsrc\s*=\s*[\"']?(?:https?:)?//", re.I), "loads a resource from the network"),
    (re.compile(r"<link\b[^>]*\bhref\s*=\s*[\"']?(?:https?:)?//", re.I), "loads a stylesheet or font from the network"),
    (re.compile(r"url\(\s*[\"']?(?:https?:)?//", re.I), "url() from the network"),
    (re.compile(r"@import\s+(?:url\()?\s*[\"']?(?:https?:)?//", re.I), "@import from the network"),
    (re.compile(r"\bfetch\(\s*[\"'`]https?:", re.I), "fetch() to the network"),
]
PLACEHOLDER = re.compile(r"lorem ipsum|\bItem \d+\b|John Doe|Jane Doe|\bAcme\b|example\.(?:com|org)|\bfoo\b|\bTODO\b", re.I)
COLOUR = re.compile(r"#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(")
GRADIENT = re.compile(r"gradient\([^;]*\)", re.I)
ORANGE = re.compile(r"--tx-orange|#FAA023|#F99407|#ED8C05|#C37304|#FBAC3F|#FBB24D|#FCC477", re.I)
GREEN = re.compile(r"--tx-green|#AFC72D", re.I)


def visible_text(text: str) -> str:
    text = re.sub(r"<!--.*?-->", " ", text, flags=re.S)
    text = re.sub(r"<(script|style)\b.*?</\1>", " ", text, flags=re.S | re.I)
    return re.sub(r"<[^>]+>", " ", text)


def style_parts(file: Path, text: str) -> list[str]:
    if file.suffix == ".css":
        return [re.sub(r"/\*.*?\*/", " ", text, flags=re.S)]
    blocks = re.findall(r"<style\b[^>]*>(.*?)</style>", text, re.S | re.I)
    attrs = re.findall(r'\bstyle\s*=\s*"([^"]*)"', text, re.I)
    return [re.sub(r"/\*.*?\*/", " ", b, flags=re.S) for b in blocks] + attrs


def cmd_check(args) -> int:
    folder = need(args.feature)
    hub = (folder / "index.html").read_text(encoding="utf-8")
    errors: list[str] = []
    warnings: list[str] = []
    files = sorted(p for p in folder.rglob("*") if p.is_file() and p.suffix in (".html", ".css", ".js"))
    for file in files:
        rel = file.relative_to(folder)
        text = file.read_text(encoding="utf-8")
        head = text[:2500]
        if "Copyright (c)" not in head or "SPDX-License-Identifier" not in head:
            errors.append(f"{rel}: license header missing (Copyright + SPDX-License-Identifier, TRG 7.02)")
        for pattern, why in EXTERNAL:
            if pattern.search(text):
                errors.append(f"{rel}: {why}; a mockup is self-contained (inline it or reference a file of the repository)")
        for part in style_parts(file, text):
            for gradient in GRADIENT.findall(part):
                if ORANGE.search(gradient) and GREEN.search(gradient):
                    errors.append(f"{rel}: a gradient mixes orange and green (Design Guidelines: never one gradient)")
            if file.name != "tokens.css" and COLOUR.search(part):
                warnings.append(f"{rel}: colour literal in styles; use the var(--…) tokens of shared/tokens.css")
        if file.suffix == ".html":
            if not re.search(r'<meta name="viewport"', text):
                errors.append(f"{rel}: <meta name=\"viewport\"> missing (phones)")
            if not re.search(r"<title>[^<]+</title>", text):
                errors.append(f"{rel}: <title> missing")
            words = visible_text(text)
            if PLACEHOLDER.search(words):
                errors.append(f"{rel}: placeholder text ({PLACEHOLDER.search(words).group(0)!r}); use the data of shared/data.js")
            if re.search(r"(?<!Eclipse )(?<!Eclipse\n)Tractus-X", re.sub(r"\s+", " ", words)):
                warnings.append(f"{rel}: write \"Eclipse Tractus-X\", not \"Tractus-X\" alone (Design Guidelines)")
            if re.search(r"\son[a-z]+\s*=\s*[\"']", text):
                warnings.append(f"{rel}: inline event handler (onclick=…); use mock.on() or addEventListener")
            for img in re.findall(r"<img\b[^>]*>", text, re.I):
                if not re.search(r"\balt\s*=", img):
                    warnings.append(f"{rel}: <img> without alt")
            if file.parent.name == "views":
                variants = re.findall(r'data-variant="([\w-]+):([\w-]+)"', text)
                if not variants:
                    warnings.append(f"{rel}: no configurator; give the parts of the screen alternatives with "
                                    "data-variant=\"<dimension>:<value>\" (the default for every view)")
                values: dict[str, set[str]] = {}
                for key, value in variants:
                    values.setdefault(key, set()).add(value)
                for key, found in sorted(values.items()):
                    if len(found) < 2:
                        warnings.append(f"{rel}: configurator dimension {key!r} has only one value; add an alternative or drop it")
            if "data-todo" in text and file.parent.name in ("views", "options", folder.name):
                warnings.append(f"{rel}: starter content left (elements with data-todo); replace it and drop the attribute")
    for sub in ("views", "options"):
        for page in sorted((folder / sub).glob("*.html")) if (folder / sub).is_dir() else []:
            if f'href="{sub}/{page.name}"' not in hub:
                warnings.append(f"{sub}/{page.name}: not linked from index.html")
    for name, generated in (("tokens.css", tokens_css()), ("nav.js", nav_js(hub))):
        path = folder / "shared" / name
        if not path.is_file() or path.read_text(encoding="utf-8") != generated:
            warnings.append(f"shared/{name}: out of date with the portal; run mockup.py sync {args.feature}")
    _, missing = icons_js(folder, hub)
    current = existing_icons(folder / "shared/icons.js")
    for name in sorted(used_icons(folder, hub)):
        if name not in current:
            warnings.append(f"icon {name}: used but not in shared/icons.js; run mockup.py sync {args.feature}")
    for name in missing:
        errors.append(f"icon {name}: not in @mui/icons-material (check the name, without the Icon suffix)")
    for message in errors:
        print(f"ERROR    {message}")
    for message in warnings:
        print(f"warning  {message}")
    print(f"\nmockups/{args.feature}: {len(files)} files, {len(errors)} errors, {len(warnings)} warnings")
    return 1 if errors or (args.strict and warnings) else 0


# ── status, open, serve ─────────────────────────────────────────────────────

def views_of(hub: str) -> list[dict]:
    views = []
    for section in re.finditer(r'<section class="hub-view"[^>]*data-view="([^"]+)"[^>]*data-status="([^"]+)"[^>]*>(.*?)</section>',
                               hub, re.S):
        slug, status, body = section.groups()
        title = re.search(r'<h2 class="tx-h2">(.*?)</h2>', body)
        decision = re.search(r'<p class="hub-decision" data-decision>(.*?)</p>', body, re.S)
        views.append({"slug": slug, "status": status, "title": html.unescape(title.group(1)) if title else slug,
                      "open": len(re.findall(r"<li data-open", body)),
                      "decision": re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", decision.group(1)))).strip() if decision else ""})
    return views


def cmd_status(args) -> int:
    root = repo() / "mockups"
    features = [args.feature] if args.feature else sorted(p.name for p in root.iterdir() if (p / "index.html").is_file()) \
        if root.is_dir() else []
    if not features:
        print("No mockups yet (mockups/<feature>/index.html). Create one with: mockup.py new <feature> ...")
        return 0
    not_ready = False
    for feature in features:
        hub = need(feature).joinpath("index.html").read_text(encoding="utf-8")
        views = views_of(hub)
        print(f"{feature}  ({meta(hub, 'title')}, module {meta(hub, 'module') or '?'}, path {meta(hub, 'path')})")
        for view in views:
            note = f" — {view['decision']}" if view["decision"] else ""
            print(f"  {view['status']:<9} {view['slug']:<24} {view['open']} open question(s){note}")
            not_ready |= view["status"] == "open"
        if not views:
            print("  no views yet: mockup.py view <feature> <slug>:<Title>")
            not_ready = True
    if args.ready and not_ready:
        print("\nNot ready for the proof of concept: decide or defer every open view first.")
        return 1
    return 0


def cmd_open(args) -> int:
    folder = need(args.feature)
    target = folder / "views" / f"{args.view}.html" if args.view else folder / "index.html"
    if not target.is_file():
        sys.exit(f"mockup.py: {target.relative_to(repo())} does not exist")
    print(target)
    opener = "open" if sys.platform == "darwin" else "xdg-open" if shutil.which("xdg-open") else None
    if opener:
        subprocess.run([opener, str(target)], check=False)
    else:
        webbrowser.open(target.as_uri())
    return 0


def cmd_serve(args) -> int:
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(repo()))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"Serving the repository on http://localhost:{args.port}/mockups/ (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="mockup.py", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("new", help="scaffold mockups/<feature>/")
    p.add_argument("feature", help="kebab-case folder name, e.g. onboarding")
    p.add_argument("--title", required=True, help="the feature as the person reads it, e.g. Onboarding")
    p.add_argument("--module", required=True, help="the backend module, e.g. c1-m2")
    p.add_argument("--path", required=True, help="navigation path, e.g. /onboarding (an entry of features/main.tsx or a new one)")
    p.add_argument("--name", help="name in the navigation, when the path is not in features/main.tsx yet")
    p.add_argument("--icon", help="@mui/icons-material name without Icon, e.g. AppRegistrationOutlined")
    p.add_argument("--view", action="append", help="slug[:Title], repeatable")
    p.add_argument("--states", default=DEFAULT_STATES, help=f"state buttons of every view (default {DEFAULT_STATES})")
    p.set_defaults(func=cmd_new)
    p = sub.add_parser("view", help="add a view")
    p.add_argument("feature")
    p.add_argument("view", help="slug[:Title]")
    p.set_defaults(func=cmd_view)
    p = sub.add_parser("options", help="add an option page to a view")
    p.add_argument("feature")
    p.add_argument("view", help="slug of the view")
    p.set_defaults(func=cmd_options)
    p = sub.add_parser("sync", help="regenerate shared/tokens.css, nav.js, icons.js from the portal")
    p.add_argument("feature")
    p.set_defaults(func=cmd_sync)
    p = sub.add_parser("check", help="check the rules of the skill")
    p.add_argument("feature")
    p.add_argument("--strict", action="store_true", help="exit 1 on warnings too")
    p.set_defaults(func=cmd_check)
    p = sub.add_parser("status", help="views and their decisions")
    p.add_argument("feature", nargs="?")
    p.add_argument("--ready", action="store_true", help="exit 1 while a view is still open")
    p.set_defaults(func=cmd_status)
    p = sub.add_parser("open", help="open the hub or a view in the browser")
    p.add_argument("feature")
    p.add_argument("view", nargs="?")
    p.set_defaults(func=cmd_open)
    p = sub.add_parser("serve", help="serve the repository on localhost (fonts and icons load like in the app)")
    p.add_argument("--port", type=int, default=4290)
    p.set_defaults(func=cmd_serve)
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
