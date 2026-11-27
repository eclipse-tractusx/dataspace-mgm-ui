/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * AI Disclosure: This file was entirely AI-generated.
 * The AI-generated portions are made available under CC0-1.0 and not subject
 * to the project's license. The human contributor has reviewed and verified
 * that the code is correct.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Claude Code (claude-fable-5-2)
 ********************************************************************************/

import { CoreHttpException } from '@dataspace-mgm/core-http';

/**
 * The backend answered 403 `representation-not-confirmed` (C2-M2 6.8a, section 12). `CoreHttpException` keeps only
 * `status`, `type` and `title`; this one also keeps the field `reasons`, in which the backend repeats why the
 * EBW-Connector did not confirm the mandate (C5-M1 6.5), so that the page can say it.
 */
export class MandateNotConfirmedException extends CoreHttpException {
  constructor(
    status: number,
    problemType: string,
    message: string,
    public readonly reasons: readonly string[],
  ) {
    super(status, problemType, message);
    this.name = 'MandateNotConfirmedException';
  }
}
