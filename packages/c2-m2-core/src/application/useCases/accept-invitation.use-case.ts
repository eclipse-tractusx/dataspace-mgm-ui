/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are made available under CC0-1.0. The human contributor has reviewed it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import type { InvitationRepository } from '../../domain/repositories/invitation.repository';
import { result } from './result';

export class AcceptInvitationUseCase {
  constructor(private readonly repository: InvitationRepository) {}

  execute(code: string) {
    return result(async () => (this.repository.accept ? this.repository.accept(code) : null));
  }
}
