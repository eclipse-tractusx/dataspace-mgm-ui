/********************************************************************************
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

import { useState, type MouseEvent } from 'react';
import {
  CheckIcon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TranslateOutlinedIcon,
  Tooltip,
  tractusx,
} from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, currentLanguage } from '../../i18n';

interface LanguageOptionsProps {
  id: string;
  anchor: HTMLElement | null;
  onClose: () => void;
  anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };
  transformOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };
}

/**
 * The languages of the portal, each in its own name, the one in use checked. The choice applies at once and is kept
 * in this browser (src/i18n).
 */
export function LanguageOptions({ id, anchor, onClose, anchorOrigin, transformOrigin }: LanguageOptionsProps) {
  const { t, i18n } = useTranslation();
  const active = currentLanguage();
  return (
    <Menu
      id={id}
      anchorEl={anchor}
      open={Boolean(anchor)}
      onClose={onClose}
      anchorOrigin={anchorOrigin ?? { vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={transformOrigin ?? { vertical: 'top', horizontal: 'right' }}
      slotProps={{ list: { 'aria-label': t('language.menu') } }}
    >
      {SUPPORTED_LANGUAGES.map((language) => (
        <MenuItem
          key={language}
          role="menuitemradio"
          aria-checked={language === active}
          lang={language}
          onClick={() => {
            onClose();
            void i18n.changeLanguage(language);
          }}
        >
          <ListItemIcon sx={{ color: tractusx.orange }}>{language === active && <CheckIcon fontSize="small" />}</ListItemIcon>
          <ListItemText primary={LANGUAGE_NAMES[language]} />
        </MenuItem>
      ))}
    </Menu>
  );
}

/** The language switch of the header on desktop; on phones it is a tile in All services. */
export default function LanguageMenu() {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);
  return (
    <>
      <Tooltip title={t('language.label')} disableHoverListener={open}>
        <IconButton
          onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
          aria-label={t('language.label')}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? 'language-menu' : undefined}
          sx={{ color: 'text.primary', '&:hover': { color: tractusx.orange } }}
        >
          <TranslateOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <LanguageOptions id="language-menu" anchor={anchor} onClose={() => setAnchor(null)} />
    </>
  );
}
