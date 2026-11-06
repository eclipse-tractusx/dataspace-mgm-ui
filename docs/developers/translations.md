<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# Translations (i18n)

The portal is translated with [i18next](https://www.i18next.com) and
[react-i18next](https://react.i18next.com). **Every text a person can see or hear is an i18n key, in every
supported language, in the same pull request.** The languages are English (`en`, the source and the fallback) and
German (`de`).

## Where the texts live

```text
apps/portal/src/
├── i18n/
│   ├── index.ts                     initI18n(), SUPPORTED_LANGUAGES, LANGUAGE_NAMES, FALLBACK_LANGUAGE
│   ├── I18nProvider.tsx             starts i18next when the app mounts (App.tsx)
│   ├── lazyFeatureTranslations.ts   a feature's namespace, one chunk per language
│   ├── FeatureTranslationsGate.tsx  renders a feature's route once its texts are there
│   ├── useNavigationItems.ts        feature names and descriptions in the language in use
│   ├── locale.ts                    appLocale() / useAppLocale() for Intl and toLocale*String
│   ├── localeParity.test.ts         every language has every English key
│   └── locales/<language>/common.json   the shell: header, navigation, footer, features.<id>
└── features/<feature>/i18n/
    ├── constants.ts                 <FEATURE>_NS, the namespace (= the feature folder)
    ├── resources.ts                 one loader per language (the type check needs all of them)
    ├── register<Feature>Translations.ts   <feature>Translations = lazyFeatureTranslations(...)
    ├── index.ts
    └── locales/<language>/<feature>.json
```

- **`common`** (bundled with the app) holds what the shell shows: header, sidebar, bottom bar, All services, footer,
  404, and the name and description of every feature as `features.<id>.name` and `features.<id>.description`. The
  shell shows those before a feature is opened, so they cannot live in the feature's namespace.
- **The feature's namespace** holds everything on its pages. It is loaded lazily, English and the language in use
  only; the registry (`features/main.tsx`) renders a route only once its texts are there.
- **The language menu** is in the header on desktop and a tile under All services → Settings on phones. The choice is
  kept in this browser (`localStorage` key `dataspace-mgm.language`); without one, the browser's language decides.

## Use a text

```tsx
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../i18n';

export default function CompanyProfile() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  return <Typography variant="h1">{t('title')}</Typography>;
}
```

- Shell components use `useTranslation()` (namespace `common`); feature pages `useTranslation(<FEATURE>_NS)`.
- Not only the visible text: `aria-label`, `title`, `alt`, `placeholder`, tooltips, `titleAccess`, menu and chip
  labels, `Alert` texts and the texts of empty, loading and error states.
- Values go in as interpolation, never by concatenating strings:
  `t('failedWithStatus', { status, message })` with `"… (HTTP {{status}}): {{message}}"`. Word order differs between
  languages.
- Counts use plurals: `t('services.count', { count })` with `count_one` and `count_other`.
- Values of the API (status, roles, identifier types) are keys too: `t(`status.${company.status}`)`. A value the API
  may add later gets a readable `defaultValue`.
- Dates, numbers and lists are formatted with `appLocale()` (or `useAppLocale()`), never with `undefined` or a fixed
  `'en-US'`.
- Errors and validation messages from the core packages are keys (frontend architecture 04); the UI translates them.
  Core packages (`packages/*`) never contain texts.
- Brand and product names (Eclipse Tractus-X, Dataspace Management) are keys as well (`brand.*`), the same in every
  language. The language names in the menu are the only texts that are not keys (`LANGUAGE_NAMES`).

## Keys

- Group by what the screen shows: `fields.bpn`, `status.ACTIVE`, `how.join.title`. Lower camel case, the API's own
  spelling for its values.
- One key per meaning. Reuse a shell key (`navigation.comingSoon`, `profile.signIn`) only when it means exactly the
  same thing.
- Write English as the guidelines of the portal do: short, plain, active. German uses the formal *Sie* and the
  terms of the dataspace as they are used in German (Onboarding-Service-Provider, Business Partner Number, Datenraum).
- Remove a key when its last use goes, in every language.

## Add a feature namespace

1. Copy `apps/portal/src/features/participants/i18n/` to your feature and rename the namespace, the loaders and
   `<feature>Translations`.
2. Create `locales/en/<feature>.json` and the same keys in `locales/de/<feature>.json`.
3. Set `translations: <feature>Translations` in the feature's `FeatureConfig` (`routes.tsx`).
4. Add `features.<id>.name` and `features.<id>.description` to `src/i18n/locales/*/common.json`.
5. In the tests of a page, load the namespace first: `beforeAll(() => <feature>Translations.load())`.

## Add a language

1. A folder `locales/<code>/` with every JSON file, in `src/i18n/` and in every feature.
2. The code in `SUPPORTED_LANGUAGES` and its own name in `LANGUAGE_NAMES` (`src/i18n/index.ts`).
3. Its loader in every feature's `i18n/resources.ts`; `npm run typecheck` names the ones that are missing.

## What checks it

| Check | Fails when |
|---|---|
| `src/i18n/localeParity.test.ts` | a language misses an English key, has a key English does not have, a text is empty, or a `locales/` folder misses a supported language |
| every test (`src/test-setup.ts`) | a rendered key has no text in any language: a typo, or a test that did not load the feature's namespace |
| `npm run typecheck` | a feature's `resources.ts` misses a supported language |
| `merge-guard.py` | added JSX text or `aria-label`/`title`/`label`/`placeholder`/`alt` strings in a `.tsx`, or a locale file changed in one language only |

## NOTICE

This work is licensed under the [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

- SPDX-License-Identifier: CC-BY-4.0
- SPDX-FileCopyrightText: 2026 Contributors to the Eclipse Foundation
- Source URL: https://github.com/eclipse-tractusx/dataspace-mgm-ui/blob/main/docs/developers/translations.md
