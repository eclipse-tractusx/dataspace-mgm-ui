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

import { useEffect, useRef, useState } from 'react';
import type { ApplicationKind, Verification } from '@dataspace-mgm/c1-m2-core';
import { Alert, Button, Typography } from '@dataspace-mgm/ui-mui';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GoalSection, type Goal } from '../components/GoalSection';
import { OutcomeAlert } from '../components/OutcomeAlert';
import { PageFrame } from '../components/PageFrame';
import { ProofSection } from '../components/ProofSection';
import { StateView } from '../components/StateView';
import { WalletDialog } from '../components/WalletDialog';
import { useReadiness } from '../hooks/useLoad';
import { useSignedInPerson } from '../hooks/useOnboarding';
import { useStartApplication } from '../hooks/useStartApplication';
import { ONBOARDING_NS } from '../i18n';
import { EBW_STEPS } from './flowSteps';

/** Start application (mockup view 1, decided: progress=side · choice=tiles, the goal cards stay visible). */
export default function StartPage() {
  const { t } = useTranslation(ONBOARDING_NS);
  const navigate = useNavigate();
  const readiness = useReadiness();
  const person = useSignedInPerson();
  const { state, withWallet, reset } = useStartApplication();
  const [goal, setGoal] = useState<Goal>(null);
  const [kind, setKind] = useState<ApplicationKind | null>(null);
  const [bpn, setBpn] = useState('');
  const [fromOsp, setFromOsp] = useState('');
  const [path, setPath] = useState<Verification>('EBW');
  const [walletOpen, setWalletOpen] = useState(false);
  const proofRef = useRef<HTMLDivElement>(null);
  const answered = goal === 'new' || (goal === 'existing' && kind !== null);
  // The wallet dialog shows while the step runs; a result closes it (the page shows the result).

  useEffect(() => {
    if (state.status === 'created' || state.status === 'repeated') {
      navigate(`/onboarding/application/${state.application.id}/company-data`);
    }
  }, [state, navigate]);
  useEffect(() => {
    if (answered) {
      proofRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
    }
  }, [answered, goal, kind]);

  if (readiness.status !== 'ready') {
    return (
      <PageFrame titleKey="start.title">
        <StateView state={readiness} returnTo="/onboarding/start" />
      </PageFrame>
    );
  }
  const choice = { kind: kind ?? 'ONBOARDING', bpn };
  const onContinue = () => {
    reset();
    if (path === 'DOCUMENTS') {
      navigate('/onboarding/new', { state: choice });
    } else {
      setWalletOpen(true);
    }
  };

  return (
    <PageFrame titleKey="start.title" steps={{ keys: EBW_STEPS, current: answered ? 1 : 0 }}>
      <Typography color="text.secondary">
        <Trans t={t} i18nKey="start.signedInAs" values={{ name: person?.name ?? '' }} components={{ strong: <strong /> }} />
      </Typography>
      <GoalSection
        goal={goal}
        kind={kind}
        bpn={bpn}
        fromOsp={fromOsp}
        onGoal={(next) => {
          setWalletOpen(false);
          setGoal(next);
          setKind(next === 'new' ? 'ONBOARDING' : null);
          reset();
        }}
        onKind={setKind}
        onBpn={setBpn}
        onFromOsp={setFromOsp}
      />
      {state.status === 'cancelled' && <Alert severity="info">{t('wallet.cancelled')}</Alert>}
      {state.status !== 'idle' && state.status !== 'working' && state.status !== 'cancelled' && state.status !== 'created' && state.status !== 'repeated' && (
        <OutcomeAlert
          outcome={state}
          action={
            state.status === 'open-application-exists' && state.existingApplicationId ? (
              <Button variant="text" color="inherit" onClick={() => navigate(`/onboarding/application/${state.existingApplicationId}`)}>
                {t('start.continueApplication')}
              </Button>
            ) : undefined
          }
        />
      )}
      {answered && (
        <div ref={proofRef}>
          <ProofSection path={path} onPath={setPath} onContinue={onContinue} busy={state.status === 'working'} />
        </div>
      )}
      <WalletDialog open={walletOpen && (state.status === 'idle' || state.status === 'working')} waiting={state.status === 'working'} onOpenWallet={() => withWallet(choice)} onClose={() => setWalletOpen(false)} />
    </PageFrame>
  );
}
