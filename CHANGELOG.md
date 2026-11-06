# Changelog

All notable changes to this project will be documented in this file.
See also the overarching [Eclipse Tractus-X changelog](https://eclipse-tractusx.github.io/changelog) for the Tractus-X releases.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Participant management (C3-M1, C3-M2): the nine views of mockups/participants as pages, the use cases and HTTP adapters of `c3-m1-core`, the new core package `c3-m2-core`, mock mode with the test persons of FRAMEWORK 7a
- Repository set-up according to the [Tractus-X Release Guidelines](https://eclipse-tractusx.github.io/docs/release): legal documentation, `.tractusx` metadata file, contribution templates, Dependabot and security scans (CodeQL, KICS, Trivy, TruffleHog), container build and documentation structure ([dataspace-mgm-ui#1](https://github.com/eclipse-tractusx/dataspace-mgm-ui/issues/1))
- Dataspace Captain agent for Claude Code and GitHub Copilot, with skills for the specs, flows, contract seams, tokens, Eclipse Dash and the merge check ([#4](https://github.com/eclipse-tractusx/dataspace-mgm-ui/pull/4))
- Portal UI skeleton: Nx workspace with the app `portal` and the MUI library `ui-mui`, the Eclipse Tractus-X design guidelines, feature modules, favourites, a sidebar and a phone bottom bar, the home page and All services ([#5](https://github.com/eclipse-tractusx/dataspace-mgm-ui/pull/5))
- Screenshots of the portal in the README
- First connection to the backend, as the example for the hackathon: Participant management shows the own company from C3-M1 Company Profile through the core packages `core-http`, `identity-core` and `c3-m1-core` (types generated from `specs/c3-m1/openapi.yaml`), a development BFF in `npm start` and the guide `docs/developers/integrate-a-backend-module.md`
- Mock mode: `VITE_USE_MOCKS=true npm start` runs the portal on the in-memory adapters of the core packages, without backend and BFF; features with `stage: 'poc'` open only there
- Skills `create-mockup`, `build-poc` and `build-feature` for the Dataspace Captain: a feature goes from HTML mockups in `mockups/<feature>/` (shell, tokens, navigation and icons generated from the portal, checked by `mockup.py`) to a proof of concept on mock data and then to the feature connected to its backend module
- Translations with i18next: every text of the portal is an i18n key in English and German, the shell's namespace `common` bundled and one lazily loaded namespace per feature, a language menu in the header (on phones under All services → Settings), `<html lang>` and `appLocale()` following the language, tests for key parity and missing keys, and the rule for agents and `merge-guard` that every text goes into every supported language (`docs/developers/translations.md`)
- Core package `c1-m2-core` for C1-M2 Registration as a proof of concept: one use case per operation of `specs/c1-m2/openapi.yaml` (vendored), result unions with the Problem Details extensions, and an in-memory test double of the backend (attestation checks, comparison, kinds, documents, consents, review status) with the test persons and companies of FRAMEWORK 7a; wired in mock mode (`VITE_MOCK_PERSON=erika|max|hans|lieschen|rolf|otto`)
- Onboarding as a proof of concept (`stage: 'poc'`, mock mode only): clickable mockups in `mockups/onboarding/` with the decided views, and the feature `apps/portal/src/features/onboarding/` on the use cases of `c1-m2-core` (start with the Business Wallet or supporting documents, company data with the comparison, documents, roles and terms with a document viewer, my application, applications for OSP staff), in English and German
- Notifications from C11-M1: the core package `c11-m1-core` (types generated from `specs/c11-m1/openapi.yaml`, one use case per operation, `followInbox` for the live inbox over Server-Sent Events with `Last-Event-ID` reconnect), the notification bell with the unread count and the newest notifications, and the page Notifications in the left menu, laid out like a mail client (the list of the inbox and the selected notification with its content side by side), with views (all, unread, tasks, information), marking as read or unread and hiding on each line of the list, all updated live without polling, in English and German

### Fixed

- A feature opened from the sidebar loads its translations; it showed raw keys (for example Participant management) until the page was reloaded
- The container image takes the Alpine security fixes published after its base image was built (Trivy: CRITICAL/HIGH in brotli, curl, expat and zlib), and `DEPENDENCIES` lists `sass` and its dependencies

[Unreleased]: https://github.com/eclipse-tractusx/dataspace-mgm-ui/commits/main
