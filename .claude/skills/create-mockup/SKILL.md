---
name: create-mockup
description: Phase 1 of 3 (mockup → proof of concept → feature). Design new portal screens as standalone, clickable HTML mockups in mockups/<feature>/ that look exactly like the Dataspace Management portal (shell, Eclipse Tractus-X tokens, icons and navigation generated from the code), filled with the real test data and the field names of the backend spec, organised by view with options and open questions, and decided one view at a time. Use for "mock up the onboarding screens", "how could the review page look", "show me two options for X", "prototype a new feature before we build it", "a design to discuss with the team or the backend", or whenever a feature has no decided design yet. Next phase - build-poc.
---

<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 See the NOTICE file(s) distributed with this work for additional
 information regarding copyright ownership.

 This program and the accompanying materials are made available under the
 terms of the Apache License, Version 2.0 which is available at
 https://www.apache.org/licenses/LICENSE-2.0.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations
 under the License.

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the code is correct.

 SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# Create a mockup (phase 1 of 3)

A feature of the portal is built in three phases, one skill each:

| Phase | Skill | Result | Decided |
|---|---|---|---|
| 1 Mockup | `create-mockup` | clickable HTML in `mockups/<feature>/`, no build, opens from the file system | what the person sees and does, per view |
| 2 Proof of concept | `build-poc` | the feature in the real app on mock data (`stage: 'poc'`, `VITE_USE_MOCKS=true`) | the components, the use cases, the fixtures |
| 3 Feature | `build-feature` | the feature against its backend module, open for everyone | the contract with the backend |

A mockup is cheap to change and cheap to throw away; React code and an agreed API are not. So the questions *what is on
the screen* and *what does the person do* are answered here, before anyone writes a component or asks the backend team
for a field.

```bash
M=.claude/skills/create-mockup/scripts/mockup.py
$M new onboarding --title Onboarding --module c1-m3 --path /onboarding \
   --view review-cases:"Review cases" --view review-case:"Review case"   # hub + views + shared/
$M view onboarding decision:"Decision"         # one more view (page, hub section, table of contents)
$M options onboarding review-case              # options page for ONE open question of a view
$M sync onboarding                             # tokens, navigation and icons again from the portal code
$M check onboarding                            # the rules below; exit 1 on an error (--strict: also warnings)
$M open onboarding [review-case]               # open in the browser; `$M serve` for http://localhost:4290/mockups/
$M status [onboarding] [--ready]               # open / decided / deferred per view; --ready exits 1 while one is open
```

Python 3.10+, standard library only. `sync` needs `node_modules` (`npm ci`) for the icons.

## What `new` creates

```text
mockups/<feature>/
├── index.html            the hub: one section per view (preview, data from the spec, open questions, decision)
├── views/<view>.html     one screen inside the portal shell, with a state switcher (loaded, empty, loading, error)
├── options/<view>-options.html   2 or 3 answers to one open question, side by side
└── shared/
    ├── tokens.css        generated from libs/shared/ui-mui/src/theme (palette, radii, Manrope), dark and light
    ├── nav.js            generated from apps/portal/src/features/main.tsx, with this feature enabled
    ├── icons.js          generated from @mui/icons-material: the icons the shell and the views use
    ├── shell.css         the shell and the building blocks (tx-card, tx-btn, tx-chip, tx-table, tx-alert, …)
    ├── shell.js          renders header, rail, bottom bar and the mockup bar; helpers in window.mock
    ├── hub.css           the hub and the option pages
    └── data.js           the test data: FRAMEWORK 7a persons and companies, plus this module's objects
```

Never edit the three generated files; change the portal and run `sync`. The other files are yours.

## Workflow

### 1. Understand the job (before any HTML)

1. **Who** opens the feature: test persons and portal roles (FRAMEWORK 7a: Erika applicant, Otto `OSP Admin`, Rolf
   and Renate `OSP Reviewer`, Pia `Company Admin` of the OSP company, …).
2. **What** they get done, in their words, and **where** they come from (sidebar, a notification, a link in another
   feature).
3. **Which module** serves it, and which operations: `portal-spec-sources` (`spec-src.py ops <module>`, the module
   README). Note `operationId`, `x-permission` and scope of each. A screen that needs an operation the spec does not
   have is an open point, not a reason to invent one.
4. **What exists**: the `upcoming(...)` entry of the feature in `apps/portal/src/features/main.tsx` (name, icon, path),
   the pages of `apps/portal/src/features/` (the participants feature is the reference page), and earlier mockups in
   `mockups/`.

### 2. Scaffold and fill the data

1. `mockup.py new <feature> --title … --module … --path … --view …`. Use the `--path` of the `upcoming` entry, so the
   rail marks the right item; for a new entry add `--name` and `--icon` (an `@mui/icons-material` name without `Icon`).
2. Fill `shared/data.js` first: the module's objects shaped like its `openapi.yaml` schemas (camelCase field names,
   the enum values, the module's own test IDs from its README), built on the persons and companies already there.
   This file becomes the fixtures of the proof of concept, so its shapes must be the spec's.

### 3. Build each view

- The shell is drawn by `shell.js`. You write only `<main class="tx-page">`: the overline (feature), the title, the
  content. Copy the structure of the real pages: `tx-card` for panels, `tx-fields` with `tx-label` for read-only data,
  `tx-table` for lists, `tx-chip tx-status tx-status--success` for states, `tx-btn` (primary orange), `--secondary`,
  `--outlined`, `tx-alert--info|warning|error`, `tx-steps` for a wizard, `dialog.tx-dialog` for confirmations.
