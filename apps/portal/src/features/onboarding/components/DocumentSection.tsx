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

import { useRef } from 'react';
import type { DocumentInfoAnemic, DocumentType } from '@dataspace-mgm/c1-m2-core';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CheckCircleOutlinedIcon,
  CircularProgress,
  DeleteOutlinedIcon,
  DescriptionOutlinedIcon,
  ExpandMoreIcon,
  OpenInNewIcon,
  Typography,
  UploadFileOutlinedIcon,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useDate } from '../hooks/useOnboarding';
import { ONBOARDING_NS } from '../i18n';
import { IconTile } from './IconTile';

interface DocumentSectionProps {
  type: DocumentType;
  document: DocumentInfoAnemic | undefined;
  locked: boolean;
  uploading: boolean;
  expanded: boolean;
  onToggle: () => void;
  onUpload: (file: File) => void;
  onOpen: (document: DocumentInfoAnemic) => void;
  onDelete: (document: DocumentInfoAnemic) => void;
}

const size = (bytes: number) => (bytes < 1024 ? `${bytes} B` : `${Math.round(bytes / 1024)} KB`);

/** One document type (decided): the upload area, after the upload the document with Open and Delete. */
export function DocumentSection({ type, document, locked, uploading, expanded, onToggle, onUpload, onOpen, onDelete }: DocumentSectionProps) {
  const { t } = useTranslation(ONBOARDING_NS);
  const date = useDate();
  const input = useRef<HTMLInputElement>(null);
  const title = t(`enum.documentType.${type}`);
  return (
    <Accordion expanded={expanded} onChange={onToggle} disableGutters sx={{ borderRadius: '10px', '&::before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`doc-${type}`} id={`doc-${type}-head`} sx={{ px: 2.5, py: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%', pr: 1 }}>
          <IconTile size={44}>
            <DescriptionOutlinedIcon />
          </IconTile>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography component="h2" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(`documents.hint.${type}`)}
            </Typography>
          </Box>
          {document ? (
            <Box component="span" sx={{ display: 'inline-flex', gap: 0.75, alignItems: 'center', color: 'success.main', fontSize: '0.875rem' }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
              {t('documents.uploaded')}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('documents.notUploaded')}
            </Typography>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails id={`doc-${type}`} sx={{ px: 2.5, pb: 2.5 }}>
        {document ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>{document.fileName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('documents.meta', { size: size(document.sizeBytes), date: date(document.uploadedAt) })}
              </Typography>
            </Box>
            <Button variant="outlined" startIcon={<OpenInNewIcon />} onClick={() => onOpen(document)}>
              {t('open')}
            </Button>
            {!locked && (
              <Button variant="text" startIcon={<DeleteOutlinedIcon />} onClick={() => onDelete(document)}>
                {t('delete')}
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ border: '1px dashed', borderColor: 'ui.cardBorder', borderRadius: '10px', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, textAlign: 'center' }}>
            <IconTile>{uploading ? <CircularProgress size={22} /> : <UploadFileOutlinedIcon />}</IconTile>
            <Typography sx={{ fontWeight: 700 }}>{t('documents.drop')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('documents.formats')}
            </Typography>
            <Button variant="outlined" onClick={() => input.current?.click()} disabled={locked || uploading}>
              {t('documents.chooseFile')}
            </Button>
            <input
              ref={input}
              type="file"
              hidden
              accept="application/pdf,image/png,image/jpeg"
              aria-label={title}
              data-testid={`file-${type}`}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) {
                  onUpload(file);
                }
              }}
            />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
