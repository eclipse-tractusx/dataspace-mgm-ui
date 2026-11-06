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

import { IDENTIFIER_TYPES, type DeclaredIdentifierAnemic, type IdentifierAnemic, type IdentifierType, type ValidationErrorData } from '@dataspace-mgm/c3-m1-core';
import { AddIcon, Button, DeleteOutlinedIcon, IconButton, MenuItem, Stack, TextField, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { fieldError } from '../problems';

interface IdentifierEditorProps {
  /** Identifiers from the Business Wallet: shown, never edited. */
  fixed: ReadonlyArray<IdentifierAnemic>;
  value: ReadonlyArray<DeclaredIdentifierAnemic>;
  errors: ReadonlyArray<ValidationErrorData>;
  onChange: (value: DeclaredIdentifierAnemic[]) => void;
}

/** The complete new list of declared identifiers: type and value per row, add and remove. */
export function IdentifierEditor({ fixed, value, errors, onChange }: IdentifierEditorProps) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const fixedTypes = new Set(fixed.map((identifier) => identifier.type));
  const choosable = IDENTIFIER_TYPES.filter((type) => !fixedTypes.has(type));
  const unused = choosable.filter((type) => !value.some((identifier) => identifier.type === type));
  const update = (index: number, next: Partial<DeclaredIdentifierAnemic>) => onChange(value.map((item, at) => (at === index ? { ...item, ...next } : item)));

  return (
    <Stack spacing={2}>
      {fixed.map((identifier) => (
        <Typography key={identifier.type} color="text.secondary">
          {t('identifier', { type: t(`identifierTypes.${identifier.type}`), value: identifier.value })} · {t('identifierSource.BUSINESS_WALLET')}
        </Typography>
      ))}
      {value.map((identifier, index) => (
        <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'flex-start' } }}>
          <TextField
            select
            size="small"
            label={t('change.identifierType')}
            value={identifier.type}
            onChange={(event) => update(index, { type: event.target.value as IdentifierType })}
            sx={{ minWidth: 220 }}
          >
            {choosable.map((type) => (
              <MenuItem key={type} value={type}>
                {t(`identifierTypes.${type}`)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label={t('change.identifierValue')}
            value={identifier.value}
            onChange={(event) => update(index, { value: event.target.value })}
            error={Boolean(fieldError(t, errors, `identifiers.${index}`))}
            helperText={fieldError(t, errors, `identifiers.${index}`)}
            slotProps={{ htmlInput: { maxLength: 255, style: { fontFamily: 'monospace' } } }}
            sx={{ flexGrow: 1 }}
          />
          <IconButton aria-label={t('change.removeIdentifier', { type: t(`identifierTypes.${identifier.type}`) })} onClick={() => onChange(value.filter((_, at) => at !== index))}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Stack>
      ))}
      <div>
        <Button startIcon={<AddIcon />} disabled={unused.length === 0} onClick={() => onChange([...value, { type: unused[0], value: '' }])}>
          {t('change.addIdentifier')}
        </Button>
      </div>
    </Stack>
  );
}
