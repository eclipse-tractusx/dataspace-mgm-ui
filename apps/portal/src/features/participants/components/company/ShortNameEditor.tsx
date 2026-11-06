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
import type { CompanyAnemic, OperationResult } from '@dataspace-mgm/c3-m1-core';
import { Box, Button, EditOutlinedIcon, IconButton, Stack, TextField, Tooltip } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { fieldError } from '../problems';
import { ResultAlert } from '../ResultAlert';

interface ShortNameEditorProps {
  shortName: string | null;
  editable: boolean;
  onSave: (shortName: string) => Promise<OperationResult<CompanyAnemic>>;
}

/** The short name with inline editing (configurator choice shortname=inline): Enter saves, Escape cancels. */
export function ShortNameEditor({ shortName, editable, onSave }: ShortNameEditorProps) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const [draft, setDraft] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<OperationResult<CompanyAnemic> | null>(null);

  const save = async () => {
    if (draft === null) {
      return;
    }
    setBusy(true);
    const outcome = await onSave(draft);
    setBusy(false);
    setResult(outcome);
    if (outcome.status === 'success') {
      setDraft(null);
    }
  };
  const cancel = () => {
    setDraft(null);
    setResult(null);
  };

  if (draft === null) {
    return (
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
        {shortName ?? <Box component="span" sx={{ color: 'text.secondary' }}>{t('profile.noShortName')}</Box>}
        {editable && (
          <Tooltip title={t('profile.editShortName')}>
            <IconButton size="small" aria-label={t('profile.editShortName')} onClick={() => setDraft(shortName ?? '')}>
              <EditOutlinedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }
  const errors = result?.status === 'invalid' ? result.errors : [];
  return (
    <Stack spacing={1} sx={{ mt: 0.5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'flex-start' } }}>
        <TextField
          size="small"
          autoFocus
          label={t('fields.shortName')}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              void save();
            }
            if (event.key === 'Escape') {
              cancel();
            }
          }}
          error={errors.length > 0}
          helperText={fieldError(t, errors, 'shortName') ?? t('profile.shortNameHelp')}
          slotProps={{ htmlInput: { maxLength: 100 } }}
        />
        <Button variant="contained" size="small" onClick={() => void save()} disabled={busy}>
          {t('actions.save')}
        </Button>
        <Button size="small" onClick={cancel} disabled={busy}>
          {t('actions.cancel')}
        </Button>
      </Stack>
      {result && result.status !== 'success' && result.status !== 'invalid' && <ResultAlert result={result} />}
    </Stack>
  );
}
