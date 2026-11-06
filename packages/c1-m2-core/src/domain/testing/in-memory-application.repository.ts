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

import type { ApplicationSummaryAnemic } from '../anemics/application-summary.anemic';
import type { ApplicationWithReviewAnemic } from '../anemics/application-with-review.anemic';
import type { ApplicationAnemic } from '../anemics/application.anemic';
import type { AttestationSummaryAnemic } from '../anemics/attestation-summary.anemic';
import type { DocumentInfoAnemic } from '../anemics/document-info.anemic';
import type { ApplicationCreateInput } from '../data/application-create-input.data';
import type { ApplicationUpdateInput } from '../data/application-update-input.data';
import type { ComparisonField, DocumentType, MismatchField, ReviewStatus } from '../data/c1-m2-enums.data';
import type { AgreementRef, ComparisonEntry, Identifier, ValidationError } from '../data/c1-m2-shapes.data';
import type { CreatedApplicationData } from '../data/created-application.data';
import type { DocumentContent } from '../data/document-content.data';
import type { DocumentUploadInput } from '../data/document-upload-input.data';
import type { AllApplicationsFilter, OwnApplicationsFilter } from '../data/list-filters.data';
import type { PageData } from '../data/page.data';
import type { SubmitInput } from '../data/submit-input.data';
import type { ApplicationRepository } from '../repositories/application.repository';
import { companyDataErrors, companyRoleErrors, identifierListErrors } from './application-rules.fake';
import { CLOCK_SKEW_SECONDS, checkMockAttestation } from './attestation-check.fake';
import { type BuiltCompanyData, buildDocumentsCompanyData, buildEbwCompanyData, normalisedIdentifiers, type PersonCompanyInput } from './company-data.fake';
import { contentTypeOf, isValidFileName, sha256Hex } from './document-check.fake';
import { MOCK_PDF_CONTENT } from './fixtures/applications.fixture';
import { COMPANY_ROLES, type CompanyRoleFixture } from './fixtures/catalog.fixture';
import { EXISTING_COMPANIES, type ExistingCompanyFixture, FRAMEWORK_COMPANY_IDS } from './fixtures/companies.fixture';
import { REFERENCE_DATA, type ReferenceDataFixture } from './fixtures/reference-data.fixture';
import { type AgreementVersionSource, InMemoryAgreementRepository } from './in-memory-agreement.repository';
import type { MockAttestationClaims } from './mock-attestation-claims';
import { MOCK_ATTESTATION_AUDIENCE, MOCK_ATTESTATION_CLIENT_ID } from './mock-attestation';
import type { CallerFixture } from './mock-caller';
import { pageOf } from './paging.fake';
import { forbiddenProblem, invalidStateProblem, problem, throwIfInvalid } from './problems.fake';

export interface InMemoryApplicationOptions {
  /** The signed-in person (token claims: sub, names, company_id, permissions). */
  caller: CallerFixture;
  /** Preloaded applications; their attestation `jti`s count as used. */
  applications?: ReadonlyArray<ApplicationWithReviewAnemic>;
  /** Content of preloaded documents by `documentId`; default MOCK_PDF_CONTENT. */
  documentContents?: Readonly<Record<string, Uint8Array>>;
  /** The stand-in of C3-M1 for REACTIVATION and the return (README 11.2). */
  existingCompanies?: ReadonlyArray<ExistingCompanyFixture>;
  /** `jti`s used before, e.g. by applications of other installations' tests. */
  usedJtis?: ReadonlyArray<string>;
  referenceData?: ReferenceDataFixture;
  companyRoles?: ReadonlyArray<CompanyRoleFixture>;
  /** Source of the required terms; pass the InMemoryAgreementRepository of the module so new versions count. */
  agreements?: AgreementVersionSource;
  /** DOCUMENTS_ENABLED, default true. */
  documentsEnabled?: boolean;
  /** DOCUMENT_MAX_BYTES, default 1 MiB (the backend default is 10 MiB). */
  documentMaxBytes?: number;
  /** DOCUMENT_MAX_COUNT, default 10. */
  documentMaxCount?: number;
  /** ATTESTATION_CLIENT_IDS, default `['osp-a-ui']`; empty = no check. */
  allowedClientIds?: ReadonlyArray<string>;
  /** ATTESTATION_MAX_AGE in days, default 30. */
  attestationMaxAgeDays?: number;
  /** The review status after a submission, as the stand-in of C1-M3 would report it; default OPEN. */
  reviewStatusAfterSubmit?: ReviewStatus;
  now?: () => Date;
  /** Every call fails with this error, e.g. a CoreHttpException(502) for "not reachable". */
  failure?: Error | null;
}

interface StoredDocument {
  info: DocumentInfoAnemic;
  content: Uint8Array;
}

interface StoredApplication {
  application: ApplicationAnemic;
  reviewStatus: ReviewStatus;
  /** Claims of the current verification attestation; null in the verification path DOCUMENTS. */
  claims: MockAttestationClaims | null;
  /** What the person gave, to compare again after a change or a new attestation. */
  personInput: PersonCompanyInput;
  documents: StoredDocument[];
  requiredAgreements: ReadonlyArray<AgreementRef>;
}

