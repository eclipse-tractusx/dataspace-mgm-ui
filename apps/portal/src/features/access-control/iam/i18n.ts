/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * AI Disclosure: This file was entirely AI-generated.
 * The AI-generated portions are made available under CC0-1.0 and not subject
 * to the project's license. The human contributor has reviewed and verified
 * that the code is correct.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/
import { lazyFeatureTranslations } from "../../../i18n/lazyFeatureTranslations";

export const IAM_NAMESPACE = "iam-configuration";
export const iamLanguageLoaders = {
  en: () => import("./locales/en").then((module) => module.default),
  de: () => import("./locales/de").then((module) => module.default),
} as const;
export const iamTranslations = lazyFeatureTranslations(
  IAM_NAMESPACE,
  iamLanguageLoaders,
);
