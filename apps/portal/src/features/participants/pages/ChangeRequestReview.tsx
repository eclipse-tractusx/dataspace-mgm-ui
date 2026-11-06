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

import { useState, type ReactNode } from 'react';
import { ChangeRequestDomain, type ChangeRequestAnemic, type DocumentFileAnemic, type DocumentInfoAnemic, type OperationResult } from '@dataspace-mgm/c3-m1-core';
import { Alert, Box, Button, CheckIcon, CloseIcon, Link, Paper, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useCoreModules } from '../../../core/CoreModulesContext';
import { LoadingState } from '../components/LoadingState';
import { PageHeader } from '../components/PageHeader';
import { ParticipantsPage } from '../components/ParticipantsPage';
import { ReasonDialog } from '../components/ReasonDialog';
import { ResultAlert } from '../components/ResultAlert';
import { ReviewSections } from '../components/review/ReviewSections';
import { StatusChip } from '../components/StatusChip';
import { useLoad } from '../hooks/useLoad';
import { PARTICIPANTS_NS } from '../i18n';
import { participantsPath } from '../paths';
import { changeSummary } from '../utils/change-summary';
import { formatDateTime, shortId } from '../utils/format';
import { saveFile } from '../utils/save-file';

type Decision = 'approve' | 'decline';

function Review({ changeRequestId }: { changeRequestId: string }) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const { c3m1 } = useCoreModules();
  const request = useLoad(`review:${changeRequestId}`, () => c3m1.getChangeRequest.execute(changeRequestId));
  const [deciding, setDeciding] = useState<Decision | null>(null);
  const [busy, setBusy] = useState(false);
  const [decision, setDecision] = useState<OperationResult<ChangeRequestAnemic> | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [download, setDownload] = useState<OperationResult<DocumentFileAnemic> | null>(null);
  const back = { to: participantsPath.reviewQueue(), label: t('queue.title') };

  const value = request.value;
  if (value === null || value.status !== 'success') {
    return (
      <>
        <PageHeader overline={t('overline')} title={t('review.title')} back={back} />
        {value === null ? (
          <LoadingState text={t('review.loading')} />
        ) : (
          <ResultAlert result={value} notFoundText={t('review.notFound')} forbiddenText={t('queue.forbidden')} action={<Button color="inherit" component={RouterLink} to={participantsPath.reviewQueue()}>{t('review.backToList')}</Button>} />
        )}
      </>
    );
  }
  const detail = value.data;
  const summary = changeSummary(t, detail.changes, detail.company);

  const decide = async (kind: Decision, text: string) => {
    setBusy(true);
    const result = kind === 'approve' ? await c3m1.approveChangeRequest.execute(detail.id, text) : await c3m1.declineChangeRequest.execute(detail.id, text);
    setBusy(false);
    setDecision(result);
    if (result.status !== 'invalid') {
      setDeciding(null);
    }
    if (result.status === 'success') {
      request.replace({ status: 'success', data: { ...detail, ...result.data } });
    }
  };
  const fetchDocument = async (document: DocumentInfoAnemic) => {
    setDownloading(document.id);
    const result = await c3m1.downloadChangeRequestDocument.execute(detail.id, document.id);
    setDownloading(null);
    setDownload(result.status === 'success' ? null : result);
    if (result.status === 'success') {
      saveFile(result.data);
    }
  };

  let outcome: ReactNode = null;
  if (decision?.status === 'success') {
    const values = { company: detail.company.name, date: formatDateTime(decision.data.closedAt, i18n.language), reason: decision.data.decisionReason ?? '' };
    outcome = decision.data.status === 'APPROVED' ? <Alert severity="success">{t('review.approved', values)}</Alert> : <Alert severity="info">{t('review.declined', values)}</Alert>;
  } else if (decision && decision.status !== 'invalid') {
    outcome = <ResultAlert result={decision} />;
  }

  return (
    <>
      <PageHeader overline={t('overline')} title={t('review.title')} back={back} />
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center', mb: 3, color: 'text.secondary' }}>
        <StatusChip kind="changeRequestStatus" value={detail.status} />
        <span>·</span>
        <span>
          {t('review.company')} <Link component={RouterLink} to={participantsPath.companyDetail(detail.companyId)}>{detail.company.name}</Link>
        </span>
        <span>·</span>
        <span>{t('review.submitted', { date: formatDateTime(detail.createdAt, i18n.language), person: shortId(detail.requestedBy) })}</span>
        <span>·</span>
        <span>{t(`coreDataSource.${detail.company.coreDataSource}`)}</span>
      </Stack>
      <Stack spacing={2}>
        {outcome}
        {download && download.status !== 'success' && <ResultAlert result={download} />}
        <ReviewSections request={detail} downloading={downloading} onDownload={(document) => void fetchDocument(document)} />
        {ChangeRequestDomain.isOpen(detail) && (
          <Paper variant="outlined" component="section" aria-label={t('review.decision')} sx={{ p: 2, position: 'sticky', bottom: 16, borderRadius: '10px' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
              <Typography sx={{ flexGrow: 1 }}>{t('review.decisionText', { company: detail.company.name })}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" startIcon={<CloseIcon />} onClick={() => setDeciding('decline')}>{t('review.decline')}</Button>
                <Button variant="contained" startIcon={<CheckIcon />} onClick={() => setDeciding('approve')}>{t('review.approve')}</Button>
              </Box>
            </Stack>
          </Paper>
        )}
      </Stack>
      <ReasonDialog
        key={deciding ?? 'none'}
        open={deciding !== null}
        title={deciding === 'decline' ? t('review.declineTitle') : t('review.approveTitle')}
        body={deciding === 'decline' ? t('review.declineText') : t('review.approveText', { summary, company: detail.company.name })}
        input={
          deciding === 'decline'
            ? { label: t('review.reason'), help: t('review.declineHelp'), maxLength: 1000, field: 'reason', required: true }
            : { label: t('review.comment'), help: t('review.approveHelp'), maxLength: 1000, field: 'comment', required: false }
        }
        confirmLabel={deciding === 'decline' ? t('review.decline') : t('review.approve')}
        danger={deciding === 'decline'}
        busy={busy}
        errors={decision?.status === 'invalid' ? decision.errors : []}
        onCancel={() => {
          setDeciding(null);
          setDecision(null);
        }}
        onConfirm={(text) => deciding && void decide(deciding, text)}
      />
    </>
  );
}

/**
 * View 9 "Review change request" (C3-M1 `getChangeRequest`, `getChangeRequestDocument`, `approveChangeRequest`,
 * `declineChangeRequest`). The four-eyes principle is the API's (409 `same-person`). Provisional configurator choice:
 * compare=table · documents=list · decision=bar.
 */
export default function ChangeRequestReview() {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const { changeRequestId = '' } = useParams();
  return (
    <ParticipantsPage overline={t('overline')} title={t('review.title')} permission="review_company_changes" forbiddenText={t('queue.forbidden')} returnTo={participantsPath.review(changeRequestId)}>
      {() => <Review key={changeRequestId} changeRequestId={changeRequestId} />}
    </ParticipantsPage>
  );
}
