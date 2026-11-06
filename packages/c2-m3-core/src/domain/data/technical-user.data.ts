/* Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The human contributor has reviewed and verified it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra */
export type Status = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'PENDING_DELETION' | 'DELETED';
export type Origin = 'OWN' | 'SUBSCRIPTION';
export type WalletAccess = 'NONE' | 'REQUESTED' | 'ACTIVE' | 'FAILED' | 'REMOVING';
export type RoleRef = Readonly<{ name: string }>;
export type AssignableRole = Readonly<{ name: string; description?: string | null; grantsWalletAccess: boolean; providerOnly: boolean }>;
export type TechnicalUserSummary = Readonly<{
  id: string; companyId: string; name: string; description?: string | null; origin: Origin;
  viewerRole: 'OWNER' | 'CO_VIEWER' | 'OSP'; status: Status; iamClientId: string;
  walletAccess: WalletAccess; disabled: boolean; createdAt?: string; changedAt?: string;
  offerSubscriptionId?: string | null; subscriptionParty?: 'CUSTOMER' | 'PROVIDER' | null; coViewerCompanyId?: string | null;
}>;
export type TechnicalUser = TechnicalUserSummary & Readonly<{ authMethod: 'SECRET'; roles: readonly RoleRef[]; walletAccountRef?: string | null }>;
export type TechnicalUserPage = Readonly<{ items: readonly TechnicalUserSummary[]; page: number; size: number; total: number }>;
export type TechnicalUserFilters = Readonly<{ status?: readonly Status[]; origin?: Origin; walletAccess?: WalletAccess; page?: number; size?: number }>;
export type TechnicalUserCreate = Readonly<{ name: string; description?: string; authMethod?: 'SECRET'; roles: readonly RoleRef[] }>;
export type TechnicalUserUpdate = Readonly<{ name?: string; description?: string; roles?: readonly RoleRef[] }>;
export type Credentials = Readonly<{ iamClientId: string; secret: string; tokenUrl: string }>;
export type CreatedTechnicalUser = Readonly<{ user: TechnicalUser; credentials: Credentials | null }>;
