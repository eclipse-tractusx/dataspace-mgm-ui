<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# @dataspace-mgm/core-http

Shared HTTP set-up of all core packages: `createCoreClient<paths>(config)` (openapi-fetch with the session cookie,
the CSRF token on write requests and a 401 hook), `ensureData`/`ensureOk` (Problem Details → `CoreHttpException`
with status and `type`), `CoreHttpErrorFactory` (errors as plain data) and `CsrfTokenStore` (in memory only).
No framework, no token: the BFF adds the token of the person.
