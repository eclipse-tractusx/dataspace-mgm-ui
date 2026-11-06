<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# @dataspace-mgm/c1-m2-core

Framework-free core package of the backend module **C1-M2 Registration**
([spec](../../specs/c1-m2/openapi.yaml), copied from
[portal-backend-spec@76587a6](https://github.com/tx-arena-events/portal-backend-spec/blob/76587a6cf8db3ea81d702e1f6cbff677053bcc85/C1-M2-Registration/openapi.yaml)):
the application of a company at the OSP, filed by the applicant personally, with a verification attestation of the
EBW-Connector (path `EBW`) or supporting documents (path `DOCUMENTS`), for the kinds `ONBOARDING`, `REACTIVATION` and
`TRANSFER`.

**Phase: proof of concept.** The backend module does not exist yet. The package has the use cases, the ports and an
in-memory adapter that behaves like the C1-M2 contract, so that the registration screens can be designed, built on
mock data and later connected without changing the pages. There is no HTTP adapter, no `createC1M2Module` and no
generated code yet (phase 3, skill `build-feature`).

## Use cases

One use case per operation a UI may trigger (reads included). Steps (`/steps/...`) and queries (`/internal/...`) are
for Process Orchestration and other modules and are not here. Every use case returns a result union; `failed` carries
`error: CoreHttpErrorData` (HTTP status and Problem Details `type`) for every answer that is not in the union, e.g.
`upstream-error` (502) or a 403 of an `own` operation.

| Use case (`C1M2Module` key) | Operation | Permission, scope | Result `status` |
|---|---|---|---|
| `listCountries.execute(lang)` | `GET /countries` (`listCountries`) | `register_company`, own | `found` {countries}, `failed` |
| `listIdentifierTypes.execute(countryCode, lang)` | `GET /countries/{countryCode}/identifier-types` | `register_company`, own | `found` {identifierTypes}, `not-found`, `failed` |
| `listCompanyRoles.execute(lang)` | `GET /company-roles` | `register_company`, own | `found` {companyRoles}, `failed` |
| `listAgreements.execute(companyRoles, lang)` | `GET /agreements?companyRole=…` | `register_company`, own | `found` {agreements}, `validation`, `failed` |
| `createApplication.execute(input)` | `POST /applications` | `register_company`, own | `created` {application}, `repeated` {application}, `account-bound`, `open-application-exists` {existingApplicationId}, `attestation-invalid` {reason}, `attestation-mismatch` {fields}, `attestation-used`, `company-not-eligible` {companyStatus}, `company-has-open-application`, `documents-disabled`, `validation` {errors}, `failed` |
| `listOwnApplications.execute(filter)` | `GET /applications` (`listApplications`) | `register_company`, own | `found` {page}, `validation`, `failed` |
| `getOwnApplication.execute(applicationId)` | `GET /applications/{applicationId}` (`getApplication`) | `register_company`, own | `found` {application with `reviewStatus`}, `not-found`, `failed` |
| `updateApplication.execute(applicationId, input)` | `PATCH /applications/{applicationId}` | `register_company`, own | `updated` {application}, `not-found`, `invalid-state`, `attestation-mismatch` {fields}, `validation` {errors}, `failed` |
| `replaceAttestation.execute(applicationId, attestation)` | `PUT /applications/{applicationId}/attestation` | `register_company`, own | `replaced` {application}, `not-found`, `invalid-state`, `attestation-invalid` {reason}, `attestation-mismatch` {fields}, `attestation-used`, `failed` |
| `uploadDocument.execute(applicationId, input)` | `POST /applications/{applicationId}/documents` | `register_company`, own | `uploaded` {document}, `not-found`, `invalid-state`, `validation` {errors}, `failed` |
| `getDocument.execute(applicationId, documentId)` | `GET /applications/{applicationId}/documents/{documentId}` | `register_company`, own | `found` {content: Blob, contentType, fileName}, `not-found`, `failed` |
| `deleteDocument.execute(applicationId, documentId)` | `DELETE /applications/{applicationId}/documents/{documentId}` | `register_company`, own | `deleted`, `not-found`, `invalid-state`, `failed` |
| `submitApplication.execute(applicationId, input)` | `POST /applications/{applicationId}/submit` | `register_company`, own | `submitted` {application} (also when already SUBMITTED), `not-found`, `invalid-state`, `attestation-expired`, `documents-incomplete` {missingDocumentTypes, representationDeclarationMissing}, `consents-incomplete` {missing}, `validation` {errors}, `failed` |
| `withdrawApplication.execute(applicationId)` | `POST /applications/{applicationId}/withdraw` | `register_company`, own | `withdrawn` {application} (also when already WITHDRAWN), `not-found`, `invalid-state`, `already-decided` {reviewStatus}, `failed` |
| `listAllApplications.execute(filter)` | `GET /osp/applications` | `view_applications`, osp | `found` {page}, `validation`, `forbidden`, `failed` |
| `getAnyApplication.execute(applicationId)` | `GET /osp/applications/{applicationId}` | `view_applications`, osp | `found` {application with `reviewStatus`}, `not-found`, `forbidden`, `failed` |
| `getAnyDocument.execute(applicationId, documentId)` | `GET /osp/applications/{applicationId}/documents/{documentId}` | `view_applications`, osp | `found` {content, contentType, fileName}, `not-found`, `forbidden`, `failed` |
| `listAgreementVersions.execute(filter)` | `GET /osp/agreements` | `manage_agreements`, osp | `found` {page}, `validation`, `forbidden`, `failed` |
| `createAgreementVersion.execute(input)` | `POST /osp/agreements` | `manage_agreements`, osp | `created` {version}, `conflict`, `validation` {errors}, `forbidden`, `failed` |
| `requestAttestation.execute()` | **not a C1-M2 operation**: the wallet step of the BFF (FRAMEWORK 5.2 step 2), a stand-in until the BFF offers it (open point 1) | – | `received` {attestation}, `cancelled`, `failed` |

Result `status` strings are the Problem Details names of C1-M2 README 12 without `urn:c1-m2:problem:`. A page maps
each `status` (and for `failed` the `error.problemType`) to an i18n key; it never shows `title` or `detail`.

## Use it

Now (mock mode, `VITE_USE_MOCKS=true npm start`): `apps/portal/src/core/mock-container.ts` wires the module on the
in-memory adapters, signed in as the person of `VITE_MOCK_PERSON` (`erika`, `max`, `hans`, `lieschen`, `rolf`, `otto`,
`pia`). It is the optional member `c1m2` of `CoreModules`; outside mock mode it is `undefined`.

```ts
import { createMockC1M2Module, mockAttestation } from '@dataspace-mgm/c1-m2-core/testing';

const c1m2 = createMockC1M2Module(session); // MOCK_MODE_APPLICATIONS preloaded
const created = await c1m2.createApplication.execute({
  kind: 'ONBOARDING',
  verification: 'EBW',
  attestation: mockAttestation(), // Erika Mustermann for Beispiel Maschinenbau GmbH (C1-M2 README 14.4)
  companyRoles: ['ACTIVE_PARTICIPANT'],
});
```

Phase 3 adds the HTTP adapters behind the same ports and `createC1M2Module(config)` in `index.ts`; `container.ts`
then wires `c1m2: createC1M2Module(moduleConfig(C1M2_BASE_PATH))`. `createC1M2UseCases(ports)` already wires every use
case to its port, so both composition roots do it the same way.

Tests of pages use `testCoreModules({ session, c1m2: { applications, failure, now } })` from `apps/portal/src/core/testing.tsx`,
which also returns the `applicationRepository` (to call `setReviewStatus`, `complete`, `decline`, or read `calls`).

## The test double (`@dataspace-mgm/c1-m2-core/testing`)

| Export | What |
|---|---|
| `InMemoryApplicationRepository` | the applications fake: caller, status model, attestation checks, comparison, identifiers, roles, consents, documents, kinds, `reviewStatus`; test helpers `setReviewStatus`, `complete`, `decline`, `setFailure`, `as(caller)` (the same backend seen by another person), read-only `applications`, `documents`, `usedJtis`, `requiredAgreementsOf`, `calls` |
| `InMemoryReferenceDataRepository`, `InMemoryAgreementRepository` | reference data (README 14.2) and the versions of the terms (14.3); pass one agreement repository to the other fakes so that a new version counts everywhere |
| `createMockC1M2Module(session, options)`, `createMockC1M2Ports(session, options)` | the module, or the three adapters, for a session (null: signed out) |
| `mockAttestation(overrides, now)`, `decodeMockAttestation(jws)` | a verification attestation as a compact JWS with the signature `mock-signature` (never accepted by the real backend) |
| `callerOf(session)`, `NO_PERMISSIONS_CALLER` | the token claims the fake reads |
| fixtures | `REFERENCE_DATA`, `COMPANY_ROLES`, `AGREEMENT_VERSIONS`, `EXISTING_COMPANIES` (`WERKZEUGBAU_COMPANY`, `GIESSEREI_COMPANY`, `OSP_A_EXISTING_COMPANY`), `FRAMEWORK_COMPANY_IDS`, company claims, applications (`ERIKA_APPLICATION_CREATED/SUBMITTED/COMPLETED`, `HANS_APPLICATION_DOCUMENTS/DECLINED`, `MAX_APPLICATION_REACTIVATION`, `MAX_APPLICATION_TRANSFER_RETURN`, `MOCK_MODE_APPLICATIONS`) with their attestations, sessions of FRAMEWORK 7a (`ERIKA_SESSION`, `MAX_SESSION`, `HANS_SESSION`, `LIESCHEN_SESSION`, `ROLF_SESSION`, `OTTO_SESSION`) |

Pages never import `testing`; only `mock-container.ts` and tests do. The fake's rules are copies of the backend's so
that every result state can be rendered and tested; they are never a source of truth for a page or a hook
(AGENTS.md rule 3).

### What the fake does and does not check

| C1-M2 README | The fake reproduces | Backend only (not in the fake) |
|---|---|---|
| 6.1 status model | `CREATED` → `SUBMITTED` → `COMPLETED`/`DECLINED`, `CREATED`/`SUBMITTED` → `WITHDRAWN`; data frozen from `SUBMITTED`; final states answer `invalid-state` | the steps `complete-application`/`close-application` (only as test helpers `complete`, `decline`) |
| 6.2 kinds | reference by `companyId` xor `bpn`, forbidden for ONBOARDING, required for REACTIVATION; `company-not-eligible` with `companyStatus` (from `EXISTING_COMPANIES`); `existingCompany`; roles of the company when none given (selectable only); `company-has-open-application`; EBWOID/EUID against the company → `attestation-mismatch` | the real query to C3-M1 |
| 6.3 ownership | `account-bound`; other people's applications are `not-found`; `forbidden` without the permission; one open application per person | token validation |
| 6.4 attestation | decodes the mock JWS and checks in README order: `format`, `expired`, `version`, `purpose`, `claims` (required claims, `sub` = `company.ebwoid`, country of the reference data), `client` (`osp-a-ui`), `person` (NFC, trim, case folding); single use of `jti` (also replaced and withdrawn); `representation.confirmed: false` accepted; at most 16 KB | `algorithm`, `issuer`, `signature`, `audience`, `not-yet-valid`, JWKS (a test injects them as a `C1M2ProblemException` failure) |
| 6.5 comparison | fixed fields EBWOID, EUID, COUNTRY → `attestation-mismatch`; compared fields with NFKC, trim, collapsed whitespace, case folding → `MATCH`/`MISMATCH`; omitted → `FROM_ATTESTATION` (street split at the house number); claim missing → `NOT_IN_ATTESTATION`; no entry when missing on both sides; compared again on change and replacement; DOCUMENTS → `comparison: []` | – |
| 6.6 identifiers | at most one per type, at most 10; EBWOID required for EBW, forbidden for DOCUMENTS; types of the country; normalisation (trim, upper case for EUID, VAT_ID, LEI_CODE, EORI) | the regular expressions per country (the fixture carries `pattern` for the UI), EUID's country prefix |
| 6.7 roles | only selectable roles; `ONBOARDING_SERVICE_PROVIDER` → `validation` | – |
| 6.8 terms | required = active scope ALL + active of the roles; `consents-incomplete` with `missing`; unknown or not required key → `validation`; `givenAt`; `requiredAgreements` recorded; a new version is required at the next submission | – |
| 6.9 documents | `documentsEnabled`; magic bytes `%PDF-`, PNG, `FF D8 FF`; size (default 1 MiB) and count (10); SHA-256; `documents-incomplete` at submission | malware scan, storage |
| 6.10 withdraw | `reviewStatus` per application (`NONE`, `OPEN` after submission, settable); `APPROVED`/`DECLINED` → `already-decided`; `UNKNOWN` → `upstream-error` (502) | the real query to C1-M3 |
| 6.11 idempotency | create with the same `jti` → `repeated`; submit on SUBMITTED and withdraw on WITHDRAWN return the application unchanged | locking |
| 7.15, 7.16 terms | versions per key, new version ACTIVE and previous INACTIVE, `conflict`, `companyRoles` only for COMPANY_ROLE and selectable, HTTPS documents, `reconsentDueAt` required and in the future | the event `AgreementVersionActivated` |
| 6.12, 8, 9, 10 | – | audit log, steps, internal queries, `signatureCheck`, events |

## Proof of concept: the onboarding feature

`apps/portal/src/features/onboarding/` (FeatureConfig `stage: 'poc'`: routed only with `VITE_USE_MOCKS=true`,
"coming soon" otherwise) builds the decided views of `mockups/onboarding/` on this package's use cases. Mapping:

| Mockup (hub decision) | Code |
|---|---|
| view 1 Start application (progress=side · choice=tiles, the goal cards stay visible) | `pages/StartPage.tsx` with `GoalSection`, `ProofSection`, `WalletDialog`; `hooks/useStartApplication` → `requestAttestation`, `createApplication` |
| view 2 Company data (comparison=badges · editing=button) | `pages/CompanyDataPage.tsx` (`AttestationCard`, `CompanyCard`, `CompanyForm`, `SourceBadge`) → `getOwnApplication`, `updateApplication`, `listCountries`, `listIdentifierTypes`; DOCUMENTS: `pages/NewApplicationPage.tsx` → `createApplication` |
| view 3 Supporting documents (one section per type, declaration here) | `pages/DocumentsPage.tsx` (`DocumentSection`) → `uploadDocument`, `getDocument`, `deleteDocument` |
| view 4 Roles, terms and submission (summary=top · roles=checkboxes · terms in a full-screen viewer) | `pages/TermsPage.tsx` (`ApplicationSummary`, `RolesCard`, `TermsList`, `TermsViewer`) → `listCompanyRoles`, `updateApplication`, `listAgreements`, `submitApplication`, `requestAttestation` + `replaceAttestation` |
| view 5 My application (withdraw=bottom · status=stepper · details=tabs) | `pages/MyApplicationPage.tsx` (`ApplicationStepper`, `ApplicationTabs`, `WithdrawSection`) → `getOwnApplication`, `withdrawApplication` |
| view 6 Applications (filters=side · layout=table · details in the same card) | `pages/ApplicationsPage.tsx` (`ApplicationsFilter`, `ApplicationsTable`, `StaffApplicationDetail`) → `listAllApplications`, `getAnyApplication`, `getAnyDocument` |
| `/onboarding` | `pages/OnboardingPage.tsx`: OSP staff (permission key `view_applications` of `/me`, hides UI only) see view 6; an applicant goes to the newest own application (`listOwnApplications`) or to the start |
| the states of each view | the result `status` values of the use cases, plus `loading`, `signed-out`, `not-connected` (`hooks/useLoad`, `components/StateView`); problems as `components/OutcomeAlert` (type → i18n key) |
| `shared/data.js` | the fixtures of `@dataspace-mgm/c1-m2-core/testing` (identical) |
| test persons | `MOCK_PERSONS` in `apps/portal/src/core/mock-container.ts` (`VITE_MOCK_PERSON=erika|max|hans|lieschen|rolf|otto`) |

Readings the POC takes where the spec leaves a gap (AGENTS.md rule 13), each also an open point below:
`companyRoles` is required at creation for a new company, the person chooses roles in step 4, so the POC sends
`ACTIVE_PARTICIPANT` at creation and changes them with PATCH; "From which OSP?" is free text and not sent; the terms
viewer shows `documentUrls[language]` in a frame and reads the scroll position of the frame around it; one document per
type; withdrawing is offered while the status is CREATED or SUBMITTED and the API answers `already-decided`.

## Decisions

1. **The attestation is an opaque string.** The use cases take `attestation` as received; mock mode builds it with
   `mockAttestation()`. Who hands it to the browser is open (P0 below).
2. **Problem Details extensions.** `ensureData` of `core-http` keeps only `type` and `title`. This package defines
   `C1M2ProblemException extends CoreHttpException` with `problem: C1M2ProblemData` (the `Problem` schema); every
   adapter throws it for the module's 4xx answers, and `ProblemOutcomeDomain` maps the `type` to the result in one
   place. **Proposal for `packages/core-http`** (not changed here): `CoreHttpException.problem` with the raw Problem
   Details body, so that phase 3 needs no own `ensureData`.
3. **Backend spec over frontend spec 14.** `architecture/14-example-registration.md` of the frontend spec assumed
   `/api/registration/...`, snake_case, `verified_fields` and a `process_id` on the application. C1-M2's openapi.yaml
   has `/api/c1-m2/...`, camelCase, `comparison[]` and no process id (the process belongs to C12-M1). This package
   follows the backend spec (AGENTS.md rule 2).
4. **After submission only `reviewStatus`.** The "in review / completed / declined" view needs C12-M1 process state or
   C1-M3; C1-M2 offers `reviewStatus` on the application. A `c12-m1-core` with `watchProcess` is a later package.
5. **The fake's rules are copies, not truth.** Everything lives under `domain/testing/`; the only non-test domain
   service is `ProblemOutcomeDomain` (error → data).
6. **`companyId` of a new application:** the FRAMEWORK 7a id when an identifier matches a 7a company that no
   application has yet (Beispiel Maschinenbau GmbH by EBWOID/EUID, Beispiel Logistik GmbH by commercial register
   number), otherwise `crypto.randomUUID()`, as the backend stand-in does.
7. **Test accounts.** README 14.1's `d4fef928-…` (bound) and `08f42539-…` (no permissions) are not in the backend test
   data: a caller with `companyId` stands for the bound account, `NO_PERMISSIONS_CALLER` for the other.
8. **Beispiel Werkzeugbau GmbH is two things:** the INACTIVE company `cc080671-…` of OSP A (README 14.5, reactivation)
   and an applicant at OSP B in the backend demo. The fixtures carry the first; an ONBOARDING attestation for it is
   possible too.
9. **Given and family name.** `SessionAnemic` has one `name`; the attestation check needs both. `callerOf` takes them
   from the test persons and splits `name` at the last space only as a fallback (P1 below).
10. **Pia stays as identity-core defines her** (`view_company`, `edit_company`). In mock mode she therefore gets
    `failed` (403 `forbidden`) from C1-M2, not `account-bound`; with `register_company` added (as every real account
    has the role `Applicant`) she gets `account-bound`. New sessions carry the full lists of C2-M5 6.3.
11. **Reference data has only DE and US** (the extract of README 14.2, as the backend's `config/master-data.json`).
12. **Document download** is `{ content: Blob; contentType; fileName }`. Phase 3 needs a raw `fetch` for this path
    (openapi-fetch parses JSON) and the file name from `Content-Disposition`; the upload sends `multipart/form-data`
    with `fileName` as the file name of the part.
13. **Paging:** `page` from 0 (default 0), `size` 1 to 100 (default 20) per FRAMEWORK 4.1; the fake answers
    `validation` otherwise. The list use cases therefore also have `validation` (the spec has 400 there).
14. **`forbidden` vs `failed`:** `forbidden` only on the `osp` operations (a page may show "no access"); for `own`
    operations a 403 is `failed` with the type, since the UI hides those pages by the permission keys of `/me`.
15. **Not in this package:** `AgreementVersionActivated`, audit log, `signatureCheck`, steps, internal queries, events
    (backend behaviour without a UI operation).
16. **Two application anemics, as the spec has two schemas:** `ApplicationAnemic` (schema `Application`: create,
    change, submit, withdraw) and `ApplicationWithReviewAnemic` (schema `ApplicationWithReview`: the two reads). The
    wire shape is kept 1:1 (camelCase, nested address); a page formats.
17. **Fake details the spec leaves open:** after withdrawing a SUBMITTED application `reviewStatus` becomes `CLOSED`;
    `complete` sets `APPROVED`, `decline` sets `DECLINED`; fixture attestations have fixed dates (Erika's expires
    27 Nov 2026, Max's 4 Dec 2026, after which submitting them in mock mode answers `attestation-expired` until
    replaced). Beispiel Gießerei GmbH has no address in any test data: its attestation has no address claim and the
    return fixture carries a fictitious address given by the person.
18. **Mock attestation header and client:** `kid` `ebw-test-2026-1` (README 14.4) and `client_id` `osp-a-ui`
    (FRAMEWORK 7a), allowed by the fake's `ATTESTATION_CLIENT_IDS`.

## Open points for the backend

| # | Priority | Operation | What the UI needs | In the spec? | Notes |
|---|---|---|---|---|---|
| 1 | P0 (blocks the feature) | BFF, e.g. `GET /ebw/attestation` | The verification attestation of the current session, to pass to `POST /applications` | no | FRAMEWORK 5.2 step 2: the BFF is the OIDC client of the EBW-Connector and receives `ebw_attestation`; neither the BFF nor its OpenAPI exists. The frontend spec 14 assumed `POST /api/ebw/presentation-requests`. |
| 2 | P1 (needed for the full feature) | BFF `GET /me` | `given_name` and `family_name` of the person | no | The page should warn before the attestation check fails with `person` (README 6.4 step 10); `SessionAnemic` has one `name`. |
| 3 | P1 | `GET /applications/{applicationId}` | A live update when `reviewStatus` or `status` changes after submission | no | AGENTS.md rule 7: SSE, no polling. C1-M2 has no stream for the applicant, and C12-M1 `process-changed` needs a process id the application does not carry. |
| 4 | P1 | `POST /applications` (REACTIVATION, return) | How the applicant finds the `companyId` or `bpn` of the deactivated or transferred company | no | C1-M2 offers no lookup for a person without a company; the UI can only ask for the BPN as free text. |
| 5 | P2 (nice to have / clarification) | `POST /applications`, `PUT …/attestation` | Which `fields` README 13 cases 12 and 13 expect | yes | Rules 6.2 and 7.6 compare EBWOID and EUID; with another company both differ, so the fake answers `['EBWOID', 'EUID']`, while case 13 names only `EBWOID`. |
| 6 | P2 | `Problem` schema | Which extension fields are present for which `type` | partly | No `required` per type (e.g. `existingApplicationId`, `companyStatus`, `reviewStatus`); the result types make them nullable. |
| 7 | P2 | `POST /applications` | `client_id` of the test attestation | yes | README 14.4 uses `demo-osp`, FRAMEWORK 7a `osp-a-ui` for the UI client; the fake allows `osp-a-ui`. |
| 8 | P2 | `GET /countries` | The full country list of portal 2.6.0 | partly | `masterDataFile` and README 14.2 have DE and US only (OP-13). |
| 9 | P2 | README 14.1 | Test accounts `d4fef928-…` (bound) and `08f42539-…` (no permissions) | yes | Not in FRAMEWORK 7a or `testdata/persons-osp-a.json`; the UI uses Pia and a caller without permissions. |
| 10 | P2 | `POST /applications/{applicationId}/withdraw` | `reviewStatus` after withdrawing a submitted application | partly | The overall view of README 6.1 says "– or CLOSED"; the fake reports `CLOSED`. |
| 11 | P1 | `POST /applications` | `companyRoles` optional at creation for ONBOARDING and TRANSFER without reference | no (required) | The decided flow chooses roles in step 4; the POC sends `ACTIVE_PARTICIPANT` at creation and changes them with PATCH. |
| 12 | P1 | `POST /applications` (TRANSFER) | The OSP the company comes from, and an operation that lists the OSPs | no | The mockup asks "From which OSP?"; the POC shows free text and does not send it. Or does the C1-M3 pre-check find it at the CSP (README 6.2)? |
| 13 | P1 | `GET /agreements` | A way to know that the person read a document to the end | no | The browser's PDF viewer reports no scroll position (and not across origins): render with pdf.js (new dependency, Eclipse Dash, CORS on the document hosts) or the terms as text/HTML next to `documentUrls`. |
| 14 | P1 | `GET /applications/{applicationId}` | `canWithdraw` (and `canContinue`) flags | no | The page offers withdrawing from the status and handles `already-decided`; it must not decide from `reviewStatus`. |
| 15 | P1 | config (e.g. `GET /config`) | Whether the path DOCUMENTS is switched on (`DOCUMENTS_ENABLED`) | no | Otherwise the person learns it only from 400 `documents-disabled` after choosing it. |
| 16 | P2 | `GET /applications/{applicationId}` | The date until which the attestation is accepted at submission (`ATTESTATION_MAX_AGE` from `issuedAt`) | no | The page shows `expiresAt`; it must not compute the 30 days. |
| 17 | P2 | documents | Required document types, maximum size and count as data | no | The page repeats "register extract needed, PDF/PNG/JPEG" as text; the UI offers one document per type while the API allows several. |

## Layout

`domain/` (anemics, data, `C1M2ProblemException`, `ProblemOutcomeDomain`, ports, `testing/` with the in-memory
adapters and fixtures) ← `application/` (use cases, `createC1M2UseCases`). No `infrastructure/` yet; in phase 3 it
gets the generated client, mappers and HTTP adapters, and only `index.ts` imports it.

## Update the spec

```bash
cp ../portal-backend-spec/C1-M2-Registration/openapi.yaml specs/c1-m2/openapi.yaml   # and the commit in openapi.yaml.license
.claude/skills/contract-seam/scripts/seam-check.py vendored --ui .
```

Phase 3 adds the targets `generate-api` and `check-api` (as in `c3-m1-core`).