/** The state of the fake backend, shared by the views of several callers (see `as`). */
interface SharedState {
  stored: Map<string, StoredApplication>;
  used: Set<string>;
}

const OPEN_STATUSES = ['CREATED', 'SUBMITTED'];
const KINDS = ['ONBOARDING', 'REACTIVATION', 'TRANSFER'];
const VERIFICATIONS = ['EBW', 'DOCUMENTS'];
const DOCUMENT_TYPES: ReadonlyArray<DocumentType> = ['COMMERCIAL_REGISTER_EXTRACT', 'POWER_OF_ATTORNEY', 'OTHER'];
const AGREEMENT_KEY = /^[a-z0-9-]{1,64}$/;
const BPN = /^BPNL[A-Z0-9]{12}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

const seconds = (iso: string | undefined): number => Math.floor(Date.parse(iso ?? '') / 1000);
const isoOf = (unixSeconds: number): string => new Date(unixSeconds * 1000).toISOString();
const resultOf = (comparison: ReadonlyArray<ComparisonEntry>, field: ComparisonField) => comparison.find((entry) => entry.field === field)?.result;
const attested = (comparison: ReadonlyArray<ComparisonEntry>, field: ComparisonField) => ['FROM_ATTESTATION', 'MATCH'].includes(resultOf(comparison, field) ?? '');

/** The claims of a preloaded application, rebuilt from its data (fixtures keep data and comparison consistent). */
function claimsOf(application: ApplicationAnemic): MockAttestationClaims | null {
  const attestation = application.attestation;
  if (application.verification !== 'EBW' || !attestation) {
    return null;
  }
  const { companyData, comparison } = application;
  const identifier = (type: Identifier['type']) => companyData.identifiers.find((entry) => entry.type === type && entry.source === 'ATTESTATION')?.value;
  const address = companyData.address;
  const street = [address.streetName, address.streetNumber].filter(Boolean).join(' ');
  const hasAddress = attested(comparison, 'STREET') || attested(comparison, 'CITY');
  const { representation } = attestation;
  return {
    iss: attestation.issuer,
    sub: identifier('EBWOID') ?? '',
    aud: MOCK_ATTESTATION_AUDIENCE,
    iat: seconds(attestation.issuedAt),
    exp: seconds(attestation.expiresAt),
    jti: attestation.attestationId,
    attestation_version: '0.2',
    purpose: 'onboarding',
    verified_at: seconds(attestation.verifiedAt ?? attestation.issuedAt),
    client_id: MOCK_ATTESTATION_CLIENT_ID,
    person: { given_name: attestation.person.givenName, family_name: attestation.person.familyName },
    company: {
      legal_name: companyData.legalName,
      ebwoid: identifier('EBWOID') ?? '',
      ...(identifier('EUID') ? { euid: identifier('EUID') } : {}),
      country: address.countryCode,
      ...(hasAddress
        ? {
            address: {
              ...(attested(comparison, 'STREET') ? { street_address: street } : {}),
              ...(attested(comparison, 'POSTAL_CODE') && address.postalCode ? { postal_code: address.postalCode } : {}),
              ...(attested(comparison, 'CITY') ? { locality: address.city } : {}),
              country: address.countryCode,
            },
          }
        : {}),
    },
    representation: {
      confirmed: representation.confirmed,
      result: representation.result,
      type: representation.type,
      role: representation.role,
      valid_until: representation.validUntil,
      issuer: representation.issuer,
      trust: representation.trust,
      reasons: representation.reasons,
    },
    evidence: [],
  };
}

/** What the person gave for a preloaded application: every field that does not come from the attestation. */
function personInputOf(application: ApplicationAnemic): PersonCompanyInput {
  const { companyData, comparison, verification } = application;
  const fromAttestation = (field: ComparisonField) => verification === 'EBW' && resultOf(comparison, field) === 'FROM_ATTESTATION';
  const addressGiven = verification === 'DOCUMENTS' || (['STREET', 'POSTAL_CODE', 'CITY', 'COUNTRY'] as const).some((field) => !fromAttestation(field));
  return {
    ...(fromAttestation('LEGAL_NAME') ? {} : { legalName: companyData.legalName }),
    shortName: companyData.shortName,
    ...(addressGiven ? { address: companyData.address } : {}),
    identifiers: companyData.identifiers.filter((entry) => entry.source === 'APPLICANT').map(({ type, value }) => ({ type, value })),
  };
}

