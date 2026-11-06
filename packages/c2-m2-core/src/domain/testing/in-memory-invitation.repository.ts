/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { CoreHttpException } from '@dataspace-mgm/core-http';
import type { AcceptInvitationResult, Invitation, InvitationInput, InvitationStatus } from '../data/invitation.data';
import type { InvitationRepository } from '../repositories/invitation.repository';

const INVITATION_CODE_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export class InMemoryInvitationRepository implements InvitationRepository {
  private invitations: Array<{ invitation: Invitation; code: string }> = [];
  constructor(
    private readonly companyIds: readonly string[],
    private readonly companyPortalRoles: readonly string[] = ['Company Admin', 'IT Admin', 'Member'],
    private readonly callerUserId = '5a1c0002-0000-4000-8000-000000000002',
  ) {}
  async list(companyId: string, options?: { status?: readonly InvitationStatus[] }) {
    if (!this.companyIds.includes(companyId)) {
      return null;
    }
    const allowedStatuses = options?.status ?? ['OPEN'];
    return structuredClone(
      this.invitations
        .map((entry) => entry.invitation)
        .filter(
          (item) =>
            item.companyId === companyId &&
            allowedStatuses.includes(item.status) &&
            (item.status !== 'OPEN' || Date.parse(item.expiresAt) > Date.now()),
        )
        .reverse(),
    );
  }
  async create(companyId: string, input: InvitationInput) {
    if (!this.companyIds.includes(companyId)) {
      return null;
    }
    const hasControl = [...input.givenName, ...input.familyName].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
    if (!input.givenName.trim() || !input.familyName.trim() || input.givenName.length > 255 || input.familyName.length > 255 || hasControl || !input.portalRoles.length || new Set(input.portalRoles).size !== input.portalRoles.length || input.portalRoles.some((role) => !this.companyPortalRoles.includes(role))) {
      throw new CoreHttpException(400, 'urn:c2-m2:problem:validation', 'Invalid invitation');
    }
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const code = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const now = Date.now();
    const invitation: Invitation = {
      id: crypto.randomUUID(),
      kind: 'COMPANY',
      companyId,
      givenName: input.givenName,
      familyName: input.familyName,
      roles: [...input.portalRoles],
      status: 'OPEN',
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 7 * 86400000).toISOString(),
    };
    this.invitations.push({ invitation, code });
    return { ...structuredClone(invitation), code };
  }
  async revoke(companyId: string, invitationId: string) {
    const index = this.invitations.findIndex((entry) => entry.invitation.companyId === companyId && entry.invitation.id === invitationId);
    if (index < 0) {
      return null;
    }
    const item = this.invitations[index].invitation;
    if (item.status === 'OPEN' && Date.parse(item.expiresAt) <= Date.now()) {
      throw new CoreHttpException(409, 'urn:c2-m2:problem:invitation-ended', 'Invitation expired');
    }
    this.invitations[index] = {
      ...this.invitations[index],
      invitation: { ...item, status: 'REVOKED', endReason: 'REVOKED', givenName: null, familyName: null },
    };
    return true;
  }
  async accept(code: string): Promise<AcceptInvitationResult | null> {
    if (!INVITATION_CODE_PATTERN.test(code)) {
      throw new CoreHttpException(400, 'urn:c2-m2:problem:validation', 'Invalid invitation code');
    }
    const index = this.invitations.findIndex((entry) => entry.code === code);
    if (index < 0) {
      return null;
    }
    const current = this.invitations[index].invitation;
    if (current.status === 'ACCEPTED' && current.acceptedBy === this.callerUserId) {
      return {
        invitationId: current.id,
        kind: current.kind,
        userId: this.callerUserId,
        companyId: current.companyId,
        roles: [...current.roles],
      };
    }
    if (current.status !== 'OPEN' || Date.parse(current.expiresAt) <= Date.now()) {
      throw new CoreHttpException(409, 'urn:c2-m2:problem:invitation-ended', 'Invitation ended');
    }
    const nowIso = new Date().toISOString();
    this.invitations[index] = {
      ...this.invitations[index],
      invitation: {
        ...current,
        status: 'ACCEPTED',
        givenName: null,
        familyName: null,
        acceptedBy: this.callerUserId,
        acceptedAt: nowIso,
      },
    };
    return {
      invitationId: current.id,
      kind: current.kind,
      userId: this.callerUserId,
      companyId: current.companyId,
      roles: [...current.roles],
    };
  }
}
