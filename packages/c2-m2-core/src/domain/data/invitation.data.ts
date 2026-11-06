/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
export type InvitationKind = 'COMPANY' | 'STAFF';
export type InvitationStatus = 'OPEN' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
export type InvitationEndReason = 'REVOKED' | 'COMPANY_DISABLED' | 'TOO_MANY_ATTEMPTS';
export type InvitationInput = { givenName: string; familyName: string; portalRoles: readonly string[] };
export type Invitation = {
  id: string;
  kind: InvitationKind;
  companyId: string | null;
  givenName: string | null;
  familyName: string | null;
  roles: readonly string[];
  status: InvitationStatus;
  endReason?: InvitationEndReason | null;
  createdAt: string;
  expiresAt: string;
  createdBy?: string | null;
  acceptedBy?: string | null;
  acceptedAt?: string | null;
};
export type InvitationWithCode = Invitation & { code: string };
export type AcceptInvitationResult = {
  invitationId: string;
  kind: InvitationKind;
  userId: string;
  companyId: string | null;
  roles: readonly string[];
};
