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

import { useState } from 'react';
import type { C4M2Module, WalletAccountItem } from '@dataspace-mgm/c4-m2-core';
import { Box } from '@dataspace-mgm/ui-mui';
import { useRetrieveAccessData } from '../hooks/useRetrieveAccessData';
import { AccessDataPanel } from './AccessDataPanel';
import { AccountDetail } from './AccountDetail';
import { AccountList } from './AccountList';
import { RetrievalProblemAlert } from './RetrievalProblemAlert';
import { RetrieveDialog } from './RetrieveDialog';

interface WalletAccountsViewProps {
  items: ReadonlyArray<WalletAccountItem>;
  mayRetrieve: boolean;
  c4m2: C4M2Module;
  reload: () => void;
}

/**
 * List and detail of the wallet accounts: the technical users on the left, the selected one on the right with the
 * retrieval (ask first, then the access data inline below the detail).
 */
export function WalletAccountsView({ items, mayRetrieve, c4m2, reload }: WalletAccountsViewProps) {
  const [selectedId, setSelectedId] = useState(items[0]?.technicalUser.id ?? '');
  const retrieval = useRetrieveAccessData(c4m2, reload);
  const item = items.find((entry) => entry.technicalUser.id === selectedId) ?? items[0];
  if (!item) {
    return null;
  }
  const { state } = retrieval;
  const forItem = state.phase !== 'idle' && state.technicalUserId === item.technicalUser.id ? state : null;
  // The button reads the state of the access data from the API; the permission only hides it.
  const canAsk = mayRetrieve && item.account?.credentialsState === 'AVAILABLE';
  const pending = state.phase === 'confirm' ? items.find((entry) => entry.technicalUser.id === state.technicalUserId) : undefined;

  const select = (technicalUserId: string) => {
    setSelectedId(technicalUserId);
    if (state.phase !== 'idle') {
      retrieval.done();
    }
  };

  return (
    <Box sx={{ display: 'grid', gap: 3, alignItems: 'start', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '340px minmax(0, 1fr)' } }}>
      <AccountList items={items} selectedId={item.technicalUser.id} onSelect={select} />
      <AccountDetail
        item={item}
        retrieving={forItem?.phase === 'retrieving'}
        onRetrieve={canAsk && forItem?.phase !== 'revealed' ? () => retrieval.ask(item.technicalUser.id) : undefined}
      >
        {forItem?.phase === 'revealed' && <AccessDataPanel credentials={forItem.credentials} onDone={retrieval.done} />}
        {forItem?.phase === 'problem' && <RetrievalProblemAlert problem={forItem.problem} name={item.technicalUser.name} />}
      </AccountDetail>
      <RetrieveDialog name={pending?.technicalUser.name ?? null} onCancel={retrieval.cancel} onConfirm={retrieval.confirm} />
    </Box>
  );
}
