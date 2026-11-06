/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import type { InvitationRepository } from '../../domain/repositories/invitation.repository';
import { result } from './result';
export class RevokeInvitationUseCase {
  constructor(private readonly repository: InvitationRepository) {}
  execute(companyId: string, invitationId: string) { return result(() => this.repository.revoke(companyId, invitationId)); }
}
