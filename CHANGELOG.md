# Changelog

All notable changes to this project will be documented in this file.
See also the overarching [Eclipse Tractus-X changelog](https://eclipse-tractusx.github.io/changelog) for the Tractus-X releases.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Repository set-up according to the [Tractus-X Release Guidelines](https://eclipse-tractusx.github.io/docs/release): legal documentation, `.tractusx` metadata file, contribution templates, Dependabot and security scans (CodeQL, KICS, Trivy, TruffleHog), container build and documentation structure ([dataspace-mgm-ui#1](https://github.com/eclipse-tractusx/dataspace-mgm-ui/issues/1))
- Dataspace Captain agent for Claude Code and GitHub Copilot, with skills for the specs, flows, contract seams, tokens, Eclipse Dash and the merge check ([#4](https://github.com/eclipse-tractusx/dataspace-mgm-ui/pull/4))
- Portal UI skeleton: Nx workspace with the app `portal` and the MUI library `ui-mui`, the Eclipse Tractus-X design guidelines, feature modules, favourites, a sidebar and a phone bottom bar, the home page and All services ([#5](https://github.com/eclipse-tractusx/dataspace-mgm-ui/pull/5))
- Screenshots of the portal in the README
- First connection to the backend, as the example for the hackathon: Participant management shows the own company from C3-M1 Company Profile through the core packages `core-http`, `identity-core` and `c3-m1-core` (types generated from `specs/c3-m1/openapi.yaml`), a development BFF in `npm start` and the guide `docs/developers/integrate-a-backend-module.md`
- Mock mode: `VITE_USE_MOCKS=true npm start` runs the portal on the in-memory adapters of the core packages, without backend and BFF; features with `stage: 'poc'` open only there
- Skills `create-mockup`, `build-poc` and `build-feature` for the Dataspace Captain: a feature goes from HTML mockups in `mockups/<feature>/` (shell, tokens, navigation and icons generated from the portal, checked by `mockup.py`) to a proof of concept on mock data and then to the feature connected to its backend module
- Translations with i18next: every text of the portal is an i18n key in English and German, the shell's namespace `common` bundled and one lazily loaded namespace per feature, a language menu in the header (on phones under All services → Settings), `<html lang>` and `appLocale()` following the language, tests for key parity and missing keys, and the rule for agents and `merge-guard` that every text goes into every supported language (`docs/developers/translations.md`)

[Unreleased]: https://github.com/eclipse-tractusx/dataspace-mgm-ui/commits/main
