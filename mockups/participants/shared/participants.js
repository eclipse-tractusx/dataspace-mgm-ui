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

// Texts and small renderers shared by the views of participant management. Load after shell.js. The labels are the
// English texts of apps/portal/src/features/participants/i18n (en) where they exist; in the proof of concept each one
// becomes an i18n key. Nothing here decides anything: it only formats what the API returns.
(function () {
  'use strict';

  const mock = window.mock;

  const labels = {
    companyStatus: { ACTIVE: 'Active', REQUESTED: 'Requested', REJECTED: 'Rejected', INACTIVE: 'Inactive' },
    coreDataSource: { EBW: 'From the Business Wallet', MANUAL: 'Checked by the onboarding service provider' },
    identifierType: {
      EUID: 'EUID', EBWOID: 'EBWOID', VAT_ID: 'VAT ID', COMMERCIAL_REG_NUMBER: 'Commercial register number', LEI_CODE: 'LEI code', EORI: 'EORI',
    },
    identifierSource: { BUSINESS_WALLET: 'Business Wallet', DECLARED: 'Declared' },
    role: {
      ACTIVE_PARTICIPANT: 'Active participant', APP_PROVIDER: 'App provider', SERVICE_PROVIDER: 'Service provider',
      ONBOARDING_SERVICE_PROVIDER: 'Onboarding service provider',
    },
    roleStatus: { ACTIVE: 'Active', REQUESTED: 'Requested', INACTIVE: 'Removed', NONE: 'Not assigned' },
    changeRequestStatus: { OPEN: 'Open', APPROVED: 'Approved', DECLINED: 'Declined', WITHDRAWN: 'Withdrawn' },
    cspStatus: { PENDING: 'Registration running', REGISTERED: 'Registered', FAILED: 'Registration failed', TRANSFERRED_AWAY: 'Moved to another OSP' },
    membership: { NONE: 'Not a member', REGISTERED: 'Member', DEREGISTERED: 'Membership ended' },
    deactivationReason: { MANUAL: 'Deactivated by the onboarding service provider', TRANSFERRED: 'Moved to another OSP' },
    failureReason: { REGISTERED_AT_OTHER_OSP: 'The company is already registered with another onboarding service provider.' },
    field: {
      name: 'Legal name', shortName: 'Short name', address: 'Address', identifiers: 'Identifiers', countryCode: 'Country',
    },
  };

  const tone = {
    companyStatus: { ACTIVE: 'success', REQUESTED: 'warning', REJECTED: 'error', INACTIVE: 'default' },
    roleStatus: { ACTIVE: 'success', REQUESTED: 'warning', INACTIVE: 'default', NONE: 'default' },
    changeRequestStatus: { OPEN: 'info', APPROVED: 'success', DECLINED: 'error', WITHDRAWN: 'default' },
    cspStatus: { PENDING: 'warning', REGISTERED: 'success', FAILED: 'error', TRANSFERRED_AWAY: 'default' },
    membership: { NONE: 'default', REGISTERED: 'success', DEREGISTERED: 'default' },
  };

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const countries = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;

  const px = {
    labels,
    esc,

    /** A status chip: px.chip('companyStatus', 'ACTIVE'). */
    chip(kind, value) {
      return `<span class="tx-chip tx-status tx-status--${tone[kind][value] || 'default'}">${esc(labels[kind][value] || value)}</span>`;
    },

    /** A chip that is not a status (a role, a type). */
    roleChip(role, pending) {
      return `<span class="tx-chip px-chip-role${pending ? ' px-chip-role--pending' : ''}">${esc(labels.role[role] || role)}</span>`;
    },

    /** The country of a code, in words: DE → Germany. */
    country(code) {
      try { return countries ? countries.of(code) : code; } catch (_) { return code; }
    },

    /** The address in lines, like a letter. */
    addressLines(a) {
      const lines = [[a.street, a.houseNumber].filter(Boolean).join(' ')];
      if (a.addressAddition) { lines.push(a.addressAddition); }
      lines.push([a.postalCode, a.city].filter(Boolean).join(' '));
      if (a.countryCode) { lines.push(`${px.country(a.countryCode)}${a.region ? ` (${a.countryCode}-${a.region})` : ''}`); }
      return lines;
    },
    address(a) { return px.addressLines(a).map(esc).join('<br>'); },
    addressOneLine(a) { return esc(px.addressLines(a).join(', ')); },

    /** Where a value comes from: the Business Wallet (verified) or declared. */
    source(source) {
      return source === 'BUSINESS_WALLET'
        ? `<span class="px-source px-source--wallet" title="Verified with the Business Wallet">${mock.icon('VerifiedUserOutlined')}Business Wallet</span>`
        : `<span class="px-source px-source--declared" title="Declared by the company">${mock.icon('EditNoteOutlined')}Declared</span>`;
    },
    /** The source of the core data of a company. */
    coreSource(coreDataSource) {
      return coreDataSource === 'EBW'
        ? `<span class="px-source px-source--wallet">${mock.icon('VerifiedUserOutlined')}${labels.coreDataSource.EBW}</span>`
        : `<span class="px-source px-source--manual">${mock.icon('FactCheckOutlined')}${labels.coreDataSource.MANUAL}</span>`;
    },
    verifiedIcon() {
      return `<span class="px-verified-icon" title="Verified with the Business Wallet">${mock.icon('VerifiedUserOutlined')}</span>`;
    },

    /** Identifiers as rows: type, value, source. */
    identifiers(list, opts) {
      const withSource = !opts || opts.source !== false;
      return `<ul class="px-ids">${list.map((i) => `
        <li><span class="px-ids__type">${esc(labels.identifierType[i.type] || i.type)}</span>
          <span class="px-mono">${esc(i.value)}</span>
          <span>${withSource && i.source ? px.source(i.source) : ''}</span></li>`).join('')}</ul>`;
    },

    /** A value in monospace with a copy button. */
    copyable(value) {
      if (!value) { return '<span class="px-none">Not assigned yet</span>'; }
      return `<span class="px-value"><span class="px-mono">${esc(value)}</span><button class="px-copy" type="button" data-copy="${esc(value)}" title="Copy">${mock.icon('ContentCopyOutlined', 'sm')}</button></span>`;
    },

    dateTime(iso) {
      if (!iso) { return '–'; }
      return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    },
    date(iso) { return iso ? mock.date(iso) : '–'; },
    bytes(n) { return n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`; },
    shortId(id) { return id ? `${id.slice(0, 8)}…` : '–'; },

    /** A file of a change request. */
    fileIcon(mediaType) { return mediaType === 'application/pdf' ? mock.icon('PictureAsPdfOutlined') : mock.icon('ImageOutlined'); },

    /** The person behind a `sub`. The API returns only the `sub`; the name is an open question (C2-M2). */
    personName(sub) {
      const person = Object.values(mock.data.persons).find((p) => p.id === sub);
      return person ? person.name : sub;
    },

    /** The changes of a change request, field by field, against the current company. */
    changeRows(changes, company) {
      const rows = [];
      if (changes.name !== undefined) {
        rows.push({ field: labels.field.name, current: esc(company.name), requested: esc(changes.name), changed: changes.name !== company.name });
      }
      if (changes.address) {
        rows.push({ field: labels.field.address, current: px.address(company.address), requested: px.address({ ...changes.address, countryCode: company.address.countryCode }), changed: true });
      }
      if (changes.identifiers) {
        const declaredNow = company.identifiers.filter((i) => i.source === 'DECLARED');
        const types = [...new Set([...declaredNow.map((i) => i.type), ...changes.identifiers.map((i) => i.type)])];
        types.forEach((type) => {
          const before = declaredNow.find((i) => i.type === type);
          const after = changes.identifiers.find((i) => i.type === type);
          const changed = !before || !after || before.value !== after.value;
          rows.push({
            field: labels.identifierType[type] || type,
            current: before ? `<span class="px-mono">${esc(before.value)}</span>` : '<span class="px-none">none</span>',
            requested: after ? `<span class="px-mono">${esc(after.value)}</span>${before ? '' : ' <span class="px-added">new</span>'}` : '<span class="px-removed">removed</span>',
            changed,
          });
        });
      }
      return rows;
    },
    /** A short sentence of what a change request changes: "LEI code" or "Legal name". */
    changeSummary(changes, company) {
      return px.changeRows(changes, company).filter((r) => r.changed).map((r) => r.field).join(', ') || 'No change';
    },

    /** A drawn QR code (a mockup of the code the EBW-Connector would show). */
    qr(seed) {
      const n = 25;
      let h = 0;
      for (const c of String(seed)) { h = (h * 31 + c.charCodeAt(0)) >>> 0; }
      const corners = [[0, 0], [n - 7, 0], [0, n - 7]];
      const cells = [];
      for (let y = 0; y < n; y += 1) {
        for (let x = 0; x < n; x += 1) {
          const corner = corners.find(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);
          let on;
          if (corner) {
            const lx = x - corner[0];
            const ly = y - corner[1];
            const inside = lx >= 0 && ly >= 0 && lx <= 6 && ly <= 6;
            on = inside && (lx === 0 || ly === 0 || lx === 6 || ly === 6 || (lx > 1 && lx < 5 && ly > 1 && ly < 5));
          } else {
            h = (h * 1103515245 + 12345) >>> 0;
            on = (h >>> 16) % 2 === 0;
          }
          cells.push(`<i class="${on ? 'on' : ''}"></i>`);
        }
      }
      return `<div class="px-qr" role="img" aria-label="QR code to confirm with the EUDI Wallet">${cells.join('')}</div>`;
    },

    /** The person the screen is seen as: a note of the mockup. */
    persona(key, extra) {
      const p = mock.data.persons[key];
      return `${mock.icon('VisibilityOutlined', 'sm')}<span>Seen as <strong>${esc(p.name)}</strong> · ${esc(p.portalRoles.join(', '))}${extra ? ` · ${esc(extra)}` : ''}</span>`;
    },
  };

  window.px = px;

  mock.on('click', '[data-copy]', (_event, el) => {
    const value = el.dataset.copy;
    (navigator.clipboard ? navigator.clipboard.writeText(value) : Promise.reject(new Error('no clipboard')))
      .then(() => mock.toast(`Copied ${value}`), () => mock.toast(value));
  });
  /** Close a <dialog> from a button inside it: <button data-close>. */
  mock.on('click', 'dialog [data-close]', (_event, el) => el.closest('dialog').close());
})();