- **One state per result of the use case.** `data-states="loaded,empty,loading,error"` on `<body>` gives the mockup
  bar a button per state; `data-show-state="empty"` shows an element only in that state. Add the states the operation
  really has (a 403 for a person without the permission, a 409 for a conflict) and show the Problem Details `type`
  (`urn:<module>:problem:<name>`) in the error state.
- **The UI decides nothing.** If a button depends on a rule (may this reviewer approve, is this the second approval),
  the API must return the answer as a flag. Show the button from a flag in `data.js` and list the flag under "Data from
  the spec", or under "Open questions" when the spec does not have it.
- **Phone and both themes.** Below 900 px the rail becomes the bottom bar; check every view narrow. The mockup bar
  switches dark and light; `?theme=light` opens a page in light mode.
- **Interactions** in the page's `<script>`: `mock.on('click', '[data-x]', handler)`, `mock.render('#rows', items, row)`,
  `mock.setState('empty')`, `mock.toast('Saved')`, `mock.date(iso)`, `mock.icon('Name')`. Keep it plain and short:
  this code is thrown away.
- Real words only: the persons, companies, BPNs and IDs of `data.js`, the field labels the page will have. No
  "Item 1", no lorem ipsum, no invented companies.

### 4. Options for what is undecided

For one open question of a view (list or cards? one page or a wizard? where does the decision live?) run
`mockup.py options <feature> <view>` and build two or three answers side by side, each with what it makes easier
(`.pro`) and harder (`.con`, including what the backend would have to provide). One question per options page.

### 5. Check, look, show

1. `mockup.py check <feature>` until there is no error; fix the warnings or say why they stay.
2. Open it (`mockup.py open`), click every button, switch every state, both themes, at desktop and phone width.
3. For the pull request, take screenshots of each view (desktop dark, phone, light) and put them in the description.

### 6. Decide, one view at a time

Walk the person who owns the feature through the hub view by view. For each view record the outcome in its section:

- `data-status="decided"` and `<span class="hub-status">decided</span>`, the choice in
  `<p class="hub-decision" data-decision>Decided 2026-11-06: option B, …</p>`, the losing options stay as the record;
- or `data-status="deferred"` with the reason (not in this iteration, waiting for the backend);
- open questions that belong to the backend go to the module's team: an issue on portal-backend-spec, or the module's
  `OPEN-QUESTIONS.md` in the service. Remove the `data-open` item when it is answered.

`mockup.py status <feature> --ready` exits 0 when no view is open. Then continue with the skill **`build-poc`**.

## The rules (`mockup.py check`)

| Rule | Level | Why |
|---|---|---|
| License header in every `.html`, `.css`, `.js` (the templates carry it) | error | TRG 7.02 |
| No resource from the network (CDN script, Google Fonts, remote image, `@import`, `fetch`) | error | opens offline and from a PR checkout; the tokens and the font come from the repository |
| `<meta name="viewport">` and `<title>` in every page | error | phones; readable tabs |
| No placeholder text (lorem ipsum, "Item 1", John Doe, Acme, example.com, TODO) | error | reviewers cannot judge a screen without its real content |
| No gradient that mixes orange and green | error | Eclipse Tractus-X Design Guidelines |
| No colour literals in styles outside `tokens.css` | warning | the mockup must not drift from the theme |
| "Eclipse Tractus-X", not "Tractus-X" alone, in visible text | warning | Design Guidelines |
| Generated files up to date, every used icon present | warning | run `sync` |
| No inline `onclick=`; `<img>` with `alt` | warning | the same habits as the app |
| No starter content left (`data-todo`) | warning | the scaffold is a starting point, not a design |
| Every page in `views/` and `options/` linked from the hub | warning | the hub is the index reviewers use |

## Conventions

- Feature folder and view slugs in kebab-case; view titles as the page will title them.
- Mockups are committed (`mockups/` is not in the image, see `.dockerignore`) and reviewed in a pull request of their
  own: `docs(mockups): <feature> phase 1`.
- `icons.js` holds path data copied from `@mui/icons-material` (MIT; Material Icons by Google, Apache-2.0), a dependency
  of the portal; its header says so.

## Common pitfalls

| Pitfall | Fix |
|---|---|
| Designing in the abstract, without the spec open | Every value on a screen has an operation and a field, or an open question |
| A screen that decides (shows "Approve" only to "the second reviewer") | Show it from an API flag; the flag goes into the hub |
| Only the happy path | One state per result of the use case, errors with their Problem Details type |
| A new colour, radius or font "just for this screen" | Use the tokens; a missing token is a change to `libs/shared/ui-mui` first |
| Many questions on one options page | One question per page, two or three answers |
| Building a React component "to try it out" | That is phase 2; finish deciding here |

## Done when

- [ ] Every view of the feature has a page in `views/` and a section in the hub with its data from the spec
- [ ] `mockup.py check <feature>` has no error; the remaining warnings are explained
- [ ] Each view was clicked through in both themes and at phone width
- [ ] `mockup.py status <feature> --ready` exits 0: every view decided or deferred, with the decision written down
- [ ] Backend questions are with the module's team (issue or `OPEN-QUESTIONS.md`)
