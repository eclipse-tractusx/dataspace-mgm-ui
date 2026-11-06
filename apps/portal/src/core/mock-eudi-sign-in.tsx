/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * AI Disclosure: This file was entirely AI-generated.
 * The AI-generated portions are made available under CC0-1.0 and not subject
 * to the project's license. The human contributor has reviewed and verified
 * that the code is correct.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  ColorModeProvider,
  Container,
  Divider,
  Stack,
  Switch,
  Typography,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { I18nProvider } from '../i18n/I18nProvider';
import {
  buildBackendLoginUrl,
  DEFAULT_MOCK_PERSON,
  getLoginMode,
  isSpecLoginResponseEnabled,
  MOCK_PERSON_KEY,
  MOCK_PERSONS,
  setLoginMode,
  setSpecLoginResponseEnabled,
} from './mock-container';

export function safeMockReturnTo(value: string | null): string {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\') ? value : '/';
}

function Screen() {
  const { t } = useTranslation();
  const returnTo = safeMockReturnTo(new URLSearchParams(window.location.search).get('returnTo'));
  const [normalMode, setNormalMode] = useState(() => getLoginMode() === 'normal');
  const [specResponse, setSpecResponse] = useState(() => isSpecLoginResponseEnabled());

  const handleToggleNormal = (checked: boolean) => {
    setNormalMode(checked);
    setLoginMode(checked ? 'normal' : 'eudi');
  };

  const handleToggleSpecResponse = (checked: boolean) => {
    setSpecResponse(checked);
    setSpecLoginResponseEnabled(checked);
  };

  const handleSelectPerson = (key: string) => {
    window.sessionStorage.setItem(MOCK_PERSON_KEY, key);
    if (normalMode && !specResponse) {
      window.location.assign(buildBackendLoginUrl(returnTo, key));
      return;
    }
    window.location.assign(returnTo);
  };

  const handleStandardLogin = () => {
    if (specResponse) {
      const current = window.sessionStorage.getItem(MOCK_PERSON_KEY);
      if (!current || current === 'none') {
        window.sessionStorage.setItem(MOCK_PERSON_KEY, DEFAULT_MOCK_PERSON);
      }
      window.location.assign(returnTo);
      return;
    }
    window.location.assign(buildBackendLoginUrl(returnTo));
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Card sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h2" component="h1">{t('mockEudi.title')}</Typography>
            <Typography>{t('mockEudi.explanation')}</Typography>
            <Typography variant="body2" color="text.secondary">{t('mockEudi.noWallet')}</Typography>
          </Stack>
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack spacing={1.5}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                  <Typography>{t('mockEudi.normalLoginLabel')}</Typography>
                  <Switch
                    checked={normalMode}
                    slotProps={{ input: { 'aria-label': t('mockEudi.normalLoginLabel') } }}
                    onChange={(_, checked) => handleToggleNormal(checked)}
                  />
                </Stack>
                <Divider />
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                  <Typography>{t('mockEudi.specResponseLabel')}</Typography>
                  <Switch
                    checked={specResponse}
                    slotProps={{ input: { 'aria-label': t('mockEudi.specResponseLabel') } }}
                    onChange={(_, checked) => handleToggleSpecResponse(checked)}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Stack spacing={1.5}>
            {normalMode && (
              <Button variant="contained" fullWidth onClick={handleStandardLogin}>
                {t('mockEudi.continueBackend')}
              </Button>
            )}
            {Object.entries(MOCK_PERSONS).map(([key, person]) => (
              <Button
                key={key}
                variant={normalMode ? 'outlined' : 'contained'}
                fullWidth
                onClick={() => handleSelectPerson(key)}
              >
                {t('mockEudi.continueAs', { name: person.user.name })}
              </Button>
            ))}
            <Button variant="outlined" fullWidth onClick={() => window.location.assign(returnTo)}>
              {t('mockEudi.cancel')}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}

export function MockEudiSignIn() {
  return <I18nProvider><ColorModeProvider><Screen /></ColorModeProvider></I18nProvider>;
}
