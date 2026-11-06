/********************************************************************************
 * Copyright (c) 2026 Catena-X Automotive Network e.V.
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
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

/**
 * The dataspace a credential belongs to, for the logo slot of a credential pass. NOT in the C4-M1 spec (0.2): the POC
 * carries it per credential so passes of several dataspaces can live together (open point in the README).
 */
export type DataspaceRefAnemic = Readonly<{
  /** e.g. `catena-x` (`dataspace.memberOf` of the installation). */
  id: string;
  /** e.g. `Catena-X` (`dataspace.name` of the installation). */
  name: string;
  /** Short mark shown when there is no logo, e.g. `CX`. */
  mark: string;
  /** Address of the logo image; null shows the mark. */
  logoUrl: string | null;
}>;
