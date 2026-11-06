/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0: https://www.apache.org/licenses/LICENSE-2.0.
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are available under CC0-1.0; the human contributor reviewed the content.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { IamConfiguration, iamTranslations } from './index';
import en from './locales/en';
import de from './locales/de';

beforeAll(() => iamTranslations.load());

describe('IAM configuration view', () => {
  it('shows discovery endpoints, realm cards, and login mode toggles', () => {
    render(<IamConfiguration />);
    expect(screen.getByText('Read-only realm specification')).toBeInTheDocument();
    expect(screen.getByText('authorization_endpoint')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sessions' })).toBeInTheDocument();
    expect(screen.getByText('Realm deployment model')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Use standard backend login (/auth/login)' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Use spec-compliant /me session response' })).toBeInTheDocument();
  });

  it('shows a loading state when loading is true', () => {
    render(<IamConfiguration loading />);
    expect(screen.getByRole('status', { name: 'Loading discovery metadata…' })).toBeInTheDocument();
    expect(screen.queryByText('authorization_endpoint')).not.toBeInTheDocument();
  });

  it('provides the same keys in both languages', () => {
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort());
  });
});
