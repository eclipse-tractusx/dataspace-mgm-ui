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

import { useState, type ReactNode } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import type { ReviewCaseSummary, ReviewCheck, ReviewFilters, ReviewStatus as Status } from '@dataspace-mgm/c1-m3-core';
import { reviewUi, useReviewDispatch, useReviewSelector, useReviewsQuery } from '@dataspace-mgm/c1-m3-state';
import {
  Alert,
  Box,
  Button,
  Card,
  ChevronRightOutlinedIcon,
  CircularProgress,
  DataTable,
  GridViewOutlinedIcon,
  Stack,
  TableRowsOutlinedIcon,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  alpha,
  tractusx,
  useMediaQuery,
  useTheme,
  type GridColDef,
} from '@dataspace-mgm/ui-mui';
import { ReviewToolbar } from '../components/review-toolbar';
import { ReviewStatus, VisuallyHidden, statusColor } from '../components/review-status';
import { ReviewError } from '../components/review-error';
import { ReviewPage, ReviewSelect } from '../components/review-page';
import { CheckBar } from '../components/review-checks';
import { useReviewTranslation } from '../use-review-translation';

const STATUSES: Status[] = ['OPEN', 'AWAITING_SECOND_APPROVAL', 'APPROVED', 'DECLINED', 'CLOSED'];
/** The statuses of the dashboard tiles, with their label keys. */
const TILES: ReadonlyArray<[Status, string]> = [
  ['OPEN', 'kpiOpen'],
  ['AWAITING_SECOND_APPROVAL', 'kpiSecond'],
  ['APPROVED', 'APPROVED'],
  ['DECLINED', 'DECLINED'],
];

type View = 'cards' | 'table';
/** Per viewer (browser storage): the chosen view of the list. */
const VIEW_KEY = 'portal.review.listView';

function storedView(): View | null {
  try {
    const value = window.localStorage.getItem(VIEW_KEY);
    return value === 'cards' || value === 'table' ? value : null;
  } catch {
    return null;
  }
}

function storeView(view: View) {
  try {
    window.localStorage.setItem(VIEW_KEY, view);
  } catch {
    // Storage can be blocked (private window); the choice then lasts for this page only.
  }
}

/** The results of the checks of a summary, as the segments of a CheckBar. */
function resultsOf(counts: ReviewCaseSummary['checkCounts']): ReviewCheck['result'][] {
  return [
    ...Array<ReviewCheck['result']>(counts.passed).fill('PASSED'),
    ...Array<ReviewCheck['result']>(counts.failed).fill('FAILED'),
    ...Array<ReviewCheck['result']>(counts.error).fill('ERROR'),
    ...Array<ReviewCheck['result']>(counts.notApplicable).fill('NOT_APPLICABLE'),
  ];
}

/** Mock mode: marks the case of the application submitted in onboarding in this session. */
function DemoTag() {
  const { t } = useReviewTranslation();
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 0.75,
        py: 0.125,
        borderRadius: '6px',
        border: '1px solid',
        borderColor: 'primary.main',
        color: 'primary.main',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {t('demoApplication')}
    </Box>
  );
}
const DEMO_ACCENT = { boxShadow: 'inset 3px 0 0 #FAA023', backgroundColor: 'rgba(250, 160, 35, 0.06)' };

const nameOf = (review: ReviewCaseSummary) => review.application?.legalName ?? review.companyId;
const pathOf = (review: ReviewCaseSummary) => `/onboarding/reviews/${review.id}`;

/** The check counts as text for screen readers (and as the "Passed: 6" the list always offered). */
function HiddenCounts({ review }: { review: ReviewCaseSummary }) {
  const { t } = useReviewTranslation();
  const c = review.checkCounts;
  return (
    <>
      <VisuallyHidden>{`${t('passed')}: ${c.passed}`}</VisuallyHidden>
      <VisuallyHidden>{`${t('failed')}: ${c.failed}`}</VisuallyHidden>
      <VisuallyHidden>{`${t('error')}: ${c.error}`}</VisuallyHidden>
      <VisuallyHidden>{`${t('notApplicable')}: ${c.notApplicable}`}</VisuallyHidden>
    </>
  );
}