function summaryOf(claims: MockAttestationClaims): AttestationSummaryAnemic {
  const { representation } = claims;
  return {
    attestationId: claims.jti,
    issuer: claims.iss,
    issuedAt: isoOf(claims.iat),
    expiresAt: isoOf(claims.exp),
    verifiedAt: isoOf(claims.verified_at),
    person: { givenName: claims.person.given_name, familyName: claims.person.family_name },
    representation: {
      confirmed: representation.confirmed,
      ...(representation.result !== undefined ? { result: representation.result } : {}),
      ...(representation.type !== undefined ? { type: representation.type } : {}),
      ...(representation.role !== undefined ? { role: representation.role } : {}),
      ...(representation.valid_until !== undefined ? { validUntil: representation.valid_until } : {}),
      ...(representation.issuer !== undefined ? { issuer: representation.issuer } : {}),
      ...(representation.trust !== undefined ? { trust: representation.trust } : {}),
      ...(representation.reasons !== undefined ? { reasons: representation.reasons } : {}),
    },
  };
}

function summaryOfApplication(application: ApplicationAnemic): ApplicationSummaryAnemic {
  return {
    id: application.id,
    companyId: application.companyId,
    kind: application.kind,
    existingCompany: application.existingCompany,
    verification: application.verification,
    status: application.status,
    legalName: application.companyData.legalName,
    countryCode: application.companyData.address.countryCode,
    companyRoles: application.companyRoles,
    createdAt: application.createdAt,
    submittedAt: application.submittedAt,
  };
}

/**
 * In-memory adapter of ApplicationRepository: a **test double of C1-M2**, so that pages can be built and tested for
 * every result state. It reproduces the status model and the expected error outcomes of C1-M2 README 6 and 7 from the
 * same inputs; its rules are copies of the backend's and never a source of truth for a page (AGENTS.md rule 3).
 * Not reproduced: signature, issuer, audience, algorithm and time-before-validity of the attestation, the per-country
 * regular expressions of identifiers, the audit log and the events.
 */
export class InMemoryApplicationRepository implements ApplicationRepository {
  public readonly calls: string[] = [];
  private readonly stored: Map<string, StoredApplication>;
  private readonly used: Set<string>;
  private readonly initialOptions: InMemoryApplicationOptions;
  private readonly caller: CallerFixture;
  private readonly existingCompanies: ReadonlyArray<ExistingCompanyFixture>;
  private readonly referenceData: ReferenceDataFixture;
  private readonly companyRoles: ReadonlyArray<CompanyRoleFixture>;
  private readonly agreements: AgreementVersionSource;
  private readonly options: Required<
    Pick<InMemoryApplicationOptions, 'documentsEnabled' | 'documentMaxBytes' | 'documentMaxCount' | 'allowedClientIds' | 'attestationMaxAgeDays' | 'reviewStatusAfterSubmit'>
  >;
  private readonly now: () => Date;
  private failure: Error | null;

  /** `shared` is internal: `as(caller)` passes the state of the backend to the view of another person. */
  constructor(options: InMemoryApplicationOptions, shared?: SharedState) {
    this.initialOptions = options;
    this.caller = options.caller;
    this.existingCompanies = options.existingCompanies ?? EXISTING_COMPANIES;
    this.referenceData = options.referenceData ?? REFERENCE_DATA;
    this.companyRoles = options.companyRoles ?? COMPANY_ROLES;
    this.agreements = options.agreements ?? new InMemoryAgreementRepository({ companyRoles: this.companyRoles });
    this.options = {
      documentsEnabled: options.documentsEnabled ?? true,
      documentMaxBytes: options.documentMaxBytes ?? 1024 * 1024,
      documentMaxCount: options.documentMaxCount ?? 10,
      allowedClientIds: options.allowedClientIds ?? [MOCK_ATTESTATION_CLIENT_ID],
      attestationMaxAgeDays: options.attestationMaxAgeDays ?? 30,
      reviewStatusAfterSubmit: options.reviewStatusAfterSubmit ?? 'OPEN',
    };
    this.now = options.now ?? (() => new Date());
    this.failure = options.failure ?? null;
    this.stored = shared?.stored ?? new Map();
    this.used = shared?.used ?? new Set(options.usedJtis ?? []);
    if (shared) {
      return;
    }
    const placeholder = new TextEncoder().encode(MOCK_PDF_CONTENT);
    for (const { reviewStatus, ...application } of options.applications ?? []) {
      const claims = claimsOf(application);
      if (claims) {
        this.used.add(claims.jti);
      }
      this.stored.set(application.id, {
        application,
        reviewStatus,
        claims,
        personInput: personInputOf(application),
        documents: application.documents.map((info) => ({ info, content: options.documentContents?.[info.documentId] ?? placeholder })),
        requiredAgreements: application.consents.map(({ agreementKey, version }) => ({ agreementKey, version })),
      });
    }
  }

  /**
   * The same backend seen by another person (same applications, used `jti`s and settings), e.g. Max Mustermann reading
   * Erika Mustermann's application (README 13 case 8). Its `calls` are its own; the failure is not taken over.
   */
  public as(caller: CallerFixture): InMemoryApplicationRepository {
    return new InMemoryApplicationRepository({ ...this.initialOptions, caller, failure: null }, { stored: this.stored, used: this.used });
  }

