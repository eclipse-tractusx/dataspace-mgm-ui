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

import type {
  AllApplicationsFilter,
  ApplicationUpdateInput,
  DocumentType,
  GetAnyApplicationResult,
  GetOwnApplicationResult,
  ListAgreementsResult,
  ListAllApplicationsResult,
  ListCompanyRolesResult,
  ListCountriesResult,
  ListIdentifierTypesResult,
  ListOwnApplicationsResult,
  SubmitInput,
} from '@dataspace-mgm/c1-m2-core';
import { useApiLanguage, useC1M2 } from './useOnboarding';
import { useLoad } from './useLoad';

/** "My applications" (GET /applications), newest first. */
export const useOwnApplications = () => useLoad<ListOwnApplicationsResult>((c1m2) => c1m2.listOwnApplications.execute({}), []);

/** One own application with its reviewStatus (GET /applications/{id}). */
export const useOwnApplication = (applicationId: string) =>
  useLoad<GetOwnApplicationResult>((c1m2) => c1m2.getOwnApplication.execute(applicationId), [applicationId]);

/** Countries and the identifier types of one country (GET /countries, GET /countries/{code}/identifier-types). */
export function useCountries() {
  const lang = useApiLanguage();
  return useLoad<ListCountriesResult>((c1m2) => c1m2.listCountries.execute(lang), [lang]);
}
export function useIdentifierTypes(countryCode: string) {
  const lang = useApiLanguage();
  return useLoad<ListIdentifierTypesResult>((c1m2) => c1m2.listIdentifierTypes.execute(countryCode, lang), [countryCode, lang]);
}

/** The selectable roles and the required terms of the chosen roles, in the language of the portal. */
export function useCompanyRoles() {
  const lang = useApiLanguage();
  return useLoad<ListCompanyRolesResult>((c1m2) => c1m2.listCompanyRoles.execute(lang), [lang]);
}
export function useAgreements(companyRoles: ReadonlyArray<string> | null) {
  const lang = useApiLanguage();
  return useLoad<ListAgreementsResult>(companyRoles ? (c1m2) => c1m2.listAgreements.execute(companyRoles, lang) : null, [companyRoles, lang]);
}

/** OSP staff: all applications (GET /osp/applications) and one of them (GET /osp/applications/{id}). */
export const useAllApplications = (filter: AllApplicationsFilter) =>
  useLoad<ListAllApplicationsResult>((c1m2) => c1m2.listAllApplications.execute(filter), [filter]);
export const useAnyApplication = (applicationId: string | null) =>
  useLoad<GetAnyApplicationResult>(applicationId ? (c1m2) => c1m2.getAnyApplication.execute(applicationId) : null, [applicationId]);

/** Opens the bytes of a supporting document in a new tab (GET …/documents/{id}); the page never sees HTTP. */
async function openBlob(result: { status: string; content?: Blob }): Promise<boolean> {
  if (result.status !== 'found' || !result.content) {
    return false;
  }
  const url = URL.createObjectURL(result.content);
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return true;
}

/** The changing operations of the person's own application, as use cases. */
export function useApplicationActions(applicationId: string) {
  const c1m2 = useC1M2();
  if (!c1m2) {
    return null;
  }
  return {
    update: (input: ApplicationUpdateInput) => c1m2.updateApplication.execute(applicationId, input),
    upload: (file: File, documentType: DocumentType) => c1m2.uploadDocument.execute(applicationId, { file, fileName: file.name, documentType }),
    openDocument: async (documentId: string) => openBlob(await c1m2.getDocument.execute(applicationId, documentId)),
    deleteDocument: (documentId: string) => c1m2.deleteDocument.execute(applicationId, documentId),
    submit: (input: SubmitInput) => c1m2.submitApplication.execute(applicationId, input),
    withdraw: () => c1m2.withdrawApplication.execute(applicationId),
    /** Verify again with the Business Wallet and replace the attestation (README 7.6). */
    reverify: async () => {
      const wallet = await c1m2.requestAttestation.execute();
      return wallet.status === 'received' ? c1m2.replaceAttestation.execute(applicationId, wallet.attestation) : wallet;
    },
  };
}

/** OSP staff open a supporting document of any application (GET /osp/applications/{id}/documents/{documentId}). */
export function useStaffDocuments() {
  const c1m2 = useC1M2();
  return c1m2 ? { open: async (applicationId: string, documentId: string) => openBlob(await c1m2.getAnyDocument.execute(applicationId, documentId)) } : null;
}
