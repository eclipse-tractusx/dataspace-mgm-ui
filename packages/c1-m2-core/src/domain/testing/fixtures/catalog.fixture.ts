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

import type { AgreementVersionAnemic } from '../../anemics/agreement-version.anemic';
import type { Language } from '../../data/c1-m2-enums.data';

/** A company role of the catalogue (`CATALOG_FILE`, structure of C1-M2 README 14.3). */
export interface CompanyRoleFixture {
  role: string;
  selectable: boolean;
  name: Readonly<Record<Language, string>>;
  description: Readonly<Record<Language, string>>;
  /** Initial assignment of terms; after that the `companyRoles` of the active versions decide (README 7.16). */
  agreements: ReadonlyArray<string>;
}

/** C1-M2 README 14.3 verbatim. */
export const COMPANY_ROLES: ReadonlyArray<CompanyRoleFixture> = [
  {
    role: 'ACTIVE_PARTICIPANT',
    selectable: true,
    name: { de: 'Teilnehmer', en: 'Participant' },
    description: { de: 'Datenanbieter, Datenkonsument, App-Nutzer', en: 'Data provider, data consumer, app user' },
    agreements: ['terms-active-participant', 'security-regulations'],
  },
  {
    role: 'APP_PROVIDER',
    selectable: true,
    name: { de: 'App-Anbieter', en: 'App provider' },
    description: { de: 'bietet Apps im Marktplatz an', en: 'offers apps in the marketplace' },
    agreements: ['terms-app-provider'],
  },
  {
    role: 'SERVICE_PROVIDER',
    selectable: true,
    name: { de: 'Service-Anbieter', en: 'Service provider' },
    description: { de: 'bietet Services im Marktplatz an', en: 'offers services in the marketplace' },
    agreements: ['terms-service-provider'],
  },
  {
    role: 'ONBOARDING_SERVICE_PROVIDER',
    selectable: false,
    name: { de: 'Onboarding-Dienstleister', en: 'Onboarding service provider' },
    description: { de: 'Unternehmen des OSP', en: 'Company of the OSP' },
    agreements: [],
  },
];

const INITIAL = { status: 'ACTIVE', reconsentRequired: false, reconsentDueAt: null, createdAt: '2026-01-01T00:00:00Z', createdBy: null } as const;

/** The terms of C1-M2 README 14.3 as versions; `companyRoles` from the roles' `agreements`. */
export const AGREEMENT_VERSIONS: ReadonlyArray<AgreementVersionAnemic> = [
  {
    agreementKey: 'osp-terms',
    version: '1.0',
    party: 'OSP',
    scope: 'ALL',
    title: { de: 'Nutzungsbedingungen des OSP', en: 'Terms of use of the OSP' },
    documentUrls: {
      de: 'https://osp-a.example.org/terms/osp-terms-1.0-de.pdf',
      en: 'https://osp-a.example.org/terms/osp-terms-1.0-en.pdf',
    },
    ...INITIAL,
  },
  {
    agreementKey: 'terms-active-participant',
    version: '1.0',
    party: 'DATASPACE',
    scope: 'COMPANY_ROLE',
    companyRoles: ['ACTIVE_PARTICIPANT'],
    title: { de: 'Nutzungsbedingungen Teilnehmer', en: 'Terms and conditions participant' },
    documentUrls: {
      de: 'https://dataspace.example.org/terms/active-participant-1.0-de.pdf',
      en: 'https://dataspace.example.org/terms/active-participant-1.0-en.pdf',
    },
    ...INITIAL,
  },
  {
    agreementKey: 'security-regulations',
    version: '1.0',
    party: 'DATASPACE',
    scope: 'COMPANY_ROLE',
    companyRoles: ['ACTIVE_PARTICIPANT'],
    title: { de: 'Sicherheitsregeln', en: 'Security regulations' },
    documentUrls: { en: 'https://dataspace.example.org/terms/security-1.0-en.pdf' },
    ...INITIAL,
  },
  {
    agreementKey: 'terms-app-provider',
    version: '1.0',
    party: 'DATASPACE',
    scope: 'COMPANY_ROLE',
    companyRoles: ['APP_PROVIDER'],
    title: { de: 'Nutzungsbedingungen App-Anbieter', en: 'Terms and conditions app provider' },
    documentUrls: { en: 'https://dataspace.example.org/terms/app-provider-1.0-en.pdf' },
    ...INITIAL,
  },
  {
    agreementKey: 'terms-service-provider',
    version: '1.0',
    party: 'DATASPACE',
    scope: 'COMPANY_ROLE',
    companyRoles: ['SERVICE_PROVIDER'],
    title: { de: 'Nutzungsbedingungen Service-Anbieter', en: 'Terms and conditions service provider' },
    documentUrls: { en: 'https://dataspace.example.org/terms/service-provider-1.0-en.pdf' },
    ...INITIAL,
  },
];
