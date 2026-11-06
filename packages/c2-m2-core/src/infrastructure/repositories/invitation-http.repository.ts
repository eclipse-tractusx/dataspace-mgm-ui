/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { ensureData, ensureOk } from '@dataspace-mgm/core-http';
import type { Client } from 'openapi-fetch';
import type { components, paths } from '../../generated/c2-m2-api';
import type { AcceptInvitationResult, Invitation, InvitationInput, InvitationStatus } from '../../domain/data/invitation.data';
import type { InvitationRepository } from '../../domain/repositories/invitation.repository';

function mapInvitation(dto: components['schemas']['Invitation']): Invitation {
  return {
    ...dto,
    kind: dto.kind,
    companyId: dto.companyId ?? null,
    givenName: dto.givenName ?? null,
    familyName: dto.familyName ?? null,
    endReason: dto.endReason ?? null,
    createdBy: dto.createdBy ?? null,
    acceptedBy: dto.acceptedBy ?? null,
    acceptedAt: dto.acceptedAt ?? null,
    status: dto.status,
  };
}

export class InvitationHttpRepository implements InvitationRepository {
  constructor(private readonly client: Client<paths>) {}

  async list(companyId: string, options?: { status?: readonly InvitationStatus[]; page?: number; size?: number }) {
    if (options?.page !== undefined || options?.size !== undefined) {
      const response = await ensureData(
        this.client.GET('/companies/{companyId}/invitations', {
          params: {
            path: { companyId },
            query: {
              page: options.page ?? 0,
              size: options.size ?? 100,
              ...(options.status ? { status: [...options.status] } : {}),
            },
          },
        }),
      );
      return response.items.map(mapInvitation);
    }
    const items: Invitation[] = [];
    let page = 0;
    for (;;) {
      const response = await ensureData(
        this.client.GET('/companies/{companyId}/invitations', {
          params: {
            path: { companyId },
            query: {
              page,
              size: 100,
              ...(options?.status ? { status: [...options.status] } : {}),
            },
          },
        }),
      );
      items.push(...response.items.map(mapInvitation));
      if (items.length >= response.total) {
        return items;
      }
      if (response.items.length === 0) {
        throw new Error('Incomplete invitation pagination');
      }
      page += 1;
    }
  }

  async create(companyId: string, input: InvitationInput) {
    const dto = await ensureData(this.client.POST('/companies/{companyId}/invitations', { params: { path: { companyId } }, body: { ...input, portalRoles: [...input.portalRoles] } }));
    return { ...mapInvitation(dto), code: dto.code };
  }

  async revoke(companyId: string, invitationId: string) {
    await ensureOk(this.client.DELETE('/companies/{companyId}/invitations/{invitationId}', { params: { path: { companyId, invitationId } } }));
    return true;
  }

  async accept(code: string): Promise<AcceptInvitationResult> {
    const dto = await ensureData(this.client.POST('/invitations/accept', { body: { code } }));
    return {
      invitationId: dto.invitationId,
      kind: dto.kind,
      userId: dto.userId,
      companyId: dto.companyId ?? null,
      roles: dto.roles,
    };
  }
}
