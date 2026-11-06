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

import { useState } from 'react';
import type { ApplicationCreateInput, ApplicationKind, CompanyDataInput, CreateApplicationResult, RequestAttestationResult } from '@dataspace-mgm/c1-m2-core';
import { useC1M2 } from './useOnboarding';

export type StartState = { status: 'idle' } | { status: 'working' } | Exclude<RequestAttestationResult, { status: 'received' }> | CreateApplicationResult;

export interface StartChoice {
  kind: ApplicationKind;
  /** Reference to a company of this installation (REACTIVATION, or a return with TRANSFER). */
  bpn?: string;
}

/**
 * Creating the application. Roles: C1-M2 requires companyRoles at creation for a new company (README 6.2), the person
 * chooses them later (step "Roles and terms", PATCH); the POC sends ACTIVE_PARTICIPANT until the backend answers the
 * open point (README "Open points for the backend"). With a reference the roles come from C3-M1.
 */
function createInput(choice: StartChoice, extra: Pick<ApplicationCreateInput, 'verification' | 'attestation' | 'companyData'>): ApplicationCreateInput {
  const bpn = choice.bpn?.trim() || undefined;
  return { kind: choice.kind, ...extra, ...(bpn ? { bpn } : { companyRoles: ['ACTIVE_PARTICIPANT'] }) };
}

/** Start application: the wallet step and createApplication (EBW), or createApplication with the company data (DOCUMENTS). */
export function useStartApplication() {
  const c1m2 = useC1M2();
  const [state, setState] = useState<StartState>({ status: 'idle' });

  const withWallet = async (choice: StartChoice) => {
    if (!c1m2) {
      return;
    }
    setState({ status: 'working' });
    const wallet = await c1m2.requestAttestation.execute();
    if (wallet.status !== 'received') {
      setState(wallet);
      return;
    }
    setState(await c1m2.createApplication.execute(createInput(choice, { verification: 'EBW', attestation: wallet.attestation })));
  };

  const withDocuments = async (choice: StartChoice, companyData: CompanyDataInput) => {
    if (!c1m2) {
      return;
    }
    setState({ status: 'working' });
    setState(await c1m2.createApplication.execute(createInput(choice, { verification: 'DOCUMENTS', companyData })));
  };

  return { state, withWallet, withDocuments, reset: () => setState({ status: 'idle' }) };
}
