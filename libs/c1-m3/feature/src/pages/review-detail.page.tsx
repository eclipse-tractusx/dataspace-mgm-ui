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

import { Link as RouterLink, useParams } from 'react-router-dom';
import { REVIEW_ACTORS } from '@dataspace-mgm/c1-m3-core';
import { useReviewQuery, useReviewSelector, useDownloadMutation } from '@dataspace-mgm/c1-m3-state';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@dataspace-mgm/ui-mui';
import { ReviewToolbar } from '../components/review-toolbar';
import { ReviewStatus } from '../components/review-status';
import { ReviewError } from '../components/review-error';
import { ReviewDecision } from '../components/review-decision';
import { useReviewTranslation } from '../use-review-translation';

export default function ReviewDetailPage() {
  const { reviewCaseId = '' } = useParams();
  const { t, date } = useReviewTranslation();
  const actor = useReviewSelector((s) => s.reviewUi.actor);
  const mock = useReviewSelector((s) => s.reviewUi.mock);
  const allowed = actor.permissions.includes('view_reviews');
  const query = useReviewQuery(reviewCaseId, { skip: !allowed });
  const [download, document] = useDownloadMutation();
  const review = query.data;
  const app = review?.application;
  const person = (id?: string | null) => (mock ? (REVIEW_ACTORS.find((v) => v.id === id)?.name ?? id) : id);
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 3, md: 5 },
        '& select': {
          p: 1,
          colorScheme: (theme) => theme.palette.mode,
          bgcolor: 'background.paper',
          color: 'text.primary',
          '& option': { bgcolor: 'background.paper', color: 'text.primary' },
          minHeight: 40,
        },
      }}
    >
      <Button component={RouterLink} to="/onboarding/reviews" sx={{ mb: 2 }}>
        {t('back')}
      </Button>
      <ReviewToolbar />
      {!allowed ? (
        <Alert severity="warning">{t('forbidden')}</Alert>
      ) : query.isLoading ? (
        <CircularProgress aria-label={t('loading')} />
      ) : query.error ? (
        <Stack spacing={2}>
          <ReviewError error={query.error} />
          <Button onClick={() => void query.refetch()}>{t('retry')}</Button>
        </Stack>
      ) : (
        review && (
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 38 }, flexGrow: 1 }}>
                {app?.companyData.legalName ?? review.companyId}
              </Typography>
              <ReviewStatus value={review.status} />
            </Stack>
            <Typography color="text.secondary">
              {t(review.kind)} · {t(review.verification)} · {t('opened')}: {date(review.openedAt)}
            </Typography>
            <ReviewDecision key={`${review.id}-${actor.id}`} review={review} />
            {review.firstApproval && (
              <Alert severity="info">
                <Typography sx={{ fontWeight: 700 }}>
                  {t('firstApproval')}: {person(review.firstApproval.approvedBy)} ·{' '}
                  {date(review.firstApproval.approvedAt)}
                </Typography>
                {review.firstApproval.fourEyesReasons.map((v) => t(v)).join(' · ')}
                {review.firstApproval.comment && <Typography>{t(review.firstApproval.comment)}</Typography>}
              </Alert>
            )}
            {review.decision && (
              <Alert severity={review.status === 'DECLINED' ? 'warning' : 'success'}>
                <Typography sx={{ fontWeight: 700 }}>
                  {t('decision')}: {t(review.status)} · {date(review.decision.decidedAt)}
                </Typography>
                {review.decision.autoApproved ? t('automatic') : person(review.decision.decidedBy)}
                {review.decision.comment && <Typography>{t(review.decision.comment)}</Typography>}
              </Alert>
            )}
            {review.closure && (
              <Alert severity="info">
                {t('closure')} · {date(review.closure.closedAt)}
              </Alert>
            )}
            <Typography variant="h2" sx={{ fontSize: 26 }}>
              {t('checks')}
            </Typography>
            <Stack spacing={2}>
              {review.checks.map((check) => (
                <Card key={check.checkKey} variant="outlined">
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="h3" sx={{ fontSize: 19 }}>
                        {t(check.checkKey)}
                      </Typography>
                      <ReviewStatus value={check.result} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t('checkedAt')}: {date(check.checkedAt)} · {t('attempts')}: {check.attempts}
                    </Typography>
                    {check.details && (
                      <Box component="dl" sx={{ mb: 0, overflowWrap: 'anywhere' }}>
                        {check.details.cspOutcome && (
                          <>
                            <dt>{t('CSP_MATCH_EXPECTED')}</dt>
                            <dd>{t(check.details.cspOutcome)}</dd>
                          </>
                        )}
                        {check.details.cspMatches?.map((match) => (
                          <Box key={match.bpn} component="dd">
                            {match.bpn} · {match.homeOspName ?? match.homeOspId} · {match.matchedBy.join(', ')} ·{' '}
                            {t(match.expected ? 'EXPECTED_MATCH' : 'MISMATCH')}
                          </Box>
                        ))}
                        {check.details.mismatchedFields?.map((v) => (
                          <Box component="dd" key={v}>
                            {t(v)}: {t('MISMATCH')}
                          </Box>
                        ))}
                        {check.details.unverifiedFields?.map((v) => (
                          <Box component="dd" key={v}>
                            {t(v)}: {t('NOT_IN_ATTESTATION')}
                          </Box>
                        ))}
                        {check.details.duplicates?.map((v) => (
                          <Box component="dd" key={v.companyId}>
                            {v.companyId} · {v.companyStatus} · {v.matchedOn.join(', ')}
                          </Box>
                        ))}
                        {check.details.missing?.map((v) => (
                          <Box component="dd" key={v.agreementKey}>
                            {v.agreementKey} · {v.version}
                          </Box>
                        ))}
                        {check.details.representationReasons?.map((v) => (
                          <Box component="dd" key={v}>
                            {t(v)}
                          </Box>
                        ))}
                        {check.details.signatureCheck && <Box component="dd">{t(check.details.signatureCheck)}</Box>}
                        {check.details.expiredAtSubmission && (
                          <Box component="dd">
                            {t('ATTESTATION_VALID')}: {t('FAILED')}
                          </Box>
                        )}
                        {check.details.error && <Box component="dd">{check.details.error}</Box>}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
            {app && (
              <>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h2" sx={{ fontSize: 26, mb: 2 }}>
                      {t('details')}
                    </Typography>
                    <Stack spacing={1}>
                      <Typography>
                        {t('applicant')}: {app.applicant.givenName} {app.applicant.familyName}
                      </Typography>
                      <Typography>
                        {t('address')}: {app.companyData.address.streetName} {app.companyData.address.streetNumber},{' '}
                        {app.companyData.address.postalCode} {app.companyData.address.city},{' '}
                        {app.companyData.address.countryCode}
                      </Typography>
                      <Typography>
                        {t('roles')}: {app.companyRoles.join(', ')}
                      </Typography>
                      <Typography>
                        {t('identifiers')}:{' '}
                        {app.companyData.identifiers.map((v) => `${v.type}: ${v.value}`).join(' · ')}
                      </Typography>
                      <Typography>
                        {t('applicationId')}: {review.applicationId}
                      </Typography>
                      <Typography>
                        {t('companyId')}: {review.companyId}
                      </Typography>
                      <Typography>
                        {t('reviewId')}: {review.id}
                      </Typography>
                      <Typography>
                        {t('submitted')}: {date(app.submittedAt)}
                      </Typography>
                      {app.representationDeclared !== null && app.representationDeclared !== undefined && (
                        <Typography>
                          {t('representation')}: {t(app.representationDeclared ? 'yes' : 'no')}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h2" sx={{ fontSize: 26, mb: 2 }}>
                      {t('attestation')}
                    </Typography>
                    {app.attestation ? (
                      <Stack spacing={1}>
                        <Typography>
                          {app.attestation.issuer} · {date(app.attestation.issuedAt)}
                        </Typography>
                        <Typography>
                          {t('signature')}: {t(app.attestation.signatureCheck.result)} ·{' '}
                          {date(app.attestation.signatureCheck.checkedAt)}
                        </Typography>
                        <Box component="details">
                          <summary>{t('rawEvidence')}</summary>
                          <Box
                            component="pre"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              overflowWrap: 'anywhere',
                              fontSize: 12,
                            }}
                          >
                            {JSON.stringify(app.attestation, null, 2)}
                          </Box>
                        </Box>
                      </Stack>
                    ) : (
                      <Typography>{t('noAttestation')}</Typography>
                    )}
                    {app.comparison.length > 0 && (
                      <>
                        <Typography variant="h3" sx={{ fontSize: 19, mt: 2 }}>
                          {t('comparison')}
                        </Typography>
                        {app.comparison.map((v) => (
                          <Typography key={v.field}>
                            {t(v.field)}: {t(v.result)}
                          </Typography>
                        ))}
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h2" sx={{ fontSize: 26, mb: 2 }}>
                      {t('documents')}
                    </Typography>
                    {mock && app.documents.length > 0 && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        {t('documentNotice')}
                      </Alert>
                    )}
                    {!app.documents.length && <Typography>{t('noDocuments')}</Typography>}
                    {app.documents.map((doc) => (
                      <Stack
                        key={doc.documentId}
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{
                          justifyContent: 'space-between',
                          alignItems: { sm: 'center' },
                        }}
                      >
                        <Box>
                          <Typography>{t(doc.documentType)}</Typography>
                          <Typography color="text.secondary" variant="body2">
                            {doc.fileName} · {doc.contentType} · {doc.sizeBytes} B
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          disabled={!actor.permissions.includes('view_applications') || document.isLoading}
                          onClick={() =>
                            void download({
                              applicationId: review.applicationId,
                              documentId: doc.documentId,
                            })
                          }
                        >
                          {t(mock ? 'download' : 'downloadDocument')}
                        </Button>
                      </Stack>
                    ))}
                    {document.error && <ReviewError error={document.error} />}
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h2" sx={{ fontSize: 26 }}>
                      {t('consents')}
                    </Typography>
                    {app.consents.map((v) => (
                      <Typography key={v.agreementKey}>
                        {v.agreementKey} · {v.version} · {v.language} · {date(v.givenAt)}
                      </Typography>
                    ))}
                    <Typography sx={{ mt: 2, fontWeight: 700 }}>{t('requiredAgreements')}</Typography>
                    {app.requiredAgreements.map((v) => (
                      <Typography key={v.agreementKey}>
                        {v.agreementKey} · {v.version}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </Stack>
        )
      )}
    </Container>
  );
}