  /** Every application with its review status, read-only, for assertions. */
  public get applications(): ReadonlyArray<ApplicationWithReviewAnemic> {
    return [...this.stored.values()].map(({ application, reviewStatus }) => ({ ...application, reviewStatus }));
  }

  /** Every stored supporting document with its content, read-only, for assertions. */
  public get documents(): ReadonlyArray<{ applicationId: string; info: DocumentInfoAnemic; content: Uint8Array }> {
    return [...this.stored.values()].flatMap(({ application, documents }) => documents.map((document) => ({ applicationId: application.id, ...document })));
  }

  /** The `jti`s that can no longer be used (README 6.4 single use). */
  public get usedJtis(): ReadonlyArray<string> {
    return [...this.used];
  }

  /** The required terms recorded at submission (README 6.8), for assertions. */
  public requiredAgreementsOf(applicationId: string): ReadonlyArray<AgreementRef> {
    return this.stored.get(applicationId)?.requiredAgreements ?? [];
  }

  /** Makes every following call fail with this error (null: work again). */
  public setFailure(failure: Error | null): void {
    this.failure = failure;
  }

  /** Test helper (stand-in of C1-M3): the review case of an application, e.g. APPROVED or UNKNOWN. */
  public setReviewStatus(applicationId: string, reviewStatus: ReviewStatus): void {
    this.storedOrThrow(applicationId).reviewStatus = reviewStatus;
  }

  /** Test helper for the step `complete-application` (README 8.1): SUBMITTED → COMPLETED; repeated: unchanged. */
  public complete(applicationId: string): void {
    const stored = this.storedOrThrow(applicationId);
    if (stored.application.status === 'COMPLETED') {
      return;
    }
    if (stored.application.status !== 'SUBMITTED') {
      throw invalidStateProblem();
    }
    const at = this.iso();
    stored.application = { ...stored.application, status: 'COMPLETED', completedAt: at, changedAt: at };
    stored.reviewStatus = 'APPROVED';
  }

  /** Test helper for the step `close-application` (README 8.2): SUBMITTED → DECLINED with the reason. */
  public decline(applicationId: string, reason: string): void {
    const stored = this.storedOrThrow(applicationId);
    if (stored.application.status === 'DECLINED' || stored.application.status === 'WITHDRAWN') {
      return;
    }
    if (stored.application.status !== 'SUBMITTED') {
      throw invalidStateProblem();
    }
    const at = this.iso();
    stored.application = { ...stored.application, status: 'DECLINED', declineReason: reason, closedAt: at, changedAt: at };
    stored.reviewStatus = 'DECLINED';
  }

  public async create(input: ApplicationCreateInput): Promise<CreatedApplicationData> {
    this.enterOwn('create');
    if (this.caller.companyId) {
      throw problem('account-bound', 403, 'The account is already bound to a company');
    }
    const personInput: PersonCompanyInput = {
      legalName: input.companyData?.legalName,
      shortName: input.companyData?.shortName ?? null,
      address: input.companyData?.address,
      identifiers: normalisedIdentifiers(input.companyData?.identifiers),
    };
    const documentsData = this.checkCreateInput(input, personInput);
    if (input.verification === 'DOCUMENTS' && !this.options.documentsEnabled) {
      throw problem('documents-disabled', 400, 'The verification path without Business Wallet is switched off');
    }
    const claims = input.verification === 'EBW' ? this.checkAttestation(input.attestation as string) : null;

    const open = [...this.stored.values()].find(
      ({ application }) => application.applicant.sub === this.caller.sub && OPEN_STATUSES.includes(application.status),
    );
    if (open) {
      if (claims && open.claims?.jti === claims.jti) {
        return { application: open.application, repeated: true };
      }
      throw problem('open-application-exists', 409, 'The person already has an open application', { existingApplicationId: open.application.id });
    }
    if (claims && this.used.has(claims.jti)) {
      throw problem('attestation-used', 409, 'The verification attestation was already used');
    }

    const company = input.companyId || input.bpn ? this.eligibleCompany(input) : null;
    const built = claims ? buildEbwCompanyData(claims, personInput) : (documentsData as BuiltCompanyData);
    if (company) {
      this.throwIfNotTheCompany(company, built);
      if (this.openApplicationOfCompany(company.id)) {
        throw problem('company-has-open-application', 409, 'There already is an open application for the company');
      }
    }
    const companyRoles = input.companyRoles ?? company?.companyRoles.filter((role) => this.isSelectable(role)) ?? [];
    throwIfInvalid([...companyDataErrors(built.companyData, input.verification, this.referenceData), ...companyRoleErrors(companyRoles, this.companyRoles)]);

    const at = this.iso();
    const application: ApplicationAnemic = {
      id: crypto.randomUUID(),
      companyId: company?.id ?? this.newCompanyId(built),
      kind: input.kind,
      existingCompany: company !== null,
      verification: input.verification,
      applicant: { sub: this.caller.sub, givenName: this.caller.givenName, familyName: this.caller.familyName },
      status: 'CREATED',
      companyData: built.companyData,
      companyRoles: [...companyRoles],
      attestation: claims ? summaryOf(claims) : null,
      comparison: built.comparison,
      documents: [],
      representationDeclared: null,
      consents: [],
      declineReason: null,
      createdAt: at,
      changedAt: at,
      submittedAt: null,
      withdrawnAt: null,
      closedAt: null,
      completedAt: null,
    };
    this.stored.set(application.id, { application, reviewStatus: 'NONE', claims, personInput, documents: [], requiredAgreements: [] });
    if (claims) {
      this.used.add(claims.jti);
    }
    return { application, repeated: false };
  }

