<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation
 AI Disclosure: This file was entirely AI-generated; the AI-generated portions are CC0-1.0.
 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# ui-mui

The only library of the workspace that imports MUI (`@dataspace-mgm/ui-mui`). It holds:

- the Tractus-X theme ([src/theme](src/theme)): black and white base, golden `#FFA600` and green `#B3CB2D` accents,
  Libre Franklin, rounded buttons, light and dark palettes;
- `ColorModeProvider` / `useColorMode`: light or dark, from the system preference, remembered in local storage;
- brand pieces: `BrandStripe` (the golden-to-green line), `DataspaceMark`;
- re-exports of the MUI components and icons the apps use. Add one here when a feature needs it, or replace a
  re-export by a wrapper once the component needs Tractus-X specific behaviour.

Golden and green have a low contrast on white: use them as fills, borders and accents with black text on top, not as
text colour on white (WCAG 2.1, TRG 9.01).
