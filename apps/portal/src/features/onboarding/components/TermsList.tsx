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
import { Box, Button, Card, CardContent, CheckCircleOutlinedIcon, Chip, DescriptionOutlinedIcon, Typography, WarningAmberOutlinedIcon } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';
import { IconTile } from './IconTile';

/**
 * The required terms (GET /agreements): one row per document with its icon and a button that opens it (decided). A
 * document still to accept calls for action (warning status, highlighted row, filled "Read and accept"); an accepted
 * one steps back (green status, quiet "Read again"), so the button never looks the same before and after reading.
 */
export function TermsList({ terms, accepted, onOpen }: { terms: ReadonlyArray<AgreementAnemic>; accepted: Readonly<Record<string, Language>>; onOpen: (term: AgreementAnemic) => void }) {
  const { t } = useTranslation(ONBOARDING_NS);
  const acceptedCount = terms.filter((term) => accepted[termKey(term)]).length;
  const allAccepted = terms.length > 0 && acceptedCount === terms.length;
  return (
    <Card component="section" aria-labelledby="terms-title">
      <CardContent sx={{ p: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography id="terms-title" variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
            {t('terms.termsTitle')}
          </Typography>
          <Chip
            size="small"
            variant="outlined"
            color={allAccepted ? 'success' : 'warning'}
            label={t('terms.acceptedCount', { count: acceptedCount, total: terms.length })}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t('terms.termsIntro')}
        </Typography>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {terms.map((term, index) => {
            const language = accepted[termKey(term)];
            return (
              <Box
                component="li"
                key={termKey(term)}
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  py: 2,
                  px: 1.5,
                  mx: -1.5,
                  borderTop: index ? '1px solid' : 0,
                  borderTopColor: 'ui.subtleBorder',
                  borderLeft: '3px solid',
                  borderLeftColor: language ? 'transparent' : 'warning.main',
                  borderRadius: '2px',
                  backgroundColor: language ? 'transparent' : 'rgba(250, 160, 35, 0.06)',
                }}
              >
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
                    <Box component="span" sx={{ display: 'inline-flex', gap: 0.75, alignItems: 'center', color: 'warning.main', fontSize: '0.875rem', fontWeight: 600 }}>
                      <WarningAmberOutlinedIcon sx={{ fontSize: 16 }} />
                      {t('terms.notAccepted')}
                    </Box>
                  )}
                </Box>
                {language ? (
                  <Button variant="text" color="inherit" onClick={() => onOpen(term)} aria-label={`${t('terms.readAgain')}: ${term.title}`} sx={{ color: 'text.secondary' }}>
                    {t('terms.readAgain')}
                  </Button>
                ) : (
                  <Button variant="contained" onClick={() => onOpen(term)} aria-label={`${t('terms.readAndAccept')}: ${term.title}`}>
                    {t('terms.readAndAccept')}
                  </Button>
                )}
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
