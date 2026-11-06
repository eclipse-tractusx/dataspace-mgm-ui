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

import { useCallback, useState, type ReactNode } from 'react';
import { Alert, Snackbar } from '@dataspace-mgm/ui-mui';

/** A short confirmation after a successful write ("Change request withdrawn"), read by screen readers. */
export function useNotice(): { notice: ReactNode; show: (text: string) => void } {
  const [text, setText] = useState<string | null>(null);
  const show = useCallback((value: string) => setText(value), []);
  const notice = (
    <Snackbar open={text !== null} autoHideDuration={5000} onClose={() => setText(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity="success" variant="filled" onClose={() => setText(null)} role="status">
        {text}
      </Alert>
    </Snackbar>
  );
  return { notice, show };
}
