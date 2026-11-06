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

import type { Address, Identifier, IdentifierType, IdentifierTypeInfoAnemic, IdentifierWithSource } from '@dataspace-mgm/c1-m2-core';
import { AddIcon, Box, Button, DeleteOutlinedIcon, IconButton, LockOutlinedIcon, MenuItem, TextField, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';
import { mono } from './styles';

export interface CompanyFormValue {
  legalName: string;
  shortName: string;
  address: Address;
  identifiers: ReadonlyArray<Identifier>;
}

interface CompanyFormProps {
  value: CompanyFormValue;
  onChange: (value: CompanyFormValue) => void;
  /** EBW: country and the identifiers from the attestation are shown, not edited (the API refuses changes anyway). */
  locked?: { countryName: string; identifiers: ReadonlyArray<IdentifierWithSource> };
  /** DOCUMENTS: the countries to choose from and the identifier types of the chosen country (with their pattern). */
  countries?: ReadonlyArray<{ code: string; name: string }>;
  identifierTypes?: ReadonlyArray<IdentifierTypeInfoAnemic>;
}

const grid = { display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } } as const;

/** The company data as a form (PATCH /applications/{id} in EBW, companyData of POST /applications in DOCUMENTS). */
export function CompanyForm({ value, onChange, locked, countries, identifierTypes = [] }: CompanyFormProps) {
  const { t } = useTranslation(ONBOARDING_NS);
  const set = (patch: Partial<CompanyFormValue>) => onChange({ ...value, ...patch });
  const setAddress = (patch: Partial<Address>) => set({ address: { ...value.address, ...patch } });
  const setIdentifier = (index: number, patch: Partial<Identifier>) =>
    set({ identifiers: value.identifiers.map((identifier, i) => (i === index ? { ...identifier, ...patch } : identifier)) });
  const lockedField = (label: string, shown: string) => (
    <TextField key={label} label={label} value={shown} slotProps={{ htmlInput: { readOnly: true } }} helperText={<Box component="span" sx={{ display: 'inline-flex', gap: 0.5, alignItems: 'center' }}><LockOutlinedIcon sx={{ fontSize: 14 }} />{t('company.locked')}</Box>} />
  );
  const f = (key: string) => t(`company.fields.${key}`);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={grid}>
        <TextField label={f('legalName')} value={value.legalName} onChange={(e) => set({ legalName: e.target.value })} required sx={{ gridColumn: { md: '1 / -1' } }} />
        <TextField label={t('company.optional', { label: f('shortName') })} value={value.shortName} onChange={(e) => set({ shortName: e.target.value })} />
        {locked ? (
          lockedField(f('country'), locked.countryName)
        ) : (
          <TextField select label={f('country')} value={value.address.countryCode} onChange={(e) => setAddress({ countryCode: e.target.value })}>
            {(countries ?? []).map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {country.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField label={f('street')} value={value.address.streetName} onChange={(e) => setAddress({ streetName: e.target.value })} required />
        <TextField label={f('streetNumber')} value={value.address.streetNumber ?? ''} onChange={(e) => setAddress({ streetNumber: e.target.value || null })} />
        <TextField label={f('postalCode')} value={value.address.postalCode ?? ''} onChange={(e) => setAddress({ postalCode: e.target.value || null })} />
        <TextField label={f('city')} value={value.address.city} onChange={(e) => setAddress({ city: e.target.value })} required />
        {!locked && <TextField label={t('company.optional', { label: f('region') })} value={value.address.region ?? ''} onChange={(e) => setAddress({ region: e.target.value || null })} />}
      </Box>
      <Typography variant="h3" component="h3" sx={{ fontSize: 18, fontWeight: 700 }}>
        {f('identifiers')}
      </Typography>
      <Box sx={grid}>
        {locked?.identifiers.filter((i) => i.source === 'ATTESTATION').map((i) => lockedField(t(`enum.identifier.${i.type}`), i.value))}
        {value.identifiers.map((identifier, index) =>
          locked ? (
            <TextField key={identifier.type} label={t(`enum.identifier.${identifier.type}`)} value={identifier.value} onChange={(e) => setIdentifier(index, { value: e.target.value })} slotProps={{ htmlInput: { style: mono } }} />
          ) : (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', gridColumn: '1 / -1' }}>
              <TextField select label={f('type')} value={identifier.type} onChange={(e) => setIdentifier(index, { type: e.target.value as IdentifierType })} sx={{ minWidth: 220 }}>
                {identifierTypes.map((type) => (
                  <MenuItem key={type.type} value={type.type}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={f('value')}
                value={identifier.value}
                onChange={(e) => setIdentifier(index, { value: e.target.value })}
                helperText={t('company.format', { pattern: identifierTypes.find((type) => type.type === identifier.type)?.pattern ?? '' })}
                slotProps={{ htmlInput: { style: mono } }}
                sx={{ flex: 1 }}
              />
              <IconButton aria-label={t('company.removeIdentifier')} onClick={() => set({ identifiers: value.identifiers.filter((_, i) => i !== index) })} sx={{ mt: 1 }}>
                <DeleteOutlinedIcon />
              </IconButton>
            </Box>
          ),
        )}
      </Box>
      {!locked && (
        <Box>
          <Button variant="text" startIcon={<AddIcon />} onClick={() => set({ identifiers: [...value.identifiers, { type: identifierTypes[0]?.type ?? 'VAT_ID', value: '' }] })}>
            {t('company.addIdentifier')}
          </Button>
        </Box>
      )}
    </Box>
  );
}
