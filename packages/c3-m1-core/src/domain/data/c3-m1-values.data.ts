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

/** Value sets of C3-M1 (components.schemas of specs/c3-m1/openapi.yaml), kept with the names and values of the spec. */
export type CompanyStatus = 'REQUESTED' | 'ACTIVE' | 'REJECTED' | 'INACTIVE';
export type CoreDataSource = 'EBW' | 'MANUAL';
export type DeactivationReason = 'MANUAL' | 'TRANSFERRED';
export type IdentifierType = 'EUID' | 'EBWOID' | 'VAT_ID' | 'COMMERCIAL_REG_NUMBER' | 'LEI_CODE' | 'EORI';
export type IdentifierSource = 'BUSINESS_WALLET' | 'DECLARED';
export type ChangeRequestStatus = 'OPEN' | 'APPROVED' | 'DECLINED' | 'WITHDRAWN';
export type CompanyRoleStatus = 'NONE' | 'REQUESTED' | 'ACTIVE' | 'INACTIVE';
export type AssignableBy = 'COMPANY' | 'SEED';
export type ConsentStatus = 'ACTIVE' | 'INACTIVE';
export type DocumentMediaType = 'application/pdf' | 'image/png' | 'image/jpeg';

export const COMPANY_STATUSES: ReadonlyArray<CompanyStatus> = ['REQUESTED', 'ACTIVE', 'REJECTED', 'INACTIVE'];
export const CORE_DATA_SOURCES: ReadonlyArray<CoreDataSource> = ['EBW', 'MANUAL'];
export const IDENTIFIER_TYPES: ReadonlyArray<IdentifierType> = ['EUID', 'EBWOID', 'VAT_ID', 'COMMERCIAL_REG_NUMBER', 'LEI_CODE', 'EORI'];
export const CHANGE_REQUEST_STATUSES: ReadonlyArray<ChangeRequestStatus> = ['OPEN', 'APPROVED', 'DECLINED', 'WITHDRAWN'];
export const DOCUMENT_MEDIA_TYPES: ReadonlyArray<DocumentMediaType> = ['application/pdf', 'image/png', 'image/jpeg'];
