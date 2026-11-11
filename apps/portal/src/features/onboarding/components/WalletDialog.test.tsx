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

import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { onboardingTranslations } from '../i18n';
import { WalletDialog } from './WalletDialog';

beforeAll(() => onboardingTranslations.load());
afterEach(() => vi.useRealTimers());

const props = { open: true, onOpenWallet: () => undefined, onClose: () => undefined };

describe('Onboarding: wallet dialog', () => {
  it('shows the wallet request as a QR code', () => {
    render(<WalletDialog {...props} waiting={false} walletRequest="openid4vp://?request_uri=x" />);
    expect(screen.getByRole('img', { name: 'QR code of the wallet request of the EBW-Connector' })).toBeInTheDocument();
  });

  it('shows no QR code without a wallet request', () => {
    render(<WalletDialog {...props} waiting={false} />);
    expect(screen.queryByRole('img', { name: /QR code/ })).not.toBeInTheDocument();
  });

  it('shows the approvals in the wallet one by one, then approved (mock mode)', () => {
    vi.useFakeTimers();
    render(<WalletDialog {...props} waiting approvalStepMs={900} />);
    expect(screen.getByText('Confirm the request in your wallet…')).toBeInTheDocument();
    expect(screen.queryByText(/^Approved/)).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(900 * 3));
    expect(screen.getByText('Approved. Your company data is filled in from the wallet…')).toBeInTheDocument();
  });

  it('only shows "waiting" without the approval steps (real wallet)', () => {
    render(<WalletDialog {...props} waiting />);
    expect(screen.getByText('Waiting for your wallet…')).toBeInTheDocument();
    expect(screen.queryByText('Personal ID (PID) shared')).not.toBeInTheDocument();
  });
});