  public async listOwn(filter: OwnApplicationsFilter): Promise<PageData<ApplicationSummaryAnemic>> {
    this.enterOwn('listOwn');
    return this.pageOfApplications(
      ({ application }) => application.applicant.sub === this.caller.sub && (!filter.status?.length || filter.status.includes(application.status)),
      filter,
    );
  }

  public async getOwn(applicationId: string): Promise<ApplicationWithReviewAnemic | null> {
    this.enterOwn('getOwn');
    const stored = this.own(applicationId);
    return stored ? { ...stored.application, reviewStatus: stored.reviewStatus } : null;
  }

  public async update(applicationId: string, input: ApplicationUpdateInput): Promise<ApplicationAnemic | null> {
    this.enterOwn('update');
    const stored = this.own(applicationId);
    if (!stored) {
      return null;
    }
    if (stored.application.status !== 'CREATED') {
      throw invalidStateProblem();
    }
    const fields = (['legalName', 'shortName', 'address', 'identifiers', 'companyRoles'] as const).filter((field) => input[field] !== undefined);
    throwIfInvalid([
      ...(fields.length === 0 ? [{ field: 'body', message: 'At least one of legalName, shortName, address, identifiers, companyRoles.' }] : []),
      ...identifierListErrors(input.identifiers ?? [], 'identifiers'),
    ]);
    const previous = stored.personInput;
    const personInput: PersonCompanyInput = {
      legalName: input.legalName ?? previous.legalName,
      shortName: input.shortName !== undefined ? input.shortName : previous.shortName,
      address: input.address ?? previous.address,
      identifiers: input.identifiers ? normalisedIdentifiers(input.identifiers) : previous.identifiers,
    };
    const built = stored.claims ? buildEbwCompanyData(stored.claims, personInput) : buildDocumentsCompanyData(personInput);
    if (stored.application.existingCompany && input.identifiers) {
      const company = this.existingCompanies.find((candidate) => candidate.id === stored.application.companyId);
      if (company) {
        this.throwIfNotTheCompany(company, built);
      }
    }
    const companyRoles = input.companyRoles ?? stored.application.companyRoles;
    throwIfInvalid([
      ...companyDataErrors(built.companyData, stored.application.verification, this.referenceData),
      ...companyRoleErrors(companyRoles, this.companyRoles),
    ]);
    stored.personInput = personInput;
    stored.application = { ...stored.application, ...built, companyRoles: [...companyRoles], changedAt: this.iso() };
    return stored.application;
  }

  public async replaceAttestation(applicationId: string, attestation: string): Promise<ApplicationAnemic | null> {
    this.enterOwn('replaceAttestation');
    const stored = this.own(applicationId);
    if (!stored) {
      return null;
    }
    if (stored.application.status !== 'CREATED' || !stored.claims) {
      throw invalidStateProblem();
    }
    const claims = this.checkAttestation(attestation);
    if (claims.jti === stored.claims.jti) {
      return stored.application;
    }
    if (this.used.has(claims.jti)) {
      throw problem('attestation-used', 409, 'The verification attestation was already used');
    }
    const current = stored.claims.company;
    const fields: MismatchField[] = [];
    if (claims.company.ebwoid !== current.ebwoid) {
      fields.push('EBWOID');
    }
    if (claims.company.euid && current.euid && claims.company.euid !== current.euid) {
      fields.push('EUID');
    }
    if (claims.company.country !== current.country) {
      fields.push('COUNTRY');
    }
    if (fields.length > 0) {
      throw problem('attestation-mismatch', 400, 'The new verification attestation concerns another company', { fields });
    }
    const built = buildEbwCompanyData(claims, stored.personInput);
    throwIfInvalid(companyDataErrors(built.companyData, 'EBW', this.referenceData));
    this.used.add(claims.jti);
    stored.claims = claims;
    stored.application = { ...stored.application, ...built, attestation: summaryOf(claims), changedAt: this.iso() };
    return stored.application;
  }

