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

## End-to-end operations

- **C2-M2 Company Users**: list (`GET /companies/{companyId}/users`), detail (`GET /companies/{companyId}/users/{userId}`), portal role replacement (`PUT /companies/{companyId}/users/{userId}/portal-roles`), removal (`DELETE /companies/{companyId}/users/{userId}`), invitations (`GET/POST /companies/{companyId}/invitations`, `DELETE /companies/{companyId}/invitations/{invitationId}`), invitation acceptance (`POST /invitations/accept`), and app roles (`GET /companies/{companyId}/apps/{appId}/roles`, `PUT /companies/{companyId}/users/{userId}/apps/{appId}/roles`).
- **C2-M3 Technical Users**: list (`GET /companies/{companyId}/technical-users`), detail (`GET /companies/{companyId}/technical-users/{technicalUserId}`), assignable roles (`GET /companies/{companyId}/assignable-roles`), creation (`POST /companies/{companyId}/technical-users`), update (`PATCH /companies/{companyId}/technical-users/{technicalUserId}`), credential rotation (`POST /companies/{companyId}/technical-users/{technicalUserId}/credentials/rotate`), and deletion (`DELETE /companies/{companyId}/technical-users/{technicalUserId}`).
- **One-time secrets**: invitation codes and technical user credentials are delivered via transient component callbacks and never stored in Redux state or URLs.
