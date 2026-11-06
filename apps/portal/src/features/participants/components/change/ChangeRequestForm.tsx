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
  CompanyDomain,
  IdentifierDomain,
  type AddressFieldsAnemic,
  type ChangeRequestAnemic,
  type ChangeRequestDraftData,
  type CompanyAnemic,
  type DeclaredIdentifierAnemic,
  type DocumentFileAnemic,
  type OperationResult,
} from '@dataspace-mgm/c3-m1-core';
import { Button, Card, CardContent, Grid, LockOutlinedIcon, SendIcon, Stack, TextField, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { PARTICIPANTS_NS } from '../../i18n';
import { participantsPath } from '../../paths';
import { changeRows } from '../../utils/change-rows';
import { ChangeTable } from '../ChangeTable';
import { fieldError } from '../problems';
import { ResultAlert } from '../ResultAlert';
import { DocumentPicker } from './DocumentPicker';
import { IdentifierEditor } from './IdentifierEditor';

const sameAddress = (a: AddressFieldsAnemic, b: AddressFieldsAnemic) =>
  (['street', 'houseNumber', 'postalCode', 'city'] as const).every((key) => (a[key] ?? '').trim() === (b[key] ?? '').trim());

interface ChangeRequestFormProps {
  company: CompanyAnemic;
  onSubmit: (draft: ChangeRequestDraftData) => Promise<OperationResult<ChangeRequestAnemic>>;
}

/** "Request a change with documents": the new values, a comment and the supporting documents, then Now → New. */
export function ChangeRequestForm({ company, onSubmit }: ChangeRequestFormProps) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const coreEditable = CompanyDomain.canRequestCoreDataChange(company);
  const declared = IdentifierDomain.declared(company.identifiers);
  const [name, setName] = useState(company.name);
  const [address, setAddress] = useState<AddressFieldsAnemic>(company.postalAddress);
  const [identifiers, setIdentifiers] = useState<DeclaredIdentifierAnemic[]>(declared);
  const [comment, setComment] = useState('');
  const [documents, setDocuments] = useState<DocumentFileAnemic[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<OperationResult<ChangeRequestAnemic> | null>(null);

  const changes: Omit<ChangeRequestDraftData, 'comment' | 'documents'> = {
    ...(coreEditable && name.trim() !== company.name ? { name } : {}),
    ...(coreEditable && !sameAddress(address, company.postalAddress) ? { address } : {}),
    ...(!IdentifierDomain.sameList(identifiers, declared) ? { identifiers } : {}),
  };
  const rows = changeRows(changes, { name: company.name, address: company.postalAddress, identifiers: company.identifiers });
  const errors = result?.status === 'invalid' ? result.errors : [];

  const submit = async () => {
    setBusy(true);
    setResult(await onSubmit({ ...changes, comment, documents }));
    setBusy(false);
  };
  const setPart = (key: keyof AddressFieldsAnemic) => (value: string) => setAddress((current) => ({ ...current, [key]: value }));

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3" component="h2" sx={{ fontSize: 20, mb: 1 }}>{t('change.coreDataTitle')}</Typography>
          {coreEditable ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={12}>
                <TextField fullWidth label={t('fields.name')} value={name} onChange={(event) => setName(event.target.value)} error={Boolean(fieldError(t, errors, 'name'))} helperText={fieldError(t, errors, 'name')} slotProps={{ htmlInput: { maxLength: C3M1_LIMITS.COMPANY_NAME_MAX } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField fullWidth label={t('fields.street')} value={address.street} onChange={(event) => setPart('street')(event.target.value)} slotProps={{ htmlInput: { maxLength: 255 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label={t('fields.houseNumber')} value={address.houseNumber ?? ''} onChange={(event) => setPart('houseNumber')(event.target.value)} slotProps={{ htmlInput: { maxLength: 50 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label={t('fields.postalCode')} value={address.postalCode ?? ''} onChange={(event) => setPart('postalCode')(event.target.value)} slotProps={{ htmlInput: { maxLength: 12 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField fullWidth label={t('fields.city')} value={address.city} onChange={(event) => setPart('city')(event.target.value)} slotProps={{ htmlInput: { maxLength: 255 } }} />
              </Grid>
            </Grid>
          ) : (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <LockOutlinedIcon fontSize="small" aria-hidden />
              <Typography>{t('change.coreDataLocked')}</Typography>
            </Stack>
          )}
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3" component="h2" sx={{ fontSize: 20 }}>{t('fields.identifiers')}</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>{t('change.identifiersHelp')}</Typography>
          <IdentifierEditor fixed={company.identifiers.filter((identifier) => identifier.source === 'BUSINESS_WALLET')} value={identifiers} errors={errors} onChange={setIdentifiers} />
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3" component="h2" sx={{ fontSize: 20, mb: 2 }}>{t('change.whyTitle')}</Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            required
            label={t('change.comment')}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            error={Boolean(fieldError(t, errors, 'comment'))}
            helperText={fieldError(t, errors, 'comment') ?? `${comment.length} / ${C3M1_LIMITS.COMMENT_MAX}`}
            slotProps={{ htmlInput: { maxLength: C3M1_LIMITS.COMMENT_MAX } }}
          />
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3" component="h2" sx={{ fontSize: 20 }}>{t('change.documentsTitle')}</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>{t('change.documentsExample')}</Typography>
          <DocumentPicker value={documents} errors={errors} onChange={setDocuments} />
        </CardContent>
      </Card>
      <section aria-labelledby="change-review-title">
        <Typography id="change-review-title" variant="h3" component="h2" sx={{ fontSize: 20, mb: 1 }}>{t('change.reviewTitle')}</Typography>
        {rows.length ? <ChangeTable rows={rows} caption={t('change.reviewTitle')} /> : <Typography color={fieldError(t, errors, 'changes') ? 'error' : 'text.secondary'}>{fieldError(t, errors, 'changes') ?? t('change.nothingYet')}</Typography>}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{t('change.reviewMeta', { count: documents.length })}</Typography>
      </section>
      {result && result.status !== 'success' && result.status !== 'invalid' && <ResultAlert result={result} />}
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" component={RouterLink} to={participantsPath.company()}>{t('actions.cancel')}</Button>
        <Button variant="contained" startIcon={<SendIcon />} onClick={() => void submit()} disabled={busy}>{t('change.send')}</Button>
      </Stack>
    </Stack>
  );
}
