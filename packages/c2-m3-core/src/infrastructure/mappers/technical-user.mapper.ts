/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
import type { components } from '../../generated/c2-m3-api';
import type { TechnicalUser, TechnicalUserSummary, TechnicalUserCreate, TechnicalUserUpdate } from '../../domain/data/technical-user.data';

type Schemas = components['schemas'];
export const TechnicalUserMapper = {
  summary(dto: Schemas['TechnicalUserSummary']): TechnicalUserSummary { return { ...dto }; },
  user(dto: Schemas['TechnicalUser']): TechnicalUser { return { ...dto, roles: dto.roles.map((role) => ({ name: role.name })) }; },
  create(input: TechnicalUserCreate): Schemas['TechnicalUserCreate'] { return { ...input, roles: input.roles.map((role) => ({ name: role.name })) }; },
  update(input: TechnicalUserUpdate): Schemas['TechnicalUserUpdate'] { return { name: input.name, description: input.description, roles: input.roles?.map((role) => ({ name: role.name })) }; },
};
