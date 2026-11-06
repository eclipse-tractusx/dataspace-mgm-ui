/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { lazyFeatureTranslations } from "../../../i18n/lazyFeatureTranslations";

export const PEOPLE_NS = "accessControlPeople";
export const peopleLanguageLoaders = {
  en: () => import("./locales/en/people.json").then((module) => module.default),
  de: () => import("./locales/de/people.json").then((module) => module.default),
};
export const peopleTranslations = lazyFeatureTranslations(
  PEOPLE_NS,
  peopleLanguageLoaders,
);
