// Copyright (c) 2026 Contributors to the Eclipse Foundation
// SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
// AI Disclosure: This file was entirely AI-generated; the AI-generated portions are CC0-1.0.
// Assisted-By: Claude Code (claude-opus-5-5)
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['**/dist', '**/node_modules', '**/.nx', '**/coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
  },
  {
    // Architecture boundaries (docs/architecture/README.md): MUI only inside libs/shared/ui-mui,
    // no legacy shared components, no tokens or Keycloak in the browser.
    files: ['apps/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'keycloak-js', message: 'No Keycloak in the browser: sign-in is handled by the backend.' },
            {
              name: '@catena-x/portal-shared-components',
              message: 'The new portal does not depend on the shared components; use @dataspace-mgm/ui-mui.',
            },
          ],
          patterns: [
            { group: ['@mui/*'], message: 'Import MUI only inside libs/shared/ui-mui; use @dataspace-mgm/ui-mui.' },
            { group: ['**/libs/shared/*/src/*'], message: 'Import a library by its alias, not by a deep path.' },
          ],
        },
      ],
    },
  },
]);
