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

import { useId, useState } from 'react';
import { Box, Button, Collapse, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { NOTIFICATIONS_NS } from '../i18n';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** `offerSubscriptionId` → `Offer subscription`: a readable label for a field without a translation yet. */
export const readableField = (name: string): string => {
  const words = name
    .replace(/Id$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/** The value in full: IDs in monospace (they may wrap anywhere on a narrow screen), yes or no for booleans. */
function DetailValue({ value }: { value: unknown }) {
  const { t } = useTranslation(NOTIFICATIONS_NS);
  if (typeof value === 'boolean') {
    return <>{value ? t('details.yes') : t('details.no')}</>;
  }
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  const id = UUID.test(text);
  return (
    <Box component="span" sx={{ fontFamily: id ? 'monospace' : undefined, wordBreak: id ? 'break-all' : 'break-word' }}>
      {text}
    </Box>
  );
}

/**
 * The content of a notification (IDs and business values of the event, README 6.2), folded by default: one labelled
 * line per field. Labels are i18n keys `details.fields.<field>`; a field without one gets a readable fallback.
 */
export function NotificationDetails({ content }: { content: Readonly<Record<string, unknown>> }) {
  const { t } = useTranslation(NOTIFICATIONS_NS);
  const [open, setOpen] = useState(false);
  const id = useId();
  const fields = Object.entries(content).filter(([, value]) => value !== null && value !== undefined && value !== '');
  if (fields.length === 0) {
    return null;
  }
  return (
    <Box sx={{ mt: 0.5 }}>
      <Button
        size="small"
        variant="text"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        sx={{ px: 0, py: 0, minWidth: 0, textTransform: 'none', fontWeight: 500 }}
      >
        {open ? t('details.hide') : t('details.show', { count: fields.length })}
      </Button>
      <Collapse in={open} unmountOnExit>
        <Box
          id={id}
          component="dl"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'max-content minmax(0, 1fr)',
            columnGap: 2,
            rowGap: 0.25,
            m: 0,
            mt: 0.5,
            px: 1.5,
            py: 1,
            borderRadius: '8px',
            bgcolor: 'action.hover',
            fontSize: '0.8125rem',
            lineHeight: 1.6,
          }}
        >
          {fields.map(([name, value]) => (
            <Box key={name} sx={{ display: 'contents' }}>
              <Typography component="dt" color="text.secondary" sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
                {t(`details.fields.${name}`, { defaultValue: readableField(name) })}
              </Typography>
              <Typography component="dd" sx={{ m: 0, fontSize: 'inherit', lineHeight: 'inherit' }}>
                <DetailValue value={value} />
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
