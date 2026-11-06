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

import { Navigate } from 'react-router-dom';
import { PageFrame } from '../components/PageFrame';
import { StateView } from '../components/StateView';
import { useOwnApplications } from '../hooks/useApplications';
import { useSignedInPerson } from '../hooks/useOnboarding';
import ApplicationsPage from './ApplicationsPage';

/** The entry of the feature: the person's own (newest) application, else Start application. */
function ApplicantEntry() {
  const { state } = useOwnApplications();
  if (state.status !== 'found') {
    return (
      <PageFrame titleKey="application.title">
        <StateView state={state} returnTo="/onboarding" />
      </PageFrame>
    );
  }
  const newest = state.page.items[0];
  return <Navigate replace to={newest ? `/onboarding/application/${newest.id}` : '/onboarding/start'} />;
}

/**
 * /onboarding. OSP staff (permission key view_applications from GET /me; only hides UI, the API decides) see all
 * applications; everybody else is an applicant.
 */
export default function OnboardingPage() {
  const person = useSignedInPerson();
  return person?.permissions.includes('view_applications') ? <ApplicationsPage /> : <ApplicantEntry />;
}
