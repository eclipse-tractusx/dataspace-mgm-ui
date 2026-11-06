/********************************************************************************
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
 * to the project's license. Human review is required before committing.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Codex (GPT-6)
 ********************************************************************************/

import { attestationFixture } from './attestation-fixture';
import type { Application, ReviewActor, ReviewCase, ReviewCheck } from '../domain/data/review.data';

export const REVIEW_ACTORS: ReviewActor[] = [
  {
    id: 'bbede0f3-fbc4-433b-b7ca-1982e8724912',
    name: 'Rolf Prüfer',
    permissions: ['view_reviews', 'review_application', 'view_applications'],
  },
  {
    id: 'ed9d901d-cdc3-4a86-8ab4-0b477318506c',
    name: 'Renate Prüfer',
    permissions: ['view_reviews', 'review_application', 'view_applications'],
  },
  {
    id: '5a1c0012-0000-4000-8000-000000000012',
    name: 'OSP Admin',
    permissions: ['view_reviews', 'view_applications'],
  },
  {
    id: '5a1c0001-0000-4000-8000-000000000001',
    name: 'Erika Mustermann',
    permissions: ['register_company'],
  },
];
const keys: ReviewCheck['checkKey'][] = [
  'ATTESTATION_VALID',
  'REPRESENTATION_CONFIRMED',
  'COMPANY_DATA_MATCH',
  'NO_DUPLICATE',
  'CSP_MATCH_EXPECTED',
  'CONSENTS_COMPLETE',
];
export const DOCUMENT_ID = 'a0000001-0000-4000-8000-000000000001';
export function reviewFixtures(): ReviewCase[] {
  const names = [
    'Beispiel Maschinenbau GmbH',
    'Abweichende Firmierung GmbH',
    'Beispiel Handel GmbH',
    'Beispiel Werkzeugbau GmbH',
    'Beispiel Zulieferung GmbH',
    'Andere Beispiel AG',
    'Beispiel Werkzeugbau GmbH',
    'Beispiel Maschinenbau GmbH',
    'Beispiel Handel GmbH',
    'Beispiel Maschinenbau GmbH',
    'Beispiel Handel GmbH',
    'Andere Beispiel AG',
    'Beispiel Maschinenbau GmbH',
    'Beispiel Handel GmbH',
    'Beispiel Komponenten GmbH',
    'Beispiel Logistik GmbH',
    'Beispiel Fertigung GmbH',
    'Beispiel Software GmbH',
  ];
  return names.map((legalName, index) => {
    const n = index + 1;
    const id = `05b53523-7794-456e-92aa-${(0x2e36524e546d + n).toString(16)}`;
    const time = `2026-11-0${1 + Math.floor(index / 5)}T${String(8 + (index % 5)).padStart(2, '0')}:00:00Z`;
    const documents = [3, 4].includes(n);
    const kind = [6, 12].includes(n) ? 'TRANSFER' : n === 7 ? 'REACTIVATION' : 'ONBOARDING';
    const companyId = `c0000001-0000-4000-8000-${String(n).padStart(12, '0')}`;
    const application: Application = {
      id,
      companyId,
      kind,
      existingCompany: kind === 'REACTIVATION',
      verification: documents ? 'DOCUMENTS' : 'EBW',
      applicant: {
        sub: n === 8 ? REVIEW_ACTORS[0].id : REVIEW_ACTORS[3].id,
        givenName: n === 8 ? 'Rolf' : 'Erika',
        familyName: n === 8 ? 'Prüfer' : 'Mustermann',
      },
      status: n === 14 ? 'WITHDRAWN' : 'SUBMITTED',
      companyData: {
        legalName,
        shortName: null,
        address: {
          streetName: 'Musterstraße',
          streetNumber: '1',
          postalCode: '70569',
          city: 'Stuttgart',
          region: null,
          countryCode: 'DE',
        },
        identifiers: [{ type: 'EUID', value: 'DEXX001T.HRB100001', source: 'ATTESTATION' }],
      },
      companyRoles: ['ACTIVE_PARTICIPANT'],
      attestation: documents
        ? null
        : {
            ...structuredClone(attestationFixture),
            company: {
              ...attestationFixture.company,
              legalName: n === 2 ? 'Beispiel Maschinenbau GmbH' : legalName,
            },
          },
      comparison: documents ? [] : [{ field: 'LEGAL_NAME', result: n === 2 ? 'MISMATCH' : 'MATCH' }],
      documents: documents
        ? [
            {
              documentId: DOCUMENT_ID,
              documentType: 'COMMERCIAL_REGISTER_EXTRACT',
              fileName: 'mock-register-extract.png',
              contentType: 'image/png',
              sizeBytes: 68,
              sha256: '0'.repeat(64),
              uploadedAt: time,
            },
          ]
        : [],
      representationDeclared: documents ? true : null,
      consents: [
        {
          agreementKey: 'osp-terms',
          version: '1.0',
          language: 'de',
          givenAt: time,
        },
      ],
      requiredAgreements: [{ agreementKey: 'osp-terms', version: '1.0' }],
      createdAt: time,
      submittedAt: time,
    };
    const checks: ReviewCheck[] = keys.map((checkKey) => ({
      checkKey,
      result: documents && keys.indexOf(checkKey) < 3 ? 'NOT_APPLICABLE' : 'PASSED',
      checkedAt: time,
      attempts: 1,
      details:
        checkKey === 'CSP_MATCH_EXPECTED'
          ? {
              cspOutcome: kind === 'ONBOARDING' ? 'NO_MATCH' : 'EXPECTED_MATCH',
              cspMatches: [],
            }
          : {},
    }));
    if (n === 2) {
      checks[2] = {
        ...checks[2],
        result: 'FAILED',
        details: { mismatchedFields: ['LEGAL_NAME'] },
      };
    }
    if (n === 5) {
      checks[3] = {
        ...checks[3],
        result: 'ERROR',
        details: { error: 'C3-M1 not reachable' },
      };
    }
    if ([6, 7].includes(n)) {
      checks[4].details = {
        cspOutcome: 'EXPECTED_MATCH',
        cspMatches: [
          {
            bpn: 'BPNL00000000002B',
            matchedBy: ['EUID'],
            homeOspId: n === 7 ? '22222222-2222-4222-8222-222222222222' : '33333333-3333-4333-8333-333333333333',
            homeOspName: n === 7 ? 'OSP A' : 'OSP B',
            homeIsThisOsp: n === 7,
            memberActive: true,
            expected: true,
          },
        ],
      };
    }
    if (n === 12) {
      checks[4] = {
        ...checks[4],
        result: 'FAILED',
        details: {
          cspOutcome: 'NAME_MATCH_ONLY',
          cspMatches: [
            {
              bpn: 'BPNL00000000002B',
              matchedBy: ['NAME'],
              homeOspId: '33333333-3333-4333-8333-333333333333',
              homeOspName: 'OSP B',
              homeIsThisOsp: false,
              expected: false,
            },
          ],
        },
      };
    }
    if (n === 15) {
      checks[3] = {
        ...checks[3],
        result: 'FAILED',
        details: {
          duplicates: [
            {
              companyId: 'e0fbbb38-f0a7-4407-bc07-9b1991703a3a',
              companyStatus: 'ACTIVE',
              matchedOn: ['EUID'],
            },
          ],
        },
      };
    }
    if (n === 16) {
      checks[5] = {
        ...checks[5],
        result: 'FAILED',
        details: { missing: [{ agreementKey: 'osp-terms', version: '1.0' }] },
      };
      application.consents = [];
    }
    if (n === 17) {
      checks[0] = {
        ...checks[0],
        result: 'FAILED',
        details: { signatureCheck: 'INVALID' },
      };
      if (application.attestation) {
        application.attestation.signatureCheck.result = 'INVALID';
      }
    }
    if (n === 18) {
      checks[1] = {
        ...checks[1],
        result: 'FAILED',
        details: { representationReasons: ['COMPANY_MISMATCH'] },
      };
      if (application.attestation) {
        application.attestation.representation.confirmed = false;
        application.attestation.representation.reasons = ['COMPANY_MISMATCH'];
      }
    }
    return {
      id,
      applicationId: id,
      companyId,
      kind,
      existingCompany: application.existingCompany,
      verification: application.verification,
      applicantSub: application.applicant.sub,
      status:
        n === 4
          ? 'AWAITING_SECOND_APPROVAL'
          : [9, 13].includes(n)
            ? 'APPROVED'
            : n === 10
              ? 'DECLINED'
              : n === 11
                ? 'CLOSED'
                : 'OPEN',
      openedAt: time,
      cspBpn: [6, 7].includes(n) ? 'BPNL00000000002B' : null,
      checks,
      firstApproval:
        n === 4
          ? {
              approvedBy: REVIEW_ACTORS[0].id,
              approvedAt: time,
              comment: null,
              fourEyesReasons: ['DOCUMENTS'],
            }
          : null,
      decision: [9, 10, 13].includes(n)
        ? {
            decidedAt: time,
            decidedBy: n === 13 ? null : REVIEW_ACTORS[1].id,
            comment: n === 10 ? 'review.mockDeclineReason' : null,
            autoApproved: n === 13,
          }
        : null,
      closure: n === 11 ? { closedAt: time, reason: 'WITHDRAWN' } : null,
      application,
    };
  });
}
