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

import { Link as RouterLink } from 'react-router-dom';
import type { ReviewFilters, ReviewStatus as Status } from '@dataspace-mgm/c1-m3-core';
import { reviewUi, useReviewDispatch, useReviewSelector, useReviewsQuery } from '@dataspace-mgm/c1-m3-state';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@dataspace-mgm/ui-mui';
import { ReviewToolbar } from '../components/review-toolbar';
import { ReviewStatus } from '../components/review-status';
import { ReviewError } from '../components/review-error';
import { useReviewTranslation } from '../use-review-translation';

export default function ReviewsPage() {
  const { t, date } = useReviewTranslation();
  const dispatch = useReviewDispatch();
  const { filters, actor } = useReviewSelector((s) => s.reviewUi);
  const allowed = actor.permissions.includes('view_reviews');
  const query = useReviewsQuery(filters, { skip: !allowed });
  const set = (value: ReviewFilters) => dispatch(reviewUi.actions.filtersChanged(value));
  const statuses: Status[] = ['OPEN', 'AWAITING_SECOND_APPROVAL', 'APPROVED', 'DECLINED', 'CLOSED'];
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 3, md: 5 },
        '& select': {
          padding: '9px',
          borderRadius: '6px',
          colorScheme: (theme) => theme.palette.mode,
          bgcolor: 'background.paper',
          color: 'text.primary',
          '& option': { bgcolor: 'background.paper', color: 'text.primary' },
          border: '1px solid',
          minHeight: 40,
        },
      }}
    >
      <Typography variant="h1" sx={{ fontSize: { xs: 30, md: 42 }, mb: 1 }}>
        {t('title')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t('intro')}
      </Typography>
      <ReviewToolbar />
      {!allowed ? (
        <Alert severity="warning">{t('forbidden')}</Alert>
      ) : (
        <>
          <Stack direction="row" useFlexGap spacing={2} sx={{ flexWrap: 'wrap', mb: 3 }}>
            <Box component="label" sx={{ display: 'grid', gap: 0.5 }}>
              {t('status')}
              <select
                value={filters.status?.join(',') ?? 'queue'}
                aria-label={t('status')}
                onChange={(e) =>
                  set({
                    status:
                      e.target.value === 'queue'
                        ? undefined
                        : e.target.value === 'all'
                          ? statuses
                          : (e.target.value.split(',') as Status[]),
                  })
                }
              >
                <option value="queue">{t('queue')}</option>
                <option value={statuses.join(',')}>{t('all')}</option>
                {statuses.map((v) => (
                  <option key={v} value={v}>
                    {t(v)}
                  </option>
                ))}
              </select>
            </Box>
            <Box component="label" sx={{ display: 'grid', gap: 0.5 }}>
              {t('kind')}
              <select
                value={filters.kind?.[0] ?? ''}
                aria-label={t('kind')}
                onChange={(e) =>
                  set({
                    kind: e.target.value ? [e.target.value as 'TRANSFER'] : undefined,
                  })
                }
              >
                <option value="">{t('allOptions')}</option>
                {['ONBOARDING', 'TRANSFER', 'REACTIVATION'].map((v) => (
                  <option key={v} value={v}>
                    {t(v)}
                  </option>
                ))}
              </select>
            </Box>
            <Box component="label" sx={{ display: 'grid', gap: 0.5 }}>
              {t('verification')}
              <select
                value={filters.verification?.[0] ?? ''}
                aria-label={t('verification')}
                onChange={(e) =>
                  set({
                    verification: e.target.value ? [e.target.value as 'EBW'] : undefined,
                  })
                }
              >
                <option value="">{t('allOptions')}</option>
                {['EBW', 'DOCUMENTS'].map((v) => (
                  <option key={v} value={v}>
                    {t(v)}
                  </option>
                ))}
              </select>
            </Box>
          </Stack>
          {query.isFetching && <CircularProgress size={24} aria-label={t('loading')} />}
          {query.error && (
            <Stack spacing={2}>
              <ReviewError error={query.error} />
              <Button onClick={() => void query.refetch()}>{t('retry')}</Button>
            </Stack>
          )}
          {!query.isFetching && !query.error && query.data?.items.length === 0 && (
            <Alert severity="info">{t('empty')}</Alert>
          )}
          {!query.error && (
            <Stack spacing={2} aria-busy={query.isFetching}>
              {query.data?.items.map((review) => (
                <Card
                  key={review.id}
                  component={RouterLink}
                  to={`/onboarding/reviews/${review.id}`}
                  aria-label={review.application?.legalName ?? review.companyId}
                  variant="outlined"
                  sx={{
                    display: 'block',
                    color: 'inherit',
                    textDecoration: 'none',
                    '&:hover': { borderColor: 'primary.main' },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 2,
                    },
                  }}
                >
                  <CardContent>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: { sm: 'center' },
                      }}
                    >
                      <Box>
                        <Typography variant="h3" sx={{ fontSize: 21, mb: 1 }}>
                          {review.application?.legalName ?? review.companyId}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {t('opened')}: {date(review.openedAt)} · {review.application?.countryCode} · {t(review.kind)}{' '}
                          · {t(review.verification)}
                        </Typography>
                      </Box>
                      <ReviewStatus value={review.status} />
                    </Stack>
                    <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap', mt: 2 }}>
                      <Chip
                        size="small"
                        label={`${t('passed')}: ${review.checkCounts.passed}`}
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={`${t('failed')}: ${review.checkCounts.failed}`}
                        color={review.checkCounts.failed ? 'error' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={`${t('error')}: ${review.checkCounts.error}`}
                        color={review.checkCounts.error ? 'warning' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={`${t('notApplicable')}: ${review.checkCounts.notApplicable}`}
                        variant="outlined"
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
          {query.data && !query.error && (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                mt: 3,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button
                disabled={!query.data.page || query.isFetching}
                onClick={() => set({ page: query.data!.page - 1 })}
              >
                {t('previous')}
              </Button>
              <Typography>
                {t('page')} {query.data.page + 1} {t('of')} {Math.max(1, Math.ceil(query.data.total / query.data.size))}{' '}
                · {query.data.total} {t('cases')}
              </Typography>
              <Button
                disabled={(query.data.page + 1) * query.data.size >= query.data.total || query.isFetching}
                onClick={() => set({ page: query.data!.page + 1 })}
              >
                {t('next')}
              </Button>
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}
