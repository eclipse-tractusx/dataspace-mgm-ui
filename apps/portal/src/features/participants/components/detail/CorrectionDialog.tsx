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
import {
  C3M1_LIMITS,
  IdentifierDomain,
  type AddressAnemic,
  type CompanyCorrectionData,
  type CompanyDetailAnemic,
  type DeclaredIdentifierAnemic,
  type OperationResult,
} from '@dataspace-mgm/c3-m1-core';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { countryName } from '../../utils/format';
import { IdentifierEditor } from '../change/IdentifierEditor';
import { fieldError } from '../problems';
import { ResultAlert } from '../ResultAlert';

const ADDRESS_FIELDS = [
  ['street', 8, 255],
  ['houseNumber', 4, 50],
  ['addressAddition', 12, 255],
  ['postalCode', 4, 12],
  ['city', 5, 255],
  ['region', 3, 3],
] as const;

const sameAddress = (a: AddressAnemic, b: AddressAnemic) => ADDRESS_FIELDS.every(([key]) => (a[key] ?? '').trim() === (b[key] ?? '').trim());

interface CorrectionDialogProps {
  company: CompanyDetailAnemic;
  onCancel: () => void;
  onSave: (correction: CompanyCorrectionData) => Promise<OperationResult<CompanyDetailAnemic>>;
}

/** "Correct the company data" (configurator choice correct=dialog): only changed parts are sent, with a reason. */
export function CorrectionDialog({ company, onCancel, onSave }: CorrectionDialogProps) {
  const { t, i18n } = useTranslation(PARTICIPANTS_NS);
  const declared = IdentifierDomain.declared(company.identifiers);
  const [name, setName] = useState(company.name);
  const [shortName, setShortName] = useState(company.shortName ?? '');
  const [address, setAddress] = useState<AddressAnemic>(company.postalAddress);
  const [identifiers, setIdentifiers] = useState<DeclaredIdentifierAnemic[]>(declared);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<OperationResult<CompanyDetailAnemic> | null>(null);
  const errors = result?.status === 'invalid' ? result.errors : [];

  const save = async () => {
    const correction: CompanyCorrectionData = {
      ...(name.trim() !== company.name ? { name } : {}),
      ...((shortName.trim() || null) !== company.shortName ? { shortName: shortName.trim() || null } : {}),
      ...(!sameAddress(address, company.postalAddress) ? { address } : {}),
      ...(!IdentifierDomain.sameList(identifiers, declared) ? { identifiers } : {}),
      reason,
    };
    setBusy(true);
    setResult(await onSave(correction));
    setBusy(false);
  };

  return (
    <Dialog open onClose={busy ? undefined : onCancel} aria-labelledby="correct-title" fullWidth maxWidth="md">
      <DialogTitle id="correct-title">{t('detail.correctTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{t('detail.correctSubtitle')}</DialogContentText>
        {company.coreDataSource === 'EBW' && <Alert severity="warning" sx={{ mb: 2 }}>{t('detail.correctWalletWarning')}</Alert>}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField fullWidth label={t('fields.name')} value={name} onChange={(event) => setName(event.target.value)} error={Boolean(fieldError(t, errors, 'name'))} helperText={fieldError(t, errors, 'name')} slotProps={{ htmlInput: { maxLength: C3M1_LIMITS.COMPANY_NAME_MAX } }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label={t('fields.shortName')} value={shortName} onChange={(event) => setShortName(event.target.value)} slotProps={{ htmlInput: { maxLength: C3M1_LIMITS.SHORT_NAME_MAX } }} />
          </Grid>
          {ADDRESS_FIELDS.map(([key, width, max]) => (
            <Grid key={key} size={{ xs: 12, md: width }}>
              <TextField
                fullWidth
                label={t(`fields.${key}`)}
                value={address[key] ?? ''}
                onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
                error={Boolean(fieldError(t, errors, `address.${key}`))}
                helperText={fieldError(t, errors, `address.${key}`)}
                slotProps={{ htmlInput: { maxLength: max } }}
              />
            </Grid>
          ))}
          <Grid size={12}>
            <TextField fullWidth disabled label={t('fields.country')} value={`${countryName(address.countryCode, i18n.language)} (${address.countryCode})`} helperText={company.bpn ? t('detail.countryLocked') : undefined} />
          </Grid>
        </Grid>
        <Typography variant="overline" color="text.secondary" component="h3" sx={{ mt: 3, display: 'block' }}>{t('detail.declaredIdentifiers')}</Typography>
        <IdentifierEditor fixed={company.identifiers.filter((identifier) => identifier.source === 'BUSINESS_WALLET')} value={identifiers} errors={errors} onChange={setIdentifiers} />
        <TextField
          fullWidth
          required
          multiline
          minRows={2}
          margin="normal"
          label={t('detail.reason')}
          placeholder={t('detail.correctReasonPlaceholder')}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          error={Boolean(fieldError(t, errors, 'reason'))}
          helperText={fieldError(t, errors, 'reason') ?? t('detail.correctReasonHelp')}
          slotProps={{ htmlInput: { maxLength: C3M1_LIMITS.REASON_MAX } }}
        />
        {result && result.status !== 'success' && result.status !== 'invalid' && <ResultAlert result={result} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={busy}>{t('actions.cancel')}</Button>
        <Button variant="contained" onClick={() => void save()} disabled={busy}>{t('detail.saveCorrection')}</Button>
      </DialogActions>
    </Dialog>
  );
}
