<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation
 AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified the content.
 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# Access control: backend integration

The access control feature (`access-control`) integrates **C2-M2 Users and App Access**, **C2-M3 Technical Users**, and **C2-M5 Portal IAM**.

## Runtime modes and login configuration

- **Backend mode (default)**: uses `createCoreModules(config)` with the HTTP adapters of `@dataspace-mgm/c2-m2-core` and `@dataspace-mgm/c2-m3-core` and BFF session endpoints (`/me`, `/auth/login`, `/auth/logout`).
- **In-memory mode (`VITE_USE_MOCKS=true`)**: uses `createMockCoreModules()` with the in-memory repositories of `@dataspace-mgm/c2-m2-core/testing` and `@dataspace-mgm/c2-m3-core/testing`.
- **Login mode toggle**: on `/access-control/iam` or `/mock-eudi-sign-in`, operators can switch between:
  - **Standard backend login (`/auth/login`)**: delegates authentication to the BFF `/auth/login` endpoint.
  - **EUDI Wallet sign-in (`/mock-eudi-sign-in`)**: presents the EUDI Wallet account sign-in flow.
  - **Spec-compliant `/me` session response**: resolves `/me` from the C2-M5 `PersonAccessTokenClaims` wire structure when running without a live Portal IAM server.

## Live verification status (2026-11-06)

Verified against the sibling backend checkout (`../dataspace-mgm-services`) with its test Portal IAM (`docker compose up -d`, Keycloak on :8080) and `IAM_URL=http://localhost:8080/auth uvicorn --factory scaffold.app:create_app --port 8000`:

- `/health` returns `{"status":"UP","osp":"OSP A"}`; tokens via `iam/test/get-token.py` validate; the dev BFF signs in `pia` and `/me` contains all C2-M2/C2-M3 permission keys.
- Every C2-M2 and C2-M3 company-facing operation returns `501 urn:c2-m:problem:not-implemented` from the backend stand-ins. The UI was not generated from these: the modules were built from the vendored specs (backend spec commit `76587a6`), and the 501 responses are surfaced as failure results with the Problem Details type preserved.
- No happy-path result state can be exercised against this backend. That is P0 backend work; until then the feature stays behind the POC gate.

## End-to-end operations

- **C2-M2 Company Users**: list (`GET /companies/{companyId}/users`), detail (`GET /companies/{companyId}/users/{userId}`), portal role replacement (`PUT /companies/{companyId}/users/{userId}/portal-roles`), removal (`DELETE /companies/{companyId}/users/{userId}`), invitations (`GET/POST /companies/{companyId}/invitations`, `DELETE /companies/{companyId}/invitations/{invitationId}`), invitation acceptance (`POST /invitations/accept`), and app roles (`GET /companies/{companyId}/apps/{appId}/roles`, `PUT /companies/{companyId}/users/{userId}/apps/{appId}/roles`).
- **C2-M3 Technical Users**: list (`GET /companies/{companyId}/technical-users`), detail (`GET /companies/{companyId}/technical-users/{technicalUserId}`), assignable roles (`GET /companies/{companyId}/assignable-roles`), creation (`POST /companies/{companyId}/technical-users`), update (`PATCH /companies/{companyId}/technical-users/{technicalUserId}`), credential rotation (`POST /companies/{companyId}/technical-users/{technicalUserId}/credentials/rotate`), and deletion (`DELETE /companies/{companyId}/technical-users/{technicalUserId}`).
- **One-time secrets**: invitation codes and technical user credentials are delivered via transient component callbacks and never stored in Redux state or URLs.

## Backend backlog (prioritised for the backend team)

**P0 — blocks every result state except the failure path**

1. Implement the C2-M2 company-facing stand-in operations: users list/detail, portal-role replacement, user removal, invitations list/create/revoke, app roles. All return `501 not-implemented` today.
2. Implement the C2-M3 company-facing stand-in operations: technical users list/detail, assignable roles, create, update, credential rotation, delete (incl. the 202 deletion-pending vs 204 done distinction the UI maps).
3. Confirm the test persons' tokens actually carry the C2-M2/C2-M3 permission keys in `resource_access.portal-core.roles` (verified for `pia`; other personas and OSP B not yet checked).

**P1 — blocks real invitations and the production sign-in contract**

4. Invitation delivery channel: how the single-use code reaches the invitee (recommended URL fragment) and the acceptance flow with sign-in continuity and session refresh (`POST /invitations/accept` acts on the signed-in account).
5. Resolve the C2-M5 §7.2 browser-OIDC vs BFF seam with the IAM/BFF owners: production session, CSRF, refresh and `/me` contract. The dev BFF is only a test-person stand-in.
6. C2-M2 invitation response model: the contract allows kinds/statuses the current invitation port cannot represent (the HTTP adapter fails explicitly rather than inventing values). Agree a company-invitation-restricted shape or extend the port.
7. Ensure the last-Company-Admin conflict (`urn:c2-m2:problem:last-company-admin`), owner-only technical-user changes and a 404 Problem Details for foreign companies are all observable for UI testing.

**P2 — polish dependent on real data**

8. Pagination, sorting and filter parameters of the real list endpoints vs the UI's current assumptions.
9. German/English display names for portal and technical roles coming from the API rather than fixtures.
10. SSE or another agreed live-update channel for user/technical-user changes (no polling in the UI).
