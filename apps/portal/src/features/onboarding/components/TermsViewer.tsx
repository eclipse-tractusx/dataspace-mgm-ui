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

import { useRef, useState } from 'react';
import type { AgreementAnemic, Language } from '@dataspace-mgm/c1-m2-core';
import { Box, Button, CheckIcon, Dialog, MenuItem, Stack, TextField, Typography } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { ONBOARDING_NS } from '../i18n';

interface TermsViewerProps {
  term: AgreementAnemic | null;
  preferred: Language;
  onCancel: () => void;
  onAccept: (term: AgreementAnemic, language: Language) => void;
}

/**
 * The full-screen viewer of a terms document (decided): the PDF of documentUrls[language], the language selector top
 * right, Cancel and Accept at the bottom; Accept only after the document was scrolled to its end, in the language
 * shown. The scroll position is read from the frame around the PDF: the browser's own PDF viewer reports none, so the
 * feature needs pdf.js or the terms as text (open point for phase 3).
 */
export function TermsViewer({ term, preferred, onCancel, onAccept }: TermsViewerProps) {
  return (
    <Dialog fullScreen open={Boolean(term)} onClose={onCancel} aria-labelledby="viewer-title">
      {term && <ViewerBody key={`${term.agreementKey}@${term.version}`} term={term} preferred={preferred} onCancel={onCancel} onAccept={onAccept} />}
    </Dialog>
  );
}

/** The viewer of one document; mounted per document, so the language and "read to the end" start fresh. */
function ViewerBody({ term, preferred, onCancel, onAccept }: Omit<TermsViewerProps, 'term'> & { term: AgreementAnemic }) {
  const { t } = useTranslation(ONBOARDING_NS);
  const languages = Object.keys(term.documentUrls) as Language[];
  const [language, setLanguage] = useState<Language>(languages.includes(preferred) ? preferred : languages[0]);
  const [read, setRead] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // Another language is another document: it is read from the start again.
  const changeLanguage = (next: Language) => {
    setLanguage(next);
    setRead(false);
    scroller.current?.scrollTo?.({ top: 0 });
  };
  const onScroll = () => {
    const box = scroller.current;
    if (box && box.scrollTop + box.clientHeight >= box.scrollHeight - 4) {
      setRead(true);
    }
  };
  const languageName = (code: Language) => t(`enum.language.${code}`);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ px: 3, py: 2, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', borderBottom: '1px solid', borderColor: 'ui.cardBorder' }}>
        <Box>
          <Typography id="viewer-title" variant="h3" component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
            {term.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('terms.partyVersion', { party: t(`terms.party.${term.party}`), version: term.version })}
            {languages.length < 2 && ` · ${t('terms.viewerOnly', { language: languageName(languages[0]) })}`}
          </Typography>
        </Box>
        <TextField select size="small" label={t('terms.viewerLanguage')} value={language} onChange={(event) => changeLanguage(event.target.value as Language)} disabled={languages.length < 2} sx={{ minWidth: 160 }}>
          {languages.map((code) => (
            <MenuItem key={code} value={code}>
              {languageName(code)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Box ref={scroller} onScroll={onScroll} data-testid="viewer-document" tabIndex={0} aria-label={t('terms.document')} sx={{ flex: 1, overflowY: 'auto', bgcolor: 'ui.surface', p: { xs: 2, md: 3 } }}>
        <Box component="iframe" key={language} title={term.title} src={term.documentUrls[language]} sx={{ display: 'block', width: 'min(900px, 100%)', height: '2400px', mx: 'auto', border: 0, bgcolor: 'common.white' }} />
      </Box>
      <Stack direction="row" spacing={2} sx={{ px: 3, py: 2, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', borderTop: '1px solid', borderColor: 'ui.cardBorder' }}>
        <Typography variant="body2" color="text.secondary" role="status">
          {read ? t('terms.viewerHintDone', { language: languageName(language) }) : t('terms.viewerHintScroll')}
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button variant="contained" startIcon={<CheckIcon />} disabled={!read} onClick={() => onAccept(term, language)}>
            {t('terms.accept')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
