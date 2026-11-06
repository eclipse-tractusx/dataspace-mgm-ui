/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
export type InstanceClientRef = { appInstanceClientId: string; iamClientId: string };
export type CompanyAppRoles = { companyId: string; appId: string; templateExists: boolean; assignable: boolean; roles: readonly { name: string; description: string | null; descriptions: readonly { lang: string; text: string }[] }[]; instanceClients: readonly InstanceClientRef[] };
export type AppRolesResult = { userId: string; appId: string; roles: readonly string[]; addedRoles: readonly string[]; removedRoles: readonly string[]; instanceClients: readonly InstanceClientRef[] };
