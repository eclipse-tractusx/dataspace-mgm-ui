<!--
 Copyright (c) 2026 Catena-X Automotive Network e.V.
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# Portal app

The React app of the Eclipse Tractus-X Dataspace Management UI. For now it is a skeleton with one feature, the welcome
home page. It follows the Eclipse Tractus-X Design Guidelines v1.0 (see [libs/shared/ui-mui](../../libs/shared/ui-mui/README.md)):
black by default, the Eclipse Tractus-X orange `#FAA023` as the accent, Manrope, the brand gradient in the hero, and a
light mode with the same tokens.

## Run it

```bash
npm ci
npm start            # nx serve portal → http://localhost:4200
npm run build        # nx build portal → dist/apps/portal (the image in the Dockerfile serves this folder)
npm run lint && npm run typecheck && npm test
```

### Mock mode

`VITE_USE_MOCKS=true npm start` runs the portal without the backend and without the BFF: every core package uses its
in-memory adapter with the test data of its `testing` entry point ([src/core/mock-container.ts](src/core/mock-container.ts)),
and the environment chip in the header says **mock data**. `VITE_MOCK_PERSON=<key>` signs in another test person of
`MOCK_PERSONS` (default `pia`; an unknown key such as `none` starts signed out). Both can also go into
`apps/portal/.env.local`. Vite replaces the switch at build time, so a build without it contains no mock code.

Runtime configuration comes from `/config.json` (see [docs/architecture](../../docs/architecture/README.md)). Without it
the defaults of [src/config/index.ts](src/config/index.ts) apply. For a local override copy
`config.example.json` to `public/config.json` (ignored by git).

## Feature modules

The structure follows the modular frontend of the
[Industry Core Hub](https://github.com/eclipse-tractusx/industry-core-hub/tree/main/ichub-frontend): the shell (layout,
header, sidebar, router) knows nothing about the features; every feature brings its own pages and routes and registers
itself in one list.

```text
apps/portal/src/
├── main.tsx                  loads /config.json, renders <App>
├── App.tsx                   config context + theme (ColorModeProvider) + router
├── routes.tsx                builds the routes from the feature registry, 404 fallback
├── layouts/MainLayout.tsx    header, sidebar, <Outlet>, footer
├── components/general/       Header, Sidebar, ErrorNotFound
├── config/                   runtime configuration (/config.json)
├── types/routing.ts          FeatureConfig, FeatureRoute, NavigationItem
└── features/
    ├── main.tsx              the registry: allFeatures, features (navigation), getAllRoutes()
    └── home/
        ├── index.ts          public exports of the feature
        ├── routes.tsx        homeFeature: name, icon, navigation path, routes
        └── pages/Home.tsx    the welcome page
```

### Add a feature

1. Create `src/features/<feature>/` with `pages/`, `routes.tsx` and `index.ts`.
2. In `routes.tsx` export one `FeatureConfig` (name, icon, `navigationPath`, `disabled`, `routes`).
3. Add it to `allFeatures` in [src/features/main.tsx](src/features/main.tsx). The sidebar and the router pick it up.
   With `disabled: true` the feature shows in the navigation as "coming soon" without routes.
4. A proof of concept on mock data gets `stage: 'poc'`: it opens only in mock mode and shows as "coming soon"
   otherwise, so it can be merged before its backend module is connected.

New features go through three phases, each with a skill of the Dataspace Captain
([.claude/skills](../../.claude/skills/README.md#from-an-idea-to-a-feature-mockup-proof-of-concept-feature)):
`create-mockup` (HTML mockups in `mockups/<feature>/`), `build-poc` (the feature with `stage: 'poc'` in mock mode) and
`build-feature` (connected to its backend module).

When a feature talks to a backend module, its calls go through the framework-free core package of that module
(`packages/<module>-core`, generated from `specs/<module>/openapi.yaml`), never directly from a page
([architecture rules](../../docs/architecture/README.md#rules)). The example is the feature
[participants](src/features/participants): it reads the own company from C3-M1 through
[packages/c3-m1-core](../../packages/c3-m1-core), wired in [src/core/container.ts](src/core/container.ts). The
step-by-step guide is [docs/developers/integrate-a-backend-module.md](../../docs/developers/integrate-a-backend-module.md).

`npm start` runs the development BFF of [dev-bff/dev-bff.ts](dev-bff/dev-bff.ts) (`/me`, `/auth/*`, `/api` →
backend with the token of a test person); its settings are in [.env.example](.env.example).

## Rules enforced by the linter

[eslint.config.mjs](../../eslint.config.mjs) fails the build when the app imports `@mui/*` (use
`@dataspace-mgm/ui-mui`), `@catena-x/portal-shared-components`, `keycloak-js`, or a library by a deep path.
