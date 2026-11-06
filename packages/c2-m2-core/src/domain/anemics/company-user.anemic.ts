/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are made available under CC0-1.0. The human contributor has reviewed it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

export type CompanyUserAnemic = Readonly<{
  userId: string;
  companyId: string;
  givenName?: string | null;
  familyName?: string | null;
  status: "ACTIVE" | "DISABLED" | "REMOVED";
  joinedVia: "ONBOARDING" | "INVITATION";
  portalRoles: readonly string[];
  createdAt: string;
}>;
