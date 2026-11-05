<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation
 AI Disclosure: This file was entirely AI-generated; the AI-generated portions are CC0-1.0.
 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# ui-mui

The only library of the workspace that imports MUI (`@dataspace-mgm/ui-mui`). Its theme implements the
**Eclipse Tractus-X Design Guidelines v1.0** (September 2026), the same tokens as
[eclipse-tractusx.github.io](https://eclipse-tractusx.github.io).

| Guideline | In the theme |
|---|---|
| Primary orange `#FAA023` for accents and interactive elements only; hover `#F99407`, tints `#FBAC3F` … `#FCC477`, `#C37304` | `palette.primary`, `tractusx.orange*` |
| Logo green `#AFC72D` for supporting graphics only, never in one gradient with orange | `tractusx.green` (status dot of the environment chip) |
| Black `#000000`, Eclipse Tractus-X gray `#1E1E1E`, secondary button gray `#232323`, `#626262`, navbar `#F0F0F0` | `palette.background`, `palette.secondary`, `palette.ui` |
| Neutrals per theme: background, navbar, text, muted `#00000099`, card border 30 % | `uiTokens.dark` / `uiTokens.light` |
| Manrope 400 body, 500 subheads and buttons, 700 labels, 800 titles; fallback Inter, Arial | [theme/typography.ts](src/theme/typography.ts), `@fontsource-variable/manrope` |
| Buttons: radius 8 px, padding 14 px 24 px, weight 500; primary orange with black text, secondary `#232323` with white text | `MuiButton` |
| Cards: radius 10 px, 30 % border, generous padding; glow `0 0 12px rgba(255,255,255,.5)` for the space feeling | `MuiCard`, `palette.ui.glow` |
| Brand gradient (option 1) for title pages and banners; text on the dark field only | `BrandBackdrop` |
| The mark from the SVG source, never recoloured; the name is always "Eclipse Tractus-X" | `TractusXLogo` |

Black is the default; the light mode uses the light tokens of the same table and is remembered in local storage.

Accessibility (WCAG AA, slide 25): orange is not used as text colour on white; in the light theme the active sidebar item
is black and decorative icons use `#C37304`.

Assets: [logo_tractus-x.svg](src/assets/logo_tractus-x.svg) from eclipse-tractusx.github.io and
[tractusx-gradient.jpg](src/assets/tractusx-gradient.jpg) from the design guidelines, both CC-BY-4.0 (see the
`.license` files).
