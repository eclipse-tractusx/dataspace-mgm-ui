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

import type { CredentialDetailAnemic } from '@dataspace-mgm/c4-m1-core';
import { Box, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useCompanyLine } from '../hooks/useCompanyLine';
import { WALLETS_NS } from '../i18n';
import { MONO } from '../utils/mono';
import { CredentialStatusChip } from './CredentialStatusChip';
import { Field, Fields } from './Field';
import { SectionCard } from './SectionCard';

/** The facts of the credential at the top of the page: status, type, company, attempt and the reason of a revocation. */
export function CredentialFacts({ credential }: { credential: CredentialDetailAnemic }) {
  const { t } = useTranslation(WALLETS_NS);
  const company = useCompanyLine(credential);
  return (
    <SectionCard id="credential-facts" sx={{ boxShadow: `0 0 32px ${alpha(tractusx.orange, 0.12)}` }}>
      <Fields columns={2}>
        <Field label={t('credential.facts.status')}>
          <CredentialStatusChip status={credential.status} />
        </Field>
        <Field label={t('credential.facts.credentialType')}>
          {t(`credentialType.${credential.credentialType}`)}{' '}
          <Box component="span" sx={{ fontFamily: MONO, fontSize: '0.8125rem', color: 'text.secondary' }}>
            {t(`credentialTypeTech.${credential.credentialType}`)}
          </Box>
        </Field>
        <Field label={t('credential.facts.company')}>{company}</Field>
        <Field label={t('credential.facts.attempt')}>{credential.attempt}</Field>
        {credential.revocationReason && (
          <Field label={t('credential.facts.revocationReason')}>{t(`revocationReason.${credential.revocationReason}`)}</Field>
        )}
      </Fields>
    </SectionCard>
  );
}
