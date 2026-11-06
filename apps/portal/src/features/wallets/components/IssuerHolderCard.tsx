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
import { Box } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { WALLETS_NS } from '../i18n';
import { CopyValue } from './CopyValue';
import { Field, Fields } from './Field';
import { SectionCard } from './SectionCard';

const none = (text: string) => (
  <Box component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
    {text}
  </Box>
);

/** Who issues the credential and who holds it: route, issuer, wallet and DID of the holder, the order, the ID. */
export function IssuerHolderCard({ credential }: { credential: CredentialDetailAnemic }) {
  const { t } = useTranslation(WALLETS_NS);
  return (
    <SectionCard id="credential-issuer" title={t('credential.issuer.title')}>
      <Fields>
        <Field label={t('credential.issuer.route')}>{t(`route.${credential.route}`)}</Field>
        <Field label={t('credential.issuer.issuer')}>
          {credential.issuerDid ? <CopyValue value={credential.issuerDid} /> : none(t('credential.issuer.ospIssuer'))}
        </Field>
        <Field label={t('credential.issuer.wallet')}>
          {credential.walletProvider ? t(`walletProvider.${credential.walletProvider}`) : none(t('common.notKnown'))}
        </Field>
        <Field label={t('credential.issuer.holderDid')}>
          <CopyValue value={credential.holderDid} />
        </Field>
        <Field label={t('credential.issuer.order')}>
          {credential.requestRef ? <CopyValue value={credential.requestRef} /> : none(t('credential.issuer.noOrder'))}
        </Field>
        <Field label={t('credential.issuer.id')}>
          <CopyValue value={credential.id} />
        </Field>
      </Fields>
    </SectionCard>
  );
}
