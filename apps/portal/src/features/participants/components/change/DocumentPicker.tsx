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

import { useId, useState, type DragEvent } from 'react';
import { C3M1_LIMITS, type DocumentFileAnemic, type ValidationErrorData } from '@dataspace-mgm/c3-m1-core';
import { Box, Button, CloseIcon, DescriptionOutlinedIcon, IconButton, Stack, Typography, UploadFileOutlinedIcon, alpha, tractusx } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { formatBytes } from '../../utils/format';
import { fieldError } from '../problems';

const ACCEPT = 'application/pdf,image/png,image/jpeg';

const toDocument = (file: File): DocumentFileAnemic => ({ fileName: file.name, mediaType: file.type, sizeBytes: file.size, content: file });

interface DocumentPickerProps {
  value: ReadonlyArray<DocumentFileAnemic>;
  errors: ReadonlyArray<ValidationErrorData>;
  onChange: (value: DocumentFileAnemic[]) => void;
}

/** Supporting documents: a drop zone with a file button (configurator choice upload=dropzone) and the chosen files. */
export function DocumentPicker({ value, errors, onChange }: DocumentPickerProps) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const inputId = useId();
  const [over, setOver] = useState(false);
  const full = value.length >= C3M1_LIMITS.MAX_DOCUMENTS;
  const add = (files: FileList | null) => {
    if (files?.length) {
      onChange([...value, ...Array.from(files).map(toDocument)]);
    }
  };
  const drop = (event: DragEvent) => {
    event.preventDefault();
    setOver(false);
    if (!full) {
      add(event.dataTransfer.files);
    }
  };
  const listError = fieldError(t, errors, 'documents');
  return (
    <Stack spacing={2}>
      <Box
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={drop}
        sx={{
          border: '2px dashed',
          borderColor: over ? tractusx.orange : 'divider',
          borderRadius: '10px',
          p: 3,
          textAlign: 'center',
          bgcolor: over ? alpha(tractusx.orange, 0.06) : undefined,
          opacity: full ? 0.6 : 1,
        }}
      >
        <UploadFileOutlinedIcon aria-hidden sx={{ fontSize: 36, color: 'text.secondary' }} />
        <Typography>{t('change.dropFiles')}</Typography>
        <Button component="label" htmlFor={inputId} variant="outlined" size="small" disabled={full} sx={{ mt: 1 }}>
          {t('change.chooseFiles')}
          <input id={inputId} hidden type="file" accept={ACCEPT} multiple disabled={full} onChange={(event) => { add(event.target.files); event.target.value = ''; }} />
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('change.documentsHelp', { maxMb: 10, max: C3M1_LIMITS.MAX_DOCUMENTS })}
        </Typography>
      </Box>
      {listError && <Typography color="error" role="alert">{listError}</Typography>}
      <Stack component="ul" spacing={1} sx={{ listStyle: 'none', p: 0, m: 0 }} aria-label={t('change.chosenFiles')}>
        {value.map((document, index) => {
          const error = fieldError(t, errors, `documents.${index}`);
          return (
            <Stack component="li" key={`${document.fileName}-${index}`} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <DescriptionOutlinedIcon color={error ? 'error' : 'action'} aria-hidden />
              <Box sx={{ flexGrow: 1 }}>
                <Typography>{document.fileName}</Typography>
                <Typography variant="body2" color={error ? 'error' : 'text.secondary'}>
                  {error ?? formatBytes(document.sizeBytes)}
                </Typography>
              </Box>
              <IconButton aria-label={t('change.removeFile', { fileName: document.fileName })} onClick={() => onChange(value.filter((_, at) => at !== index))}>
                <CloseIcon />
              </IconButton>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
