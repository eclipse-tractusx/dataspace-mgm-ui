/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are made available under CC0-1.0. The human contributor has reviewed it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

import { CoreHttpErrorFactory } from "@dataspace-mgm/core-http";
import type { OperationResult } from "../../domain/data/operation-result.data";

export async function result<T>(
  operation: () => Promise<T | null>,
): Promise<OperationResult<T>> {
  try {
    const data = await operation();
    return data === null
      ? { status: "not-found" }
      : { status: "success", data };
  } catch (cause) {
    const error = CoreHttpErrorFactory.from(cause);
    if (error.status === 403) {
      return { status: "forbidden" };
    }
    if (error.status === 404) {
      return { status: "not-found" };
    }
    if (error.status === 409) {
      return { status: "conflict", error };
    }
    return { status: "failed", error };
  }
}
