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
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { REVIEW_ACTORS } from '@dataspace-mgm/c1-m3-core';
import { useReviewQuery, useReviewSelector, useDownloadMutation } from '@dataspace-mgm/c1-m3-state';
import {
  Alert,
  Box,
  BusinessOutlinedIcon,
  Button,
  Card,
  CircularProgress,
  DescriptionOutlinedIcon,
  Stack,
  Typography,
  VerifiedUserOutlinedIcon,
  alpha,
  tractusx,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { ReviewToolbar } from '../components/review-toolbar';
import { ReviewStatus } from '../components/review-status';
import { ReviewError } from '../components/review-error';
import { ReviewDecision } from '../components/review-decision';
import { ReviewPage } from '../components/review-page';
import { CheckBar, ChecksList, checksSummary } from '../components/review-checks';
import { useReviewTranslation } from '../use-review-translation';

const mono = { fontFamily: 'monospace', fontSize: '0.8125rem' } as const;

/** The orange icon tile of a card header, like the cards of onboarding and participant management. */
function IconTile({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: '10px',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        color: 'primary.main',
        bgcolor: alpha(tractusx.orange, 0.15),
      }}
    >
      {children}
    </Box>
  );
}

/** A card of the detail page: optional icon tile, title, subtitle and an aside (a status) in its header. */
function Section({
  title,
  icon,
  subtitle,
  aside,
  children,
}: {
  title: string;
  icon?: ReactNode;
  subtitle?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card component="section" sx={{ p: { xs: 2.5, md: 3.5 }, display: 'grid', gap: 2.5, '&:hover': { boxShadow: 'none' } }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        {icon && <IconTile>{icon}</IconTile>}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {aside}
      </Stack>
      {children}
    </Card>
  );
}

/** Label over value, in a grid: the key facts of a card (like "Your company" of participant management). */
function Facts({ items, columns = 2 }: { items: ReadonlyArray<[string, ReactNode]>; columns?: 2 | 3 }) {
  return (
    <Box
      component="dl"
      sx={{ m: 0, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: `repeat(${columns}, minmax(0, 1fr))` } }}
    >
      {items.map(([label, value]) => (
        <Box key={label} sx={{ minWidth: 0 }}>
          <Typography component="dt" variant="caption" sx={{ display: 'block', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, mb: 0.5 }}>
            {label}
          </Typography>
          <Typography component="dd" sx={{ m: 0, overflowWrap: 'anywhere' }}>
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/** An outcome of the case inside the decision panel (first approval, decision, closure): a tinted block. */
function Outcome({ color, children }: { color: string; children: ReactNode }) {
  return (
    <Box sx={{ p: 1.5, borderRadius: '8px', borderLeft: '3px solid', borderLeftColor: color, bgcolor: `color-mix(in srgb, ${color} 10%, transparent)`, display: 'grid', gap: 0.25, fontSize: '0.875rem' }}>
      {children}
    </Box>
  );
}

export default function ReviewDetailPage() {
  const { reviewCaseId = '' } = useParams();
  const { t, date } = useReviewTranslation();
  const theme = useTheme();
  const actor = useReviewSelector((s) => s.reviewUi.actor);
  const mock = useReviewSelector((s) => s.reviewUi.mock);
  const allowed = actor.permissions.includes('view_reviews');
  const query = useReviewQuery(reviewCaseId, { skip: !allowed });
  const [download, document] = useDownloadMutation();
  const review = query.data;
  const app = review?.application;
  const person = (id?: string | null) => (mock ? (REVIEW_ACTORS.find((v) => v.id === id)?.name ?? id) : id);
  const ready = allowed && !query.isLoading && !query.error ? review : undefined;
  const results = ready?.checks.map((v) => v.result) ?? [];
  const attestation = app?.attestation;
  const address = app?.companyData.address;
  return (
    <ReviewPage
      overline={t('title')}
      back={{ to: '/onboarding/reviews', label: t('backShort') }}
      title={ready ? (app?.companyData.legalName ?? ready.companyId) : t('title')}
      status={ready ? <ReviewStatus value={ready.status} /> : undefined}
      lead={ready ? `${t(ready.kind)} · ${t(ready.verification)} · ${t('opened')} ${date(ready.openedAt)}` : undefined}
    >
      <ReviewToolbar />
      {!allowed ? (
        <Alert severity="warning">{t('forbidden')}</Alert>
      ) : query.isLoading ? (
        <CircularProgress aria-label={t('loading')} />
      ) : query.error ? (
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          <ReviewError error={query.error} />
          <Button variant="outlined" onClick={() => void query.refetch()}>
            {t('retry')}
          </Button>
        </Stack>
      ) : (
        ready && (
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 340px' }, alignItems: 'start' }}>
            <Stack spacing={3} sx={{ minWidth: 0, order: { xs: 2, md: 1 } }}>
              {app && (
                <Section
                  title={t('details')}
                  icon={<BusinessOutlinedIcon />}
                  subtitle={`${t('applicant')}: ${app.applicant.givenName} ${app.applicant.familyName}`}
                >
                  <Facts
                    items={[
                      [t('LEGAL_NAME'), app.companyData.legalName],
                      [
                        t('address'),
                        address
                          ? `${address.streetName} ${address.streetNumber}, ${address.postalCode} ${address.city}, ${address.countryCode}`
                          : '—',
                      ],
                      [t('roles'), app.companyRoles.join(', ')],
                      [t('submitted'), date(app.submittedAt)],
                      [
                        t('identifiers'),
                        <Box component="span" sx={{ display: 'grid', gap: 0.25 }}>
                          {app.companyData.identifiers.map((v) => (
                            <Box component="span" key={`${v.type}:${v.value}`} sx={mono}>
                              {v.type} {v.value}
                            </Box>
                          ))}
                        </Box>,
                      ],
                      ...(app.representationDeclared !== null && app.representationDeclared !== undefined
                        ? [[t('representation'), t(app.representationDeclared ? 'yes' : 'no')] as [string, ReactNode]]
                        : []),
                    ]}
                  />
                </Section>
              )}
              {app && (
                <Section
                  title={t('attestation')}
                  icon={<VerifiedUserOutlinedIcon />}
                  subtitle={attestation ? `${attestation.issuer}` : undefined}
                  aside={
                    attestation ? (
                      <ReviewStatus
                        value={attestation.representation.confirmed ? 'CONFIRMED' : 'FAILED'}
                        label={t(attestation.representation.confirmed ? 'REPRESENTATION_CONFIRMED' : 'representationNotConfirmed')}
                      />
                    ) : undefined
                  }
                >
                  {attestation ? (
                    <>
                      <Facts
                        columns={3}
                        items={[
                          [t('representative'), `${attestation.person.givenName} ${attestation.person.familyName}`],
                          [t('role'), attestation.representation.role ?? '—'],
                          [t('validUntil'), attestation.representation.validUntil ?? '—'],
                          [t('verifiedOn'), date(attestation.verifiedAt ?? attestation.issuedAt)],
                          [t('expiresAt'), date(attestation.expiresAt)],
                          [t('signature'), <ReviewStatus value={attestation.signatureCheck.result} />],
                        ]}
                      />
                      {app.comparison.length > 0 && (
                        <Box>
                          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, mb: 1 }}>
                            {t('comparison')}
                          </Typography>
                          <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
                            {app.comparison.map((v) => (
                              <ReviewStatus
                                key={v.field}
                                value={v.result === 'MISMATCH' ? 'FAILED' : v.result === 'NOT_IN_ATTESTATION' ? 'ERROR' : 'PASSED'}
                                label={`${t(v.field)} · ${t(v.result)}`}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                      <Box component="details" sx={{ '& summary': { cursor: 'pointer', color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem' } }}>
                        <summary>{t('rawEvidence')}</summary>
                        <Box component="pre" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 12, p: 2, mt: 1, mb: 0, borderRadius: '8px', bgcolor: 'action.hover' }}>
                          {JSON.stringify(attestation, null, 2)}
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Typography color="text.secondary">{t('noAttestation')}</Typography>
                  )}
                </Section>
              )}
              <Section title={t('checks')}>
                <ChecksList checks={ready.checks} />
              </Section>
              {app && (
                <Section title={t('documents')} icon={<DescriptionOutlinedIcon />}>
                  {mock && app.documents.length > 0 && <Alert severity="info">{t('documentNotice')}</Alert>}
                  {!app.documents.length && <Typography color="text.secondary">{t('noDocuments')}</Typography>}
                  {app.documents.map((doc) => (
                    <Stack key={doc.documentId} direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600 }}>{t(doc.documentType)}</Typography>
                        <Typography color="text.secondary" variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                          {doc.fileName} · {doc.contentType} · {doc.sizeBytes} B
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        disabled={!actor.permissions.includes('view_applications') || document.isLoading}
                        onClick={() => void download({ applicationId: ready.applicationId, documentId: doc.documentId })}
                      >
                        {t(mock ? 'download' : 'downloadDocument')}
                      </Button>
                    </Stack>
                  ))}
                  {document.error && <ReviewError error={document.error} />}
                </Section>
              )}
              {app && (
                <Section title={t('consents')}>
                  <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                    {app.consents.map((v, index) => (
                      <Stack component="li" key={v.agreementKey} direction="row" spacing={2} sx={{ py: 1.25, borderTop: index ? '1px solid' : 0, borderColor: 'divider', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontWeight: 600, minWidth: 0, overflowWrap: 'anywhere' }}>
                          {v.agreementKey} · {v.version}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                          {v.language.toUpperCase()} · {date(v.givenAt)}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('requiredAgreements')}: {app.requiredAgreements.map((v) => `${v.agreementKey} · ${v.version}`).join(', ') || '—'}
                  </Typography>
                </Section>
              )}
              <Box sx={{ display: 'grid', gap: 0.5, color: 'text.secondary', fontSize: '0.8125rem' }}>
                <span>
                  {t('applicationId')}: <Box component="span" sx={mono}>{ready.applicationId}</Box>
                </span>
                <span>
                  {t('companyId')}: <Box component="span" sx={mono}>{ready.companyId}</Box>
                </span>
                <span>
                  {t('reviewId')}: <Box component="span" sx={mono}>{ready.id}</Box>
                </span>
              </Box>
            </Stack>
            <Card
              component="aside"
              aria-label={t('decision')}
              sx={{
                order: { xs: 1, md: 2 },
                position: { md: 'sticky' },
                top: { md: 24 },
                p: 3,
                display: 'grid',
                gap: 2.5,
                boxShadow: `0 0 32px ${alpha(tractusx.orange, 0.12)}`,
                '&:hover': { boxShadow: `0 0 32px ${alpha(tractusx.orange, 0.12)}` },
              }}
            >
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="overline" color="text.secondary">
                  {t('decision')}
                </Typography>
                <ReviewStatus value={ready.status} />
              </Stack>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Typography sx={{ fontWeight: 700 }}>{t('checks')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {checksSummary(t, results)}
                  </Typography>
                </Stack>
                <CheckBar results={results} />
              </Box>
              <ReviewDecision key={`${ready.id}-${actor.id}`} review={ready} />
              {ready.firstApproval && (
                <Outcome color={tractusx.orangeLightest}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {t('firstApproval')}: {person(ready.firstApproval.approvedBy)} · {date(ready.firstApproval.approvedAt)}
                  </Typography>
                  <span>{ready.firstApproval.fourEyesReasons.map((v) => t(v)).join(' · ')}</span>
                  {ready.firstApproval.comment && <span>{t(ready.firstApproval.comment)}</span>}
                </Outcome>
              )}
              {ready.decision && (
                <Outcome color={ready.status === 'DECLINED' ? theme.palette.error.main : tractusx.green}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {t('decision')}: {t(ready.status)} · {date(ready.decision.decidedAt)}
                  </Typography>
                  <span>{ready.decision.autoApproved ? t('automatic') : person(ready.decision.decidedBy)}</span>
                  {ready.decision.comment && <span>{t(ready.decision.comment)}</span>}
                </Outcome>
              )}
              {ready.closure && (
                <Outcome color={tractusx.grayDarkest}>
                  <span>
                    {t('closure')} · {date(ready.closure.closedAt)}
                  </span>
                </Outcome>
              )}
            </Card>
          </Box>
        )
      )}
    </ReviewPage>
  );
}