  public async uploadDocument(applicationId: string, input: DocumentUploadInput): Promise<DocumentInfoAnemic | null> {
    this.enterOwn('uploadDocument');
    const stored = this.own(applicationId);
    if (!stored) {
      return null;
    }
    if (stored.application.status !== 'CREATED' || stored.application.verification !== 'DOCUMENTS') {
      throw invalidStateProblem();
    }
    const content = new Uint8Array(await input.file.arrayBuffer());
    const contentType = contentTypeOf(content);
    const errors: ValidationError[] = [];
    if (!DOCUMENT_TYPES.includes(input.documentType)) {
      errors.push({ field: 'documentType', message: 'documentType is COMMERCIAL_REGISTER_EXTRACT, POWER_OF_ATTORNEY or OTHER.' });
    }
    if (!isValidFileName(input.fileName)) {
      errors.push({ field: 'file', message: 'The file name has 1 to 200 characters, without path parts and control characters.' });
    }
    if (content.length === 0 || content.length > this.options.documentMaxBytes) {
      errors.push({ field: 'file', message: `A supporting document has 1 to ${this.options.documentMaxBytes} bytes.` });
    }
    if (!contentType) {
      errors.push({ field: 'file', message: 'Only PDF, PNG or JPEG (checked by the first bytes).' });
    }
    if (stored.documents.length >= this.options.documentMaxCount) {
      errors.push({ field: 'file', message: `At most ${this.options.documentMaxCount} supporting documents per application.` });
    }
    throwIfInvalid(errors);
    const info: DocumentInfoAnemic = {
      documentId: crypto.randomUUID(),
      documentType: input.documentType,
      fileName: input.fileName,
      contentType: contentType as DocumentInfoAnemic['contentType'],
      sizeBytes: content.length,
      sha256: await sha256Hex(content),
      uploadedAt: this.iso(),
    };
    stored.documents.push({ info, content });
    stored.application = { ...stored.application, documents: stored.documents.map((document) => document.info), changedAt: info.uploadedAt };
    return info;
  }

  public async getDocument(applicationId: string, documentId: string): Promise<DocumentContent | null> {
    this.enterOwn('getDocument');
    return this.contentOf(this.own(applicationId), documentId);
  }

  public async deleteDocument(applicationId: string, documentId: string): Promise<boolean> {
    this.enterOwn('deleteDocument');
    const stored = this.own(applicationId);
    if (!stored) {
      return false;
    }
    if (stored.application.status !== 'CREATED') {
      throw invalidStateProblem();
    }
    const index = stored.documents.findIndex((document) => document.info.documentId === documentId);
    if (index < 0) {
      return false;
    }
    stored.documents.splice(index, 1);
    stored.application = { ...stored.application, documents: stored.documents.map((document) => document.info), changedAt: this.iso() };
    return true;
  }

  public async submit(applicationId: string, input: SubmitInput): Promise<ApplicationAnemic | null> {
    this.enterOwn('submit');
    const stored = this.own(applicationId);
    if (!stored) {
      return null;
    }
    const { application } = stored;
    if (application.status === 'SUBMITTED') {
      return application;
    }
    if (application.status !== 'CREATED') {
      throw invalidStateProblem();
    }
    throwIfInvalid(this.consentErrors(input));
    if (stored.claims && this.isTooOld(stored.claims)) {
      throw problem('attestation-expired', 409, 'The verification attestation is expired or too old');
    }
    if (application.verification === 'DOCUMENTS') {
      const hasExtract = stored.documents.some((document) => document.info.documentType === 'COMMERCIAL_REGISTER_EXTRACT');
      const declarationMissing = input.representationDeclared !== true;
      if (!hasExtract || declarationMissing) {
        throw problem('documents-incomplete', 400, 'Register extract or declaration of representation missing', {
          missingDocumentTypes: hasExtract ? [] : ['COMMERCIAL_REGISTER_EXTRACT'],
          representationDeclarationMissing: declarationMissing,
        });
      }
    }
    const required = this.requiredAgreements(application.companyRoles);
    const notRequired = input.consents.filter((consent) => !required.some((agreement) => agreement.agreementKey === consent.agreementKey));
    throwIfInvalid(notRequired.map((consent) => ({ field: 'consents', message: `Terms ${consent.agreementKey} are unknown or not required.` })));
    const missing = required.filter(
      (agreement) => !input.consents.some((consent) => consent.agreementKey === agreement.agreementKey && consent.version === agreement.version),
    );
    if (missing.length > 0) {
      throw problem('consents-incomplete', 400, 'Consent to required terms missing', { missing });
    }
    const at = this.iso();
    stored.requiredAgreements = required;
    stored.reviewStatus = this.options.reviewStatusAfterSubmit;
    stored.application = {
      ...application,
      status: 'SUBMITTED',
      consents: input.consents.map(({ agreementKey, version, language }) => ({ agreementKey, version, language, givenAt: at })),
      representationDeclared: application.verification === 'DOCUMENTS' ? true : null,
      submittedAt: at,
      changedAt: at,
    };
    return stored.application;
  }

