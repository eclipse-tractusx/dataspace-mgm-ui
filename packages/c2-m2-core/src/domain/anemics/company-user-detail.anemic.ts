/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are made available under CC0-1.0. The human contributor has reviewed it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

import type { CompanyUserAnemic } from "./company-user.anemic";

export type CompanyUserDetailAnemic = CompanyUserAnemic &
  Readonly<{
    appRoles: ReadonlyArray<
      Readonly<{
        appId: string;
        appInstanceClientId: string;
        iamClientId: string;
        instanceClientStatus: "PENDING" | "ACTIVE" | "DISABLED";
        roles: readonly string[];
      }>
    >;
  }>;
