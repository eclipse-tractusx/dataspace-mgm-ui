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
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import type { Client } from 'openapi-fetch';
import type { components, paths } from '../../generated/c1-m2-api';

type Schemas = components['schemas'];

/** The DTOs of C1-M2 Registration as the generated types of specs/c1-m2/openapi.yaml name them (wire casing). */
export type C1M2Client = Client<paths>;
export type ProblemDto = Schemas['Problem'];
export type CountryDto = Schemas['Country'];
export type IdentifierTypeInfoDto = Schemas['IdentifierTypeInfo'];
export type CompanyRoleInfoDto = Schemas['CompanyRoleInfo'];
export type AgreementDto = Schemas['Agreement'];
export type AgreementVersionDto = Schemas['AgreementVersion'];
export type AgreementVersionPageDto = Schemas['AgreementVersionPage'];
export type AgreementVersionCreateDto = Schemas['AgreementVersionCreate'];
export type AddressDto = Schemas['Address'];
export type CompanyDataDto = Schemas['CompanyData'];
export type CompanyDataInputDto = Schemas['CompanyDataInput'];
export type AttestationSummaryDto = Schemas['AttestationSummary'];
export type DocumentInfoDto = Schemas['DocumentInfo'];
export type ApplicationDto = Schemas['Application'];
export type ApplicationWithReviewDto = Schemas['ApplicationWithReview'];
export type ApplicationSummaryDto = Schemas['ApplicationSummary'];
export type ApplicationPageDto = Schemas['ApplicationPage'];
export type ApplicationCreateDto = Schemas['ApplicationCreate'];
export type ApplicationUpdateDto = Schemas['ApplicationUpdate'];
export type SubmitRequestDto = Schemas['SubmitRequest'];
