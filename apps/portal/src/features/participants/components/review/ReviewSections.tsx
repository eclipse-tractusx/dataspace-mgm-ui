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

import type { ChangeRequestDetailAnemic, DocumentInfoAnemic } from '@dataspace-mgm/c3-m1-core';
import { Badge, Button, Card, CardContent, FileDownloadOutlinedIcon, Stack, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { changeRows } from '../../utils/change-rows';
import { ChangeTable } from '../ChangeTable';
import { DocumentList } from '../DocumentList';

interface ReviewSectionsProps {
  request: ChangeRequestDetailAnemic;
  downloading: string | null;
  onDownload: (document: DocumentInfoAnemic) => void;
}

/** Requested changes (compare=table), the reason of the company and the supporting documents (documents=list). */
export function ReviewSections({ request, downloading, onDownload }: ReviewSectionsProps) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const rows = changeRows(request.changes, request.company);
  return (
    <Stack spacing={2}>
      <Card variant="outlined" component="section" aria-labelledby="requested-title">
        <CardContent>
          <Typography id="requested-title" variant="h3" component="h2" sx={{ fontSize: 20 }}>{t('review.requestedChanges')}</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>{t(`review.effect.${request.company.coreDataSource}`)}</Typography>
          <ChangeTable rows={rows} caption={t('review.requestedChanges')} />
        </CardContent>
      </Card>
      <Card variant="outlined" component="section" aria-labelledby="reason-title">
        <CardContent>
          <Typography id="reason-title" variant="h3" component="h2" sx={{ fontSize: 20, mb: 1 }}>{t('review.companyReason')}</Typography>
          <Typography component="blockquote" sx={{ m: 0, fontStyle: 'italic' }}>“{request.comment}”</Typography>
        </CardContent>
      </Card>
      <Card variant="outlined" component="section" aria-labelledby="documents-title">
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
            <Typography id="documents-title" variant="h3" component="h2" sx={{ fontSize: 20 }}>{t('change.documentsTitle')}</Typography>
            <Badge badgeContent={request.documents.length} color="primary" />
          </Stack>
          <DocumentList
            documents={request.documents}
            label={t('change.documentsTitle')}
            action={(document) => (
              <Button size="small" startIcon={<FileDownloadOutlinedIcon />} onClick={() => onDownload(document)} disabled={downloading === document.id} aria-label={t('review.downloadFile', { fileName: document.fileName })}>
                {t('review.download')}
              </Button>
            )}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{t('review.auditNote')}</Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
