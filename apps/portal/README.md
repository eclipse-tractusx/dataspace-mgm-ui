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

The React app of the Dataspace Management UI. For now it is a skeleton with one feature, the welcome home page, in
the Tractus-X colours: black and white, with golden (`#FFA600`) and green (`#B3CB2D`) accents, in a light and a dark
mode.

## Run it

```bash
npm ci
npm start            # nx serve portal → http://localhost:4200
npm run build        # nx build portal → dist/apps/portal (the image in the Dockerfile serves this folder)
npm run lint && npm run typecheck && npm test
```

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

When a feature talks to a backend module, its calls go through the framework-free core package of that module
(`packages/<module>-core`, generated from `specs/<module>/openapi.yaml`), never directly from a page
([architecture rules](../../docs/architecture/README.md#rules)).

## Rules enforced by the linter

[eslint.config.mjs](../../eslint.config.mjs) fails the build when the app imports `@mui/*` (use
`@dataspace-mgm/ui-mui`), `@catena-x/portal-shared-components`, `keycloak-js`, or a library by a deep path.
