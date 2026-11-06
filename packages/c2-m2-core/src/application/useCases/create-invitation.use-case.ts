/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import type { InvitationInput } from '../../domain/data/invitation.data';
import type { InvitationRepository } from '../../domain/repositories/invitation.repository';
import { result } from './result';
export class CreateInvitationUseCase {
  constructor(private readonly repository: InvitationRepository) {}
  execute(companyId: string, input: InvitationInput) { return result(() => this.repository.create(companyId, input)); }
}
