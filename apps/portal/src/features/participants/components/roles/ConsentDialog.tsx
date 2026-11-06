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
import type { CompanyRoleStateAnemic } from '@dataspace-mgm/c3-m1-core';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Stack } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { PARTICIPANTS_NS } from '../../i18n';
import { TermsLink } from './TermsLink';

interface ConsentDialogProps {
  role: CompanyRoleStateAnemic;
  companyName: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Adding a role: one checkbox per term; "Add the role" only once every term is accepted (configurator consent=dialog). */
export function ConsentDialog({ role, companyName, busy, onCancel, onConfirm }: ConsentDialogProps) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const [accepted, setAccepted] = useState<ReadonlySet<string>>(new Set());
  const name = t(`roles.${role.companyRole}`, { defaultValue: role.companyRole });
  const all = role.agreements.every((agreement) => accepted.has(agreement.agreementKey));
  const toggle = (key: string) =>
    setAccepted((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  return (
    <Dialog open onClose={busy ? undefined : onCancel} aria-labelledby="consent-title" fullWidth maxWidth="sm">
      <DialogTitle id="consent-title">{t('roleCards.addTitle', { role: name })}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{role.description}</DialogContentText>
        <DialogContentText sx={{ mb: 1 }}>{t('roleCards.acceptFor', { role: name, company: companyName })}</DialogContentText>
        <Stack>
          {role.agreements.map((agreement) => (
            <FormControlLabel
              key={agreement.agreementKey}
              control={<Checkbox checked={accepted.has(agreement.agreementKey)} onChange={() => toggle(agreement.agreementKey)} />}
              label={
                <span>
                  {t('roleCards.acceptPrefix')} <TermsLink agreement={agreement} />, {t('roleCards.version', { version: agreement.version })}
                </span>
              }
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={busy}>{t('actions.cancel')}</Button>
        <Button variant="contained" onClick={onConfirm} disabled={!all || busy}>{t('roleCards.add')}</Button>
      </DialogActions>
    </Dialog>
  );
}
