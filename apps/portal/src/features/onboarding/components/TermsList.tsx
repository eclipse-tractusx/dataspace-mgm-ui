/********************************************************************************
 * Copyright (c) 2026 Catena-X Automotive Network e.V.
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
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import type { AgreementAnemic, Language } from '@dataspace-mgm/c1-m2-core';
import { Box, Button, Card, CardContent, CheckCircleOutlinedIcon, DescriptionOutlinedIcon, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';
import { IconTile } from './IconTile';

/** The required terms (GET /agreements): one row per document with its icon and an Open button (decided). */
export function TermsList({ terms, accepted, onOpen }: { terms: ReadonlyArray<AgreementAnemic>; accepted: Readonly<Record<string, Language>>; onOpen: (term: AgreementAnemic) => void }) {
  const { t } = useTranslation(ONBOARDING_NS);
  return (
    <Card component="section" aria-labelledby="terms-title">
      <CardContent sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography id="terms-title" variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
          {t('terms.termsTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('terms.termsIntro')}
        </Typography>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {terms.map((term, index) => {
            const language = accepted[termKey(term)];
            return (
              <Box component="li" key={termKey(term)} sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' }, py: 2, borderTop: index ? '1px solid' : 0, borderColor: 'ui.subtleBorder' }}>
                <IconTile>
                  <DescriptionOutlinedIcon />
                </IconTile>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }}>{term.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('terms.partyVersion', { party: t(`terms.party.${term.party}`), version: term.version })}
                  </Typography>
                  {language ? (
                    <Box component="span" sx={{ display: 'inline-flex', gap: 0.75, alignItems: 'center', color: 'success.main', fontSize: '0.875rem' }}>
                      <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
                      {t('terms.accepted', { language: t(`enum.language.${language}`) })}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('terms.notAccepted')}
                    </Typography>
                  )}
                </Box>
                <Button variant="outlined" onClick={() => onOpen(term)} aria-label={`${t('open')}: ${term.title}`}>
                  {t('open')}
                </Button>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}

/** A consent belongs to a key in one version. */
export const termKey = (term: Pick<AgreementAnemic, 'agreementKey' | 'version'>) => `${term.agreementKey}@${term.version}`;