/** "6/6" and the segments of the checks of a case. */
function ChecksCell({ review }: { review: ReviewCaseSummary }) {
  const c = review.checkCounts;
  return (
    <Box sx={{ display: 'grid', gap: 0.75, width: '100%', maxWidth: 120 }} aria-hidden>
      <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {c.passed}/{c.passed + c.failed + c.error}
      </Typography>
      <CheckBar results={resultsOf(c)} />
    </Box>
  );
}

/** A small neutral chip (application type, verification path). */
function Tag({ children }: { children: ReactNode }) {
  return (
    <Box
      component="span"
      sx={{ display: 'inline-flex', alignSelf: 'center', height: 'fit-content', lineHeight: 1.5, px: 1, py: 0.25, borderRadius: '6px', border: '1px solid', borderColor: 'divider', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}
    >
      {children}
    </Box>
  );
}

/** The overview above the list: one tile per status (a click filters the list), and the share of each status. */
function Dashboard({ selected, onSelect }: { selected?: Status; onSelect: (status: Status | undefined) => void }) {
  const { t } = useReviewTranslation();
  const theme = useTheme();
  const all = useReviewsQuery({ status: STATUSES, page: 0, size: 100 });
  const count = (status: Status) => all.data?.items.filter((v) => v.status === status).length ?? 0;
  const known = TILES.map(([status]) => count(status));
  const total = known.reduce((sum, v) => sum + v, 0);
  return (
    <Box component="section" aria-label={t('dashboard')} sx={{ mb: 3, display: 'grid', gap: 1.5 }}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' } }}>
        {TILES.map(([status, label]) => {
          const active = selected === status;
          return (
            <Card
              key={status}
              component="button"
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(active ? undefined : status)}
              sx={{
                p: 2.25,
                textAlign: 'left',
                cursor: 'pointer',
                font: 'inherit',
                color: 'text.primary',
                display: 'grid',
                gap: 0.5,
                position: 'relative',
                overflow: 'hidden',
                borderColor: active ? 'primary.main' : undefined,
                bgcolor: active ? alpha(tractusx.orange, 0.1) : undefined,
                '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, bgcolor: active ? 'primary.main' : 'transparent' },
                '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColor(theme, status) }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {t(label)}
                </Typography>
              </Stack>
              <Typography component="span" sx={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                {all.isLoading || all.error ? '–' : count(status)}
              </Typography>
            </Card>
          );
        })}
      </Box>
      {total > 0 && (
        <Box role="img" aria-label={t('statusShare')} sx={{ display: 'flex', gap: '3px', height: 6 }}>
          {TILES.map(([status], index) =>
            known[index] ? <Box key={status} sx={{ flex: known[index], borderRadius: '3px', bgcolor: statusColor(theme, status) }} /> : null,
          )}
        </Box>
      )}
    </Box>
  );
}

/** Cards view: one card per case in a grid; the whole card links to the case. */
function ReviewCards({ items }: { items: ReadonlyArray<ReviewCaseSummary> }) {
  const { t, date } = useReviewTranslation();
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' } }}>
      {items.map((review) => (
        <Card
          key={review.id}
          component={RouterLink}
          to={pathOf(review)}
          aria-label={nameOf(review)}
          sx={{
            p: 2.5,
            display: 'grid',
            gap: 1.75,
            alignContent: 'start',
            color: 'inherit',
            textDecoration: 'none',
            '&:hover': { borderColor: 'primary.main' },
            '&:hover .review-chevron': { color: 'primary.main', transform: 'translateX(2px)' },
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
            ...(review.demo ? { borderColor: 'primary.main', ...DEMO_ACCENT } : {}),
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 17, overflowWrap: 'anywhere' }}>{nameOf(review)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {review.application?.countryCode} · {t('opened')} {date(review.openedAt)}
              </Typography>
              {review.demo && (
                <Box sx={{ mt: 0.75 }}>
                  <DemoTag />
                </Box>
              )}
            </Box>
            <ReviewStatus value={review.status} />
          </Stack>
          <Stack direction="row" useFlexGap spacing={0.75} sx={{ flexWrap: 'wrap' }}>
            <Tag>{t(review.kind)}</Tag>
            <Tag>{t(review.verification)}</Tag>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <ChecksCell review={review} />
            <ChevronRightOutlinedIcon
              className="review-chevron"
              aria-hidden
              sx={{ color: 'text.disabled', transition: 'transform 0.15s ease, color 0.15s ease' }}
            />
          </Stack>
          <HiddenCounts review={review} />
        </Card>
      ))}
    </Box>
  );
}

/** Table view: the portal's DataTable (MUI X Data Grid); a click on a row opens the case. */
function ReviewTable({ items, loading }: { items: ReadonlyArray<ReviewCaseSummary>; loading: boolean }) {
  const { t, date } = useReviewTranslation();
  const navigate = useNavigate();
  const columns: GridColDef<ReviewCaseSummary>[] = [
    {
      field: 'company',
      headerName: t('company'),
      flex: 1.6,
      minWidth: 220,
      valueGetter: (_value, row) => nameOf(row),
      renderCell: ({ row }) => (
        <Box sx={{ minWidth: 0, lineHeight: 1.35 }}>
          <Box
            component={RouterLink}
            to={pathOf(row)}
            aria-label={nameOf(row)}
            onClick={(e) => e.stopPropagation()}
            sx={{ display: 'block', fontWeight: 700, color: 'text.primary', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' } }}
          >
            {nameOf(row)}
            <HiddenCounts review={row} />
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {row.application?.countryCode}
            </Typography>
            {row.demo && <DemoTag />}
          </Stack>
        </Box>
      ),
    },
    { field: 'kind', headerName: t('kind'), flex: 1, minWidth: 150, valueGetter: (_value, row) => t(row.kind), renderCell: ({ value }) => <Tag>{value}</Tag> },
    {
      field: 'verification',
      headerName: t('verification'),
      flex: 1,
      minWidth: 150,
      valueGetter: (_value, row) => t(row.verification),
      renderCell: ({ value }) => <Tag>{value}</Tag>,
    },
    {
      field: 'openedAt',
      headerName: t('opened'),
      width: 170,
      renderCell: ({ row }) => (
        <Typography variant="body2" color="text.secondary">
          {date(row.openedAt)}
        </Typography>
      ),
    },
    {
      field: 'checks',
      headerName: t('checks'),
      width: 130,
      valueGetter: (_value, row) => row.checkCounts.passed - row.checkCounts.failed * 10 - row.checkCounts.error * 5,
      renderCell: ({ row }) => <ChecksCell review={row} />,
    },
    {
      field: 'status',
      headerName: t('status'),
      width: 210,
      valueGetter: (_value, row) => t(row.status),
      renderCell: ({ row }) => <ReviewStatus value={row.status} />,
    },
    {
      field: 'open',
      headerName: '',
      width: 52,
      sortable: false,
      align: 'right',
      renderCell: () => <ChevronRightOutlinedIcon aria-hidden sx={{ color: 'text.disabled' }} />,
    },
  ];
  return (
    <DataTable<ReviewCaseSummary>
      locale="en"
      rows={items as ReviewCaseSummary[]}
      columns={columns}
      loading={loading}
      hideFooter
      onRowClick={({ row }) => navigate(pathOf(row))}
      getRowClassName={({ row }) => (row.demo ? 'review-demo-row' : '')}
      sx={{ '& .review-demo-row, & .review-demo-row:hover': DEMO_ACCENT }}
      aria-label={t('title')}
    />
  );
}

export default function ReviewsPage() {
  const { t } = useReviewTranslation();
  const dispatch = useReviewDispatch();
  const desktop = useMediaQuery((theme) => theme.breakpoints.up('md'), { noSsr: true });
  const [view, setView] = useState<View>(() => storedView() ?? (desktop ? 'table' : 'cards'));
  const { filters, actor } = useReviewSelector((s) => s.reviewUi);
  const allowed = actor.permissions.includes('view_reviews');
  const query = useReviewsQuery(filters, { skip: !allowed });
  const set = (value: ReviewFilters) => dispatch(reviewUi.actions.filtersChanged(value));
  const single = filters.status?.length === 1 ? filters.status[0] : undefined;
  const items = query.data?.items ?? [];
  return (
    <ReviewPage overline={t('overline')} title={t('title')} lead={t('intro')}>
      <ReviewToolbar />
      {!allowed ? (
        <Alert severity="warning">{t('forbidden')}</Alert>
      ) : (
        <>
          <Dashboard selected={single} onSelect={(status) => set({ status: status ? [status] : undefined })} />
          <Stack direction={{ xs: 'column', sm: 'row' }} useFlexGap spacing={1.5} sx={{ flexWrap: 'wrap', mb: 2, alignItems: { sm: 'center' } }} role="search">
            <ReviewSelect
              id="review-filter-status"
              label={t('status')}
              value={filters.status?.join(',') ?? 'queue'}
              onChange={(value) => set({ status: value === 'queue' ? undefined : value === 'all' ? STATUSES : (value.split(',') as Status[]) })}
            >
              <option value="queue">{t('queue')}</option>
              <option value={STATUSES.join(',')}>{t('all')}</option>
              {STATUSES.map((v) => (
                <option key={v} value={v}>
                  {t(v)}
                </option>
              ))}
            </ReviewSelect>
            <ReviewSelect id="review-filter-kind" label={t('kind')} value={filters.kind?.[0] ?? ''} onChange={(value) => set({ kind: value ? [value as 'TRANSFER'] : undefined })}>
              <option value="">{t('allOptions')}</option>
              {['ONBOARDING', 'TRANSFER', 'REACTIVATION'].map((v) => (
                <option key={v} value={v}>
                  {t(v)}
                </option>
              ))}
            </ReviewSelect>
            <ReviewSelect
              id="review-filter-verification"
              label={t('verification')}
              value={filters.verification?.[0] ?? ''}
              onChange={(value) => set({ verification: value ? [value as 'EBW'] : undefined })}
            >
              <option value="">{t('allOptions')}</option>
              {['EBW', 'DOCUMENTS'].map((v) => (
                <option key={v} value={v}>
                  {t(v)}
                </option>
              ))}
            </ReviewSelect>
            <Box sx={{ flex: 1 }} />
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              {query.isFetching ? (
                <CircularProgress size={20} aria-label={t('loading')} />
              ) : (
                query.data && (
                  <Typography variant="body2" color="text.secondary" role="status">
                    {query.data.total} {t('cases')}
                  </Typography>
                )
              )}
              <ToggleButtonGroup
                size="small"
                exclusive
                value={view}
                aria-label={t('view')}
                onChange={(_e, next: View | null) => {
                  if (next) {
                    setView(next);
                    storeView(next);
                  }
                }}
              >
                <Tooltip title={t('viewCards')}>
                  <ToggleButton value="cards" aria-label={t('viewCards')}>
                    <GridViewOutlinedIcon fontSize="small" />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title={t('viewTable')}>
                  <ToggleButton value="table" aria-label={t('viewTable')}>
                    <TableRowsOutlinedIcon fontSize="small" />
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
            </Stack>
          </Stack>
          {query.error && (
            <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
              <ReviewError error={query.error} />
              <Button variant="outlined" onClick={() => void query.refetch()}>
                {t('retry')}
              </Button>
            </Stack>
          )}
          {!query.isFetching && !query.error && query.data?.items.length === 0 && <Alert severity="info">{t('empty')}</Alert>}
          {!query.error && items.length > 0 && (
            <Box aria-busy={query.isFetching}>
              {view === 'table' ? <ReviewTable items={items} loading={query.isFetching} /> : <ReviewCards items={items} />}
            </Box>
          )}
          {query.data && !query.error && query.data.total > query.data.size && (
            <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center', justifyContent: 'space-between' }}>
              <Button size="small" variant="outlined" disabled={!query.data.page || query.isFetching} onClick={() => set({ page: query.data!.page - 1 })}>
                {t('previous')}
              </Button>
              <Typography variant="body2" color="text.secondary">
                {t('page')} {query.data.page + 1} {t('of')} {Math.max(1, Math.ceil(query.data.total / query.data.size))}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                disabled={(query.data.page + 1) * query.data.size >= query.data.total || query.isFetching}
                onClick={() => set({ page: query.data!.page + 1 })}
              >
                {t('next')}
              </Button>
            </Stack>
          )}
        </>
      )}
    </ReviewPage>
  );
}
