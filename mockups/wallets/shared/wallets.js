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
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

// Texts and small renderers shared by the views of Wallets as a service. Load after shell.js. In the proof of concept
// each label becomes an i18n key. Nothing here decides anything: it only formats what the API returns.
(function () {
  'use strict';

  const mock = window.mock;

  const labels = {
    credentialType: { BPN: 'BPN credential', MEMBERSHIP: 'Membership credential' },
    credentialTypeShort: { BPN: 'BPN', MEMBERSHIP: 'Membership' },
    credentialTypeTech: { BPN: 'BpnCredential', MEMBERSHIP: 'MembershipCredential' },
    credentialDescription: {
      BPN: 'Proves the business partner number of your company to the connectors of your partners.',
      MEMBERSHIP: 'Proves that your company is a member of the dataspace. Connectors share data only with members.',
    },
    credentialStatus: {
      NONE: 'Not requested yet', REQUESTED: 'Being issued', ISSUED: 'Issued', FAILED: 'Failed', CANCELLED: 'Cancelled',
      REVOCATION_PENDING: 'Revocation pending', REVOKED: 'Revoked',
    },
    route: { CREDENTIAL_ISSUER: 'Credential Issuer', ISSUER_SERVICE: 'IssuerService', CSP_ISSUER: 'CSP issuer', STUB: 'Stand-in' },
    provider: {
      CSP: 'Dataspace wallet of the CSP', SAP_DIV: 'SAP DIV', IDENTITY_HUB: 'IdentityHub of your onboarding service provider',
      BRING_YOUR_OWN: 'Own wallet', STUB: 'Stand-in',
    },
    providerShort: { CSP: 'CSP wallet', SAP_DIV: 'SAP DIV', IDENTITY_HUB: 'IdentityHub', BRING_YOUR_OWN: 'Own wallet', STUB: 'Stand-in' },
    walletStatus: { REQUESTED: 'Being created', VALIDATING: 'Checking the DID', ACTIVE: 'Active', FAILED: 'Failed' },
    walletFailure: {
      PROVIDER_TIMEOUT: 'The provider did not answer in time.',
      DID_MISMATCH: 'The provider returned a DID that does not belong to your company.',
      INVALID_DID_DOCUMENT: 'The DID document of the wallet is not valid.',
      DID_NOT_RESOLVABLE: 'The DID document of the wallet could not be found.',
    },
    accountStatus: { REQUESTED: 'Being created', ACTIVE: 'Active', FAILED: 'Failed', DELETING: 'Being deleted', DELETED: 'Deleted' },
    credentialsState: { NONE: 'No access data', AVAILABLE: 'Ready to retrieve', RETRIEVED: 'Retrieved', EXPIRED: 'Expired' },
    revocationReason: { COMPANY_DEACTIVATED: 'Company deactivated', OTHER: 'Other reason' },
    companyStatus: { ACTIVE: 'Active', REQUESTED: 'Requested', REJECTED: 'Rejected', INACTIVE: 'Inactive' },
  };

  const tone = {
    credentialStatus: {
      NONE: 'default', REQUESTED: 'warning', ISSUED: 'success', FAILED: 'error', CANCELLED: 'default', REVOCATION_PENDING: 'warning', REVOKED: 'default',
    },
    walletStatus: { REQUESTED: 'warning', VALIDATING: 'info', ACTIVE: 'success', FAILED: 'error' },
    accountStatus: { REQUESTED: 'warning', ACTIVE: 'success', FAILED: 'error', DELETING: 'warning', DELETED: 'default' },
    credentialsState: { NONE: 'default', AVAILABLE: 'info', RETRIEVED: 'success', EXPIRED: 'default' },
    companyStatus: { ACTIVE: 'success', REQUESTED: 'warning', REJECTED: 'error', INACTIVE: 'default' },
  };

  const icons = {
    credentialType: { BPN: 'BadgeOutlined', MEMBERSHIP: 'VerifiedUserOutlined' },
    credentialStatus: {
      NONE: 'HorizontalRuleOutlined', REQUESTED: 'HourglassTopOutlined', ISSUED: 'CheckCircleOutlined', FAILED: 'ErrorOutlineOutlined',
      CANCELLED: 'BlockOutlined', REVOCATION_PENDING: 'PendingActionsOutlined', REVOKED: 'BlockOutlined',
    },
  };

  // Icons whose name is chosen at run time (status, type, step). Named here as icon('…') so that `mockup.py sync`
  // copies them into icons.js: icon('BadgeOutlined') icon('BlockOutlined') icon('CheckCircleOutlined')
  // icon('CheckOutlined') icon('HorizontalRuleOutlined') icon('SendOutlined') icon('VisibilityOffOutlined')
  // icon('HourglassTopOutlined') icon('ErrorOutlineOutlined') icon('PendingActionsOutlined') icon('VerifiedUserOutlined')
  // icon('CloseOutlined') icon('KeyOutlined') icon('InfoOutlined')

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const wx = {
    labels,
    tone,
    icons,
    esc,

    /** A status chip: wx.chip('credentialStatus', 'ISSUED'). */
    chip(kind, value) {
      return `<span class="tx-chip tx-status tx-status--${tone[kind][value] || 'default'}">${esc(labels[kind][value] || value)}</span>`;
    },
    /** The tone of a status, for the edge of a card or a banner. */
    toneOf(kind, value) { return tone[kind][value] || 'default'; },
    /** A plain chip (a type, a route). */
    tag(text) { return `<span class="tx-chip tx-chip--outlined">${esc(text)}</span>`; },

    /** A value in monospace with a copy button; `short` cuts it in the middle (the full value is in the title and the copy). */
    copyable(value, opts) {
      if (!value) { return `<span class="wx-none">${esc((opts && opts.empty) || 'Not known yet')}</span>`; }
      const shown = opts && opts.short ? wx.middle(value, opts.short) : value;
      return `<span class="wx-value"><span class="wx-mono" title="${esc(value)}">${esc(shown)}</span><button class="wx-copy" type="button" data-copy="${esc(value)}" title="Copy" aria-label="Copy">${mock.icon('ContentCopyOutlined', 'sm')}</button></span>`;
    },
    /** A value in a box with a copy button, for configuration values. */
    valueBlock(value, opts) {
      if (!value) { return `<div class="wx-value-block"><span class="wx-none">${esc((opts && opts.empty) || 'Not known yet')}</span></div>`; }
      return `<div class="wx-value-block"><span class="wx-mono" title="${esc(value)}">${esc(value)}</span><button class="wx-copy" type="button" data-copy="${esc(value)}" title="Copy" aria-label="Copy">${mock.icon('ContentCopyOutlined', 'sm')}</button></div>`;
    },
    /** did:web:csp-wallet.example.org:BPNLIUK2REMLK3F4 → did:web:csp-wa…REMLK3F4 */
    middle(value, keep) {
      const n = keep || 14;
      return value.length <= n * 2 + 1 ? value : `${value.slice(0, n)}…${value.slice(-n)}`;
    },

    /** The name of a company from C3-M1, or its BPN when C3-M1 has no name in the test data. */
    company(companyId) { return mock.data.companies[companyId]; },

    dateTime(iso) {
      if (!iso) { return '–'; }
      return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    },
    date(iso) { return iso ? mock.date(iso) : '–'; },
    /** "2 days ago", from today 2026-11-06 12:00 UTC (the mockup's now). */
    ago(iso) {
      if (!iso) { return '–'; }
      const minutes = Math.round((Date.parse('2026-11-06T12:00:00Z') - Date.parse(iso)) / 60000);
      if (minutes < 60) { return `${minutes} min ago`; }
      const hours = Math.round(minutes / 60);
      if (hours < 48) { return `${hours} h ago`; }
      return `${Math.round(hours / 24)} days ago`;
    },
    shortId(id) { return id ? `${id.slice(0, 8)}…` : '–'; },

    /** A drawn QR code of a value (a mockup; the portal would draw the real code with a library in ui-mui). */
    qr(value, label) {
      const n = 25;
      let h = 0;
      for (const c of String(value)) { h = (h * 31 + c.charCodeAt(0)) >>> 0; }
      const corners = [[0, 0], [n - 7, 0], [0, n - 7]];
      const cells = [];
      for (let y = 0; y < n; y += 1) {
        for (let x = 0; x < n; x += 1) {
          const corner = corners.find(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);
          let on;
          if (corner) {
            const lx = x - corner[0];
            const ly = y - corner[1];
            on = lx >= 0 && ly >= 0 && lx <= 6 && ly <= 6 && (lx === 0 || ly === 0 || lx === 6 || ly === 6 || (lx > 1 && lx < 5 && ly > 1 && ly < 5));
          } else {
            h = (h * 1103515245 + 12345) >>> 0;
            on = (h >>> 16) % 2 === 0;
          }
          cells.push(`<i class="${on ? 'on' : ''}"></i>`);
        }
      }
      return `<div class="wx-qr" role="img" aria-label="${esc(label || 'QR code')}">${cells.join('')}</div>`;
    },
    /** The logo slot of a dataspace on a pass: its logo when one is known, else its mark (initials). */
    brand(dataspace) {
      return `<span class="wx-pass__brand" title="${esc(dataspace.name)}" aria-label="${esc(dataspace.name)}">${dataspace.logo ? `<img src="${esc(dataspace.logo)}" alt="">` : esc(dataspace.mark)}</span>`;
    },
    /** A status pill on a pass: wx.pill('credentialStatus', 'ISSUED'). */
    pill(kind, value) {
      return `<span class="wx-pill wx-pill--${tone[kind][value] || 'default'}">${esc(labels[kind][value] || value)}</span>`;
    },

    /** The person the screen is seen as: a note of the mockup. */
    persona(key, extra) {
      const p = mock.data.persons[key];
      return `${mock.icon('VisibilityOutlined', 'sm')}<span>Seen as <strong>${esc(p.name)}</strong> · ${esc(p.portalRoles.join(', '))}${extra ? ` · ${esc(extra)}` : ''}</span>`;
    },

    /** The sub-navigation of the feature: the views a person of the company sees. */
    tabs(active) {
      const items = [['wallet.html', 'Dataspace wallet'], ['credentials.html', 'Credentials'], ['wallet-accounts.html', 'Wallet accounts']];
      return `<nav class="tx-tabs wx-feature-tabs" aria-label="Wallets as a service">${items.map(([href, label]) => `<a class="tx-tab" href="${href}"${href === active ? ' aria-selected="true" aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
    },
  };

  window.wx = wx;

  mock.on('click', '[data-copy]', (_event, el) => {
    const value = el.dataset.copy;
    (navigator.clipboard ? navigator.clipboard.writeText(value) : Promise.reject(new Error('no clipboard')))
      .then(() => mock.toast('Copied'), () => mock.toast(value));
  });
  /** Close a <dialog> from a button inside it: <button data-close>. */
  mock.on('click', 'dialog [data-close]', (_event, el) => el.closest('dialog').close());
})();
