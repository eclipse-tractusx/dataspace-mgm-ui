<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# @dataspace-mgm/identity-core

Session of the signed-in person at the BFF (frontend architecture 05): `getCurrentSession` (`GET /me`, keeps the CSRF
token), `login` (leaves the app for `/auth/login?return_to=…`) and `logout` (`POST /auth/logout`). The type of
`GET /me` is written by hand until the BFF has an OpenAPI. During `npm start` the dev BFF of
[apps/portal/dev-bff](../../apps/portal/dev-bff/dev-bff.ts) answers these endpoints.
