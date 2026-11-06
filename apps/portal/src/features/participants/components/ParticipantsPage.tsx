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

import type { ReactNode } from 'react';
import type { SessionAnemic } from '@dataspace-mgm/identity-core';
import { Alert, Button, Container, LoginIcon } from '@dataspace-mgm/ui-mui';
import { useTranslation } from 'react-i18next';
import { useCoreModules, useSession } from '../../../core/CoreModulesContext';
import { hasPermission, type ParticipantsPermission } from '../hooks/useParticipantSession';
import { PARTICIPANTS_NS } from '../i18n';
import { LoadingState } from './LoadingState';
import { PageHeader } from './PageHeader';
import { ParticipantsNav } from './ParticipantsNav';

interface ParticipantsPageProps {
  /** Overline and title of the page while it cannot show its content yet (session, permission). */
  overline: string;
  title: string;
  /** The permission of the page's main operation (`x-permission`). Without it the page says so and calls nothing. */
  permission: ParticipantsPermission;
  /** The text shown to a person without the permission. */
  forbiddenText: string;
  /** Where to come back after signing in. */
  returnTo: string;
  /** The page itself, once a person with the permission is signed in. */
  children: (session: SessionAnemic) => ReactNode;
}

/**
 * The frame of every page: the session gate (loading, signed out, failed), the permission of the page (hides the page;
 * the API enforces it again), the area navigation and the page's content.
 */
export function ParticipantsPage({ overline, title, permission, forbiddenText, returnTo, children }: ParticipantsPageProps) {
  const { t } = useTranslation(PARTICIPANTS_NS);
  const state = useSession();
  const { identity } = useCoreModules();

  let body: ReactNode;
  if (state.status === 'loading') {
    body = <LoadingState text={t('session.loading')} />;
  } else if (state.status === 'signed-out') {
    body = (
      <Alert
        severity="info"
        action={
          <Button color="inherit" startIcon={<LoginIcon />} onClick={() => identity.login.execute(returnTo)}>
            {t('signIn')}
          </Button>
        }
      >
        {t('session.signInPrompt')}
      </Alert>
    );
  } else if (state.status === 'failed') {
    body = <Alert severity="error">{t('session.failed', { message: state.message })}</Alert>;
  } else if (!hasPermission(state.session, permission)) {
    body = (
      <>
        <ParticipantsNav />
        <Alert severity="error">{forbiddenText}</Alert>
      </>
    );
  } else {
    body = (
      <>
        <ParticipantsNav />
        {children(state.session)}
      </>
    );
  }

  const ready = state.status === 'signed-in' && hasPermission(state.session, permission);
  return (
    <Container component="article" maxWidth="lg" aria-labelledby="participants-title" sx={{ py: { xs: 4, md: 6 } }}>
      {!ready && <PageHeader overline={overline} title={title} />}
      {body}
    </Container>
  );
}
