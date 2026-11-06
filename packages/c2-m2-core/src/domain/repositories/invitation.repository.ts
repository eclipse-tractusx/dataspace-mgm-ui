/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import type { AcceptInvitationResult, Invitation, InvitationInput, InvitationStatus, InvitationWithCode } from '../data/invitation.data';
export interface InvitationRepository {
  list(companyId: string, options?: { status?: readonly InvitationStatus[]; page?: number; size?: number }): Promise<readonly Invitation[] | null>;
  create(companyId: string, input: InvitationInput): Promise<InvitationWithCode | null>;
  revoke(companyId: string, invitationId: string): Promise<boolean | null>;
  accept?(code: string): Promise<AcceptInvitationResult | null>;
}