  public async withdraw(applicationId: string): Promise<ApplicationAnemic | null> {
    this.enterOwn('withdraw');
    const stored = this.own(applicationId);
    if (!stored) {
      return null;
    }
    const { application } = stored;
    if (application.status === 'WITHDRAWN') {
      return application;
    }
    if (application.status !== 'CREATED' && application.status !== 'SUBMITTED') {
      throw invalidStateProblem();
    }
    if (application.status === 'SUBMITTED') {
      if (stored.reviewStatus === 'APPROVED' || stored.reviewStatus === 'DECLINED') {
        throw problem('already-decided', 409, 'OSP staff have already decided', { reviewStatus: stored.reviewStatus });
      }
      if (stored.reviewStatus === 'UNKNOWN') {
        throw problem('upstream-error', 502, 'C1-M3 not reachable');
      }
      stored.reviewStatus = 'CLOSED';
    }
    const at = this.iso();
    stored.application = { ...application, status: 'WITHDRAWN', withdrawnAt: at, changedAt: at };
    return stored.application;
  }

  public async listAll(filter: AllApplicationsFilter): Promise<PageData<ApplicationSummaryAnemic>> {
    this.enterOsp('listAll');
    return this.pageOfApplications(
      ({ application }) =>
        (!filter.status?.length || filter.status.includes(application.status)) &&
        (!filter.kind?.length || filter.kind.includes(application.kind)) &&
        (!filter.verification?.length || filter.verification.includes(application.verification)) &&
        (!filter.companyId || application.companyId === filter.companyId),
      filter,
    );
  }

  public async getAny(applicationId: string): Promise<ApplicationWithReviewAnemic | null> {
    this.enterOsp('getAny');
    const stored = this.stored.get(applicationId);
    return stored ? { ...stored.application, reviewStatus: stored.reviewStatus } : null;
  }

  public async getAnyDocument(applicationId: string, documentId: string): Promise<DocumentContent | null> {
    this.enterOsp('getAnyDocument');
    return this.contentOf(this.stored.get(applicationId) ?? null, documentId);
  }

  private enterOwn(method: string): void {
    this.enter(method, 'register_company');
  }

  private enterOsp(method: string): void {
    this.enter(method, 'view_applications');
  }

  private enter(method: string, permission: string): void {
    this.calls.push(method);
    if (this.failure) {
      throw this.failure;
    }
    if (!this.caller.permissions.includes(permission)) {
      throw forbiddenProblem();
    }
  }

  private iso(): string {
    return this.now().toISOString();
  }

  /** Scope `own`: another person's application is invisible (404, README 6.3). */
  private own(applicationId: string): StoredApplication | null {
    const stored = this.stored.get(applicationId);
    return stored && stored.application.applicant.sub === this.caller.sub ? stored : null;
  }

  private storedOrThrow(applicationId: string): StoredApplication {
    const stored = this.stored.get(applicationId);
    if (!stored) {
      throw problem('not-found', 404, 'Application not found');
    }
    return stored;
  }

  private isSelectable(role: string): boolean {
    return this.companyRoles.some((candidate) => candidate.role === role && candidate.selectable);
  }

  private checkAttestation(attestation: string) {
    return checkMockAttestation(attestation, {
      caller: this.caller,
      now: this.now(),
      countries: this.referenceData.countries.map((country) => country.code),
      allowedClientIds: this.options.allowedClientIds,
    });
  }

  /** README 7.2 step 2 (and the company data of DOCUMENTS, built here because they come only from the input). */
  private checkCreateInput(input: ApplicationCreateInput, personInput: PersonCompanyInput): BuiltCompanyData | null {
    const errors: ValidationError[] = [];
    const hasReference = Boolean(input.companyId || input.bpn);
    if (!KINDS.includes(input.kind)) {
      errors.push({ field: 'kind', message: 'kind is ONBOARDING, REACTIVATION or TRANSFER.' });
    }
    if (!VERIFICATIONS.includes(input.verification)) {
      errors.push({ field: 'verification', message: 'verification is EBW or DOCUMENTS.' });
    }
    if (input.verification === 'EBW' && !input.attestation) {
      errors.push({ field: 'attestation', message: 'Required in the verification path EBW.' });
    }
    if (input.verification === 'DOCUMENTS' && input.attestation !== undefined) {
      errors.push({ field: 'attestation', message: 'Not allowed in the verification path DOCUMENTS.' });
    }
    if (input.companyId && input.bpn) {
      errors.push({ field: 'companyId', message: 'Give companyId or bpn, not both.' });
    }
    if (input.bpn && !BPN.test(input.bpn)) {
      errors.push({ field: 'bpn', message: 'bpn matches ^BPNL[A-Z0-9]{12}$.' });
    }
    if (input.kind === 'ONBOARDING' && hasReference) {
      errors.push({ field: 'companyId', message: 'No reference for ONBOARDING.' });
    }
    if (input.kind === 'REACTIVATION' && !hasReference) {
      errors.push({ field: 'companyId', message: 'REACTIVATION needs companyId or bpn.' });
    }
    if (!hasReference && !input.companyRoles?.length) {
      errors.push({ field: 'companyRoles', message: 'Required without a reference to an existing company.' });
    }
    if (input.companyRoles && new Set(input.companyRoles).size !== input.companyRoles.length) {
      errors.push({ field: 'companyRoles', message: 'Company roles must not repeat.' });
    }
    errors.push(...identifierListErrors(personInput.identifiers, 'companyData.identifiers'));
    throwIfInvalid(errors);
    return input.verification === 'DOCUMENTS' ? buildDocumentsCompanyData(personInput) : null;
  }

