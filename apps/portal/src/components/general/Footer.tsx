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

import { Box, Divider, Grid, Link, Stack, TractusXLogo, Typography, tractusx, useTheme } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';

/** `label` is an i18n key in common.json (footer.*). */
const ECLIPSE_LINKS = [
  { label: 'footer.about', href: 'https://www.eclipse.org' },
  { label: 'footer.privacy', href: 'https://www.eclipse.org/legal/privacy.php' },
  { label: 'footer.terms', href: 'https://www.eclipse.org/legal/termsofuse.php' },
  { label: 'footer.compliance', href: 'https://www.eclipse.org/legal/compliance/' },
  { label: 'footer.legal', href: 'https://www.eclipse.org/legal' },
] as const;

const PROJECT_LINKS = [
  { label: 'brand.tractusx', href: 'https://eclipse-tractusx.github.io' },
  { label: 'footer.sourceCode', href: 'https://github.com/eclipse-tractusx/dataspace-mgm-ui' },
  { label: 'footer.architecture', href: 'https://github.com/eclipse-tractusx/dataspace-mgm-service/tree/main/docs/architecture' },
] as const;

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<{ label: string; href: string }> }) {
  const { t } = useTranslation();
  return (
    <Stack spacing={1} component="nav" aria-label={title}>
      <Typography variant="overline" sx={{ color: tractusx.white }}>
        {title}
      </Typography>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          sx={{ color: 'rgba(255, 255, 255, 0.85)', '&:hover': { color: tractusx.orange } }}
        >
          {t(link.label)}
        </Link>
      ))}
    </Stack>
  );
}

/** Footer in the dark style of eclipse-tractusx.github.io, mentioning the Eclipse Foundation (slide 14). */
export default function Footer() {
  const { palette } = useTheme();
  const { t } = useTranslation();
  return (
    <Box
      component="footer"
      sx={{ bgcolor: palette.ui.footer, color: tractusx.white, borderTop: '0.5px solid', borderColor: palette.ui.cardBorder }}
    >
      <Grid container spacing={4} sx={{ px: { xs: 3, md: 6 }, py: 5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <TractusXLogo size={32} decorative />
              <Typography sx={{ fontWeight: 800, fontSize: 18 }}>{t('brand.tractusx')}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              {t('footer.tagline')}
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FooterColumn title={t('footer.eclipseFoundation')} links={ECLIPSE_LINKS} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FooterColumn title={t('brand.product')} links={PROJECT_LINKS} />
        </Grid>
      </Grid>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />
      <Box sx={{ px: { xs: 3, md: 6 }, py: 2.5 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
          {t('footer.copyright')}
        </Typography>
      </Box>
    </Box>
  );
}

