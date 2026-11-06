/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
export type PeopleStatus =
  | "loaded"
  | "empty"
  | "loading"
  | "forbidden"
  | "not-found"
  | "error"
  | "conflict"
  | "signed-out"
  | "not-connected";
export type UserFilter = "" | "ACTIVE" | "DISABLED" | "REMOVED";
export type CompanyUser = Readonly<{
  userId: string;
  givenName: string;
  familyName: string;
  status: string;
  portalRoles: readonly string[];
  joinedVia?: string;
}>;
export type TechnicalUser = Readonly<{
  iamClientId: string;
  name: string;
  status: string;
  walletAccess: string;
  viewerRole: string;
  origin?: string;
  disabled?: boolean;
  description?: string;
  roles?: readonly string[];
}>;
export type TechnicalFilters = Readonly<{
  status: string;
  origin: string;
  walletAccess: string;
}>;
