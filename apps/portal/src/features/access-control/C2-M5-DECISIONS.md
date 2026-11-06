<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation
 AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified the content.
 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# C2-M5: frontend architecture notes

Sources: `portal-backend-spec` commit `76587a6`, `C2-M5-PortalIAM/README.md`, `openapi.yaml`, and `open-points.md`.

## Summary

1. **Read-only realm specification view (`/access-control/iam`)**: C2-M5 defines the Keycloak realm configuration deployed from a versioned realm file (README §§4, 6.6). The portal displays the realm discovery endpoints, session lifetimes, signing algorithms, and identity provider settings alongside interactive sign-in mode controls.
2. **Runtime access workflows in C2-M2 and C2-M3**: Company users, invitations, and app roles are managed through C2-M2; technical users and their service account credentials are managed through C2-M3 (README §§3, 6.5).
3. **BFF-managed session (`/me`, `/auth/login`, `/auth/logout`)**: The browser uses an `HttpOnly` session cookie and receives identity attributes and `portal-core` permissions from `GET /me`. No tokens or client secrets are stored in browser storage.
4. **Configurable login mode**: The sign-in flow supports switching between standard backend login (`/auth/login`), EUDI Wallet sign-in (`/mock-eudi-sign-in`), and spec-compliant `/me` responses matching C2-M5 `PersonAccessTokenClaims`.
