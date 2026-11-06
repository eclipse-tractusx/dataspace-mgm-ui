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

import type { AgreementConsentAnemic } from '@dataspace-mgm/c3-m1-core';
import { Link, OpenInNewIcon } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { safeExternalUrl } from '../../utils/format';

/** The name of terms as a link to their document; only http(s) URLs from the API become links. */
export function TermsLink({ agreement }: { agreement: AgreementConsentAnemic }) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const url = safeExternalUrl(agreement.documentUrl);
  if (!url) {
    return <span>{agreement.name}</span>;
  }
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      {agreement.name}
      <OpenInNewIcon fontSize="inherit" titleAccess={t('opensInNewTab')} />
    </Link>
  );
}