  /** The referenced company (README 6.2), or 409 `company-not-eligible`. */
  private eligibleCompany(input: ApplicationCreateInput): ExistingCompanyFixture {
    const company = this.existingCompanies.find((candidate) => (input.companyId ? candidate.id === input.companyId : candidate.bpn === input.bpn));
    const transferred = company?.deactivationReason === 'TRANSFERRED';
    const eligible = company?.status === 'INACTIVE' && (input.kind === 'REACTIVATION' ? !transferred : transferred);
    if (!company || !eligible) {
      throw problem('company-not-eligible', 409, 'The company does not fit the application kind', company ? { companyStatus: company.status } : {});
    }
    return company;
  }

  /** The application must concern the existing company: EBWOID and EUID as C3-M1 keeps them (README 6.2). */
  private throwIfNotTheCompany(company: ExistingCompanyFixture, built: BuiltCompanyData): void {
    const valueOf = (identifiers: ReadonlyArray<Identifier>, type: Identifier['type']) => identifiers.find((entry) => entry.type === type)?.value;
    const fields: MismatchField[] = [];
    for (const type of ['EBWOID', 'EUID'] as const) {
      const kept = valueOf(company.identifiers, type);
      const given = valueOf(built.companyData.identifiers, type);
      if (kept && given && kept !== given) {
        fields.push(type);
      }
    }
    if (fields.length > 0) {
      throw problem('attestation-mismatch', 400, 'The identifiers do not fit the existing company', { fields });
    }
  }

  private openApplicationOfCompany(companyId: string): boolean {
    return [...this.stored.values()].some(({ application }) => application.companyId === companyId && OPEN_STATUSES.includes(application.status));
  }

  /** The FRAMEWORK 7a id for a test company that has none yet (as the backend stand-in), otherwise a new one. */
  private newCompanyId(built: BuiltCompanyData): string {
    const taken = new Set([...this.stored.values()].map(({ application }) => application.companyId));
    const known = FRAMEWORK_COMPANY_IDS.find(
      (company) =>
        !taken.has(company.companyId) &&
        company.identifiers.some((identifier) => built.companyData.identifiers.some((given) => given.type === identifier.type && given.value === identifier.value)),
    );
    return known?.companyId ?? crypto.randomUUID();
  }

  private consentErrors(input: SubmitInput): ValidationError[] {
    const consents = input.consents ?? [];
    const errors: ValidationError[] = [];
    if (consents.length === 0) {
      errors.push({ field: 'consents', message: 'At least one consent.' });
    }
    for (const consent of consents) {
      if (!AGREEMENT_KEY.test(consent.agreementKey) || consent.version.length < 1 || consent.version.length > 20 || !['de', 'en'].includes(consent.language)) {
        errors.push({ field: 'consents', message: 'A consent has agreementKey, version (1 to 20 characters) and language de or en.' });
      }
    }
    const keys = consents.map((consent) => consent.agreementKey);
    if (new Set(keys).size !== keys.length) {
      errors.push({ field: 'consents', message: 'One consent per terms document.' });
    }
    return errors;
  }

  /** README 6.4 at submission: `exp` passed or older than ATTESTATION_MAX_AGE from `iat`. */
  private isTooOld(claims: MockAttestationClaims): boolean {
    const now = this.now().getTime();
    const skew = CLOCK_SKEW_SECONDS * 1000;
    return claims.exp * 1000 < now - skew || claims.iat * 1000 + this.options.attestationMaxAgeDays * DAY_MS < now - skew;
  }

  /** README 6.8: active terms with scope ALL plus the active terms of the selected roles. */
  private requiredAgreements(companyRoles: ReadonlyArray<string>): ReadonlyArray<AgreementRef> {
    return this.agreements
      .activeVersions()
      .filter((version) => version.scope === 'ALL' || version.companyRoles?.some((role) => companyRoles.includes(role)))
      .map(({ agreementKey, version }) => ({ agreementKey, version }));
  }

  private pageOfApplications(matches: (stored: StoredApplication) => boolean, filter: OwnApplicationsFilter): PageData<ApplicationSummaryAnemic> {
    const items = [...this.stored.values()]
      .filter(matches)
      .map(({ application }) => application)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(summaryOfApplication);
    return pageOf(items, filter.page, filter.size);
  }

  private contentOf(stored: StoredApplication | null, documentId: string): DocumentContent | null {
    const document = stored?.documents.find((candidate) => candidate.info.documentId === documentId);
    if (!document) {
      return null;
    }
    return {
      content: new Blob([document.content as Uint8Array<ArrayBuffer>], { type: document.info.contentType }),
      contentType: document.info.contentType,
      fileName: document.info.fileName,
    };
  }
}
