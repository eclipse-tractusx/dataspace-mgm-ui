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
import { MONO } from '../utils/mono';

/** The company of a credential: its name with the BPN below, or only the BPN when C3-M1 has no name. */
export function CompanyName({ credential, inline = false }: { credential: CredentialDetailAnemic; inline?: boolean }) {
  if (!credential.companyName) {
    return (
      <Box component="span" sx={{ fontFamily: MONO, fontWeight: inline ? 400 : 600 }}>
        {credential.bpn}
      </Box>
    );
  }
  return (
    <>
      <Box component="span" sx={{ display: inline ? 'inline' : 'block', fontWeight: inline ? 400 : 600 }}>
        {credential.companyName}
      </Box>
      {inline && ' '}
      <Box component="span" sx={{ display: inline ? 'inline' : 'block', fontFamily: MONO, fontSize: '0.8125rem', color: 'text.secondary' }}>
        {credential.bpn}
      </Box>
    </>
  );
}
