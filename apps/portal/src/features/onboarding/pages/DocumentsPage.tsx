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

import { useState } from 'react';
import type { DocumentInfoAnemic, DocumentType, FailedOutcome, ProblemOutcome } from '@dataspace-mgm/c1-m2-core';
import { Alert, ArrowForwardIcon, Box, Button, Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Typography } from '@dataspace-mgm/ui-mui';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentSection } from '../components/DocumentSection';
import { OutcomeAlert } from '../components/OutcomeAlert';
import { PageFrame } from '../components/PageFrame';
import { StateView } from '../components/StateView';
import { Toast } from '../components/Toast';
import { useApplicationActions, useOwnApplication } from '../hooks/useApplications';
import { ONBOARDING_NS } from '../i18n';
import { DOCUMENTS_STEPS } from './flowSteps';

const TYPES: ReadonlyArray<DocumentType> = ['COMMERCIAL_REGISTER_EXTRACT', 'POWER_OF_ATTORNEY', 'OTHER'];

/** Supporting documents (mockup view 3, decided: one section per type, declaration on this page). */
export default function DocumentsPage() {
  const { t } = useTranslation(ONBOARDING_NS);
  const navigate = useNavigate();
  const { applicationId = '' } = useParams();
  const { state, reload } = useOwnApplication(applicationId);
  const actions = useApplicationActions(applicationId);
  const [expanded, setExpanded] = useState<ReadonlySet<DocumentType>>(new Set(['COMMERCIAL_REGISTER_EXTRACT']));
  const [uploading, setUploading] = useState<DocumentType | null>(null);
  const [outcome, setOutcome] = useState<ProblemOutcome | FailedOutcome | null>(null);
  const [toDelete, setToDelete] = useState<DocumentInfoAnemic | null>(null);
  const [declared, setDeclared] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (state.status !== 'found' || !actions) {
    return (
      <PageFrame titleKey="documents.title">
        <StateView state={state} returnTo={`/onboarding/application/${applicationId}/documents`} />
      </PageFrame>
    );
  }
  const { application } = state;
  const locked = application.status !== 'CREATED';
  const company = application.companyData.legalName;
  const upload = async (type: DocumentType, file: File) => {
    setUploading(type);
    const answer = await actions.upload(file, type);
    setUploading(null);
    if (answer.status === 'uploaded') {
      setOutcome(null);
      setToast(t('documents.uploadedToast', { file: file.name }));
      reload();
    } else {
      setOutcome(answer);
    }
  };
  const remove = async () => {
    if (!toDelete) {
      return;
    }
    const answer = await actions.deleteDocument(toDelete.documentId);
    setToDelete(null);
    if (answer.status === 'deleted') {
      setToast(t('documents.deletedToast'));
      reload();
    } else {
      setOutcome(answer);
    }
  };

  return (
    <PageFrame titleKey="documents.title" steps={{ keys: DOCUMENTS_STEPS, current: 3 }}>
      <Typography color="text.secondary">
        <Trans t={t} i18nKey="documents.intro" values={{ company }} components={{ strong: <strong /> }} />
      </Typography>
      {locked && <Alert severity="info">{t('documents.locked')}</Alert>}
      {outcome && <OutcomeAlert outcome={outcome} />}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {TYPES.map((type) => (
          <DocumentSection
            key={type}
            type={type}
            document={application.documents.find((document) => document.documentType === type)}
            locked={locked}
            uploading={uploading === type}
            expanded={expanded.has(type)}
            onToggle={() => setExpanded((open) => (open.has(type) ? new Set([...open].filter((x) => x !== type)) : new Set([...open, type])))}
            onUpload={(file) => upload(type, file)}
            onOpen={(document) => actions.openDocument(document.documentId)}
            onDelete={setToDelete}
          />
        ))}
      </Box>
      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <FormControlLabel
            control={<Checkbox checked={declared} onChange={(event) => setDeclared(event.target.checked)} disabled={locked} />}
            label={<Trans t={t} i18nKey="documents.declaration" values={{ company }} components={{ strong: <strong /> }} />}
          />
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => navigate(`/onboarding/application/${applicationId}/company-data`)}>
          {t('back')}
        </Button>
        {/* The declaration is sent with POST …/submit (SubmitRequest.representationDeclared) on the next page. */}
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => navigate(`/onboarding/application/${applicationId}/terms`, { state: { representationDeclared: declared } })}>
          {t('continue')}
        </Button>
      </Box>
      <Dialog open={Boolean(toDelete)} onClose={() => setToDelete(null)} aria-labelledby="delete-title">
        <DialogTitle id="delete-title">{t('documents.deleteTitle')}</DialogTitle>
        <DialogContent>
          <Typography>{t('documents.deleteText', { file: toDelete?.fileName ?? '' })}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => setToDelete(null)}>
            {t('documents.keep')}
          </Button>
          <Button variant="contained" onClick={remove}>
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
      <Toast message={toast} onClose={() => setToast(null)} />
    </PageFrame>
  );
}
