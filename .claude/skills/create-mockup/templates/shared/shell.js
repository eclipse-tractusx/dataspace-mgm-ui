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

// The portal shell around a mockup screen, and small helpers for its interactions. A view page is
//   <body data-active="/onboarding" data-view="Applications" data-states="loaded,empty,loading,error">
//     <main class="tx-page"> … </main>
//     <script src="../shared/icons.js"></script> <script src="../shared/nav.js"></script>
//     <script src="../shared/data.js"></script> <script src="../shared/shell.js"></script>
// Elements with data-show-state="empty error" are shown only in those states (the result cases of the use case).
// The hub (index.html) uses the same file with <body data-hub-page>: theme only, no shell.
(function () {
  'use strict';

  const here = document.currentScript ? document.currentScript.src : location.href;
  const repo = (path) => new URL('../../../' + path, here).href;
  const KEY = 'dataspace-mgm-mockup-theme';
  const body = document.body;

  // ── theme: dark by default, like the portal; ?theme=light opens a page in light mode ──
  function theme() {
    const asked = new URLSearchParams(location.search).get('theme');
    if (asked === 'light' || asked === 'dark') { return asked; }
    try { return localStorage.getItem(KEY) || 'dark'; } catch (_) { return 'dark'; }
  }
  function setTheme(mode) {
    document.documentElement.dataset.theme = mode;
    try { localStorage.setItem(KEY, mode); } catch (_) { /* file:// without storage */ }
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.innerHTML = icon(mode === 'dark' ? 'LightModeOutlined' : 'DarkModeOutlined');
      button.title = `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`;
    });
  }

  // ── icons: generated from @mui/icons-material into icons.js ──────────────
  function icon(name, size) {
    const shapes = (window.MOCK_ICONS || {})[name];
    const cls = size === 'sm' ? 'tx-icon tx-icon--sm' : 'tx-icon';
    if (!shapes) {
      console.warn(`mockup: icon ${name} is not in icons.js; run: mockup.py icons <feature> --add ${name}`);
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="3"/></svg>`;
    }
    return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${shapes}</svg>`;
  }

  // ── the shell ────────────────────────────────────────────────────────────
  function navButton(item, active) {
    const current = item.path === active ? ' aria-current="page"' : '';
    const disabled = item.disabled && item.path !== active ? ' aria-disabled="true"' : '';
    const title = item.disabled && item.path !== active ? `${item.name} (coming soon)` : item.name;
    return `<a class="tx-iconbtn" href="#" title="${title}" aria-label="${title}"${current}${disabled}>${icon(item.icon)}</a>`;
  }

  function mountShell() {
    const main = body.querySelector('main');
    if (!main) { return; }
    const nav = window.MOCK_NAV || [];
    const active = body.dataset.active || '/';
    const env = body.dataset.env || 'mockup';
    const app = document.createElement('div');
    app.className = 'tx-app';
    app.innerHTML = `
      <header class="tx-header">
        <a class="tx-brand" href="#" aria-label="Eclipse Tractus-X Dataspace Management, home">
          <img src="${repo('libs/shared/ui-mui/src/assets/logo_tractus-x.svg')}" alt="">
          <span class="tx-brand__name">Eclipse Tractus-X</span>
          <span class="tx-brand__sep" aria-hidden="true"></span>
          <span class="tx-brand__product">Dataspace Management</span>
        </a>
        <span class="tx-header__spacer"></span>
        <span class="tx-env" aria-label="Environment: ${env}">${env}</span>
        <button class="tx-iconbtn tx-theme" type="button" data-theme-toggle></button>
      </header>
      <div class="tx-body">
        <nav class="tx-rail" aria-label="Features">
          <div class="tx-rail__top">${nav.map((item) => navButton(item, active)).join('')}
            <a class="tx-iconbtn tx-iconbtn--add" href="#" title="Edit favourites">${icon('Add')}</a></div>
          <span class="tx-rail__sep" aria-hidden="true"></span>
          <div class="tx-rail__bottom">
            <a class="tx-iconbtn" href="#" title="Notifications">${icon('NotificationsOutlined')}</a>
            <a class="tx-iconbtn" href="#" title="Profile"><span class="tx-avatar">${icon('PersonOutlined', 'sm')}</span></a>
            <a class="tx-iconbtn" href="#" title="All services">${icon('AppsOutlined')}</a>
          </div>
        </nav>
        <div class="tx-canvas" id="canvas"></div>
      </div>
      <nav class="tx-bottombar" aria-label="Favourites">
        ${nav.slice(0, 5).map((item) => navButton(item, active)).join('')}
        <a class="tx-iconbtn tx-iconbtn--add" href="#" title="Edit favourites">${icon('Add')}</a>
        <span class="tx-bottombar__spacer"></span>
        <a class="tx-iconbtn" href="#" title="Profile"><span class="tx-avatar">${icon('PersonOutlined', 'sm')}</span></a>
        <a class="tx-iconbtn" href="#" title="All services">${icon('AppsOutlined')}</a>
      </nav>`;
    body.insertBefore(app, main);
    app.querySelector('#canvas').appendChild(main);
    main.id = main.id || 'main-content';
  }

  // ── states: one per result of the use case (found, empty, failed, …) ─────
  function setState(state) {
    body.dataset.state = state;
    document.querySelectorAll('[data-show-state]').forEach((el) => {
      el.hidden = !el.dataset.showState.split(/[\s,]+/).includes(state);
    });
    document.querySelectorAll('[data-state-button]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.stateButton === state));
    });
  }

  function mountBar() {
    const states = (body.dataset.states || '').split(/[\s,]+/).filter(Boolean);
    const bar = document.createElement('aside');
    bar.className = 'mock-bar';
    bar.setAttribute('aria-label', 'Mockup controls (not part of the portal)');
    bar.innerHTML = `
      <span class="mock-bar__tag">Mockup</span>
      <a href="${body.dataset.hub || '../index.html'}">All views</a>
      <span>${body.dataset.view || document.title}</span>
      ${states.map((s) => `<button type="button" data-state-button="${s}">${s}</button>`).join('')}
      <button type="button" data-theme-toggle></button>`;
    body.appendChild(bar);
    bar.querySelectorAll('[data-state-button]').forEach((button) => {
      button.addEventListener('click', () => setState(button.dataset.stateButton));
    });
    if (states.length) { setState(body.dataset.state || states[0]); }
  }

  // ── helpers for the interactions of a view ───────────────────────────────
  const mock = {
    data: window.MOCK_DATA || {},
    icon,
    setState,
    /** Render a list of rows into an element: mock.render('#rows', items, (item) => `<tr>…</tr>`). */
    render(selector, items, row) {
      const el = document.querySelector(selector);
      if (el) { el.innerHTML = items.map(row).join(''); }
    },
    /** Delegate an event: mock.on('click', '[data-open]', (event, el) => …). */
    on(type, selector, handler) {
      document.addEventListener(type, (event) => {
        const el = event.target.closest(selector);
        if (el) { handler(event, el); }
      });
    },
    /** A short confirmation at the bottom of the screen. */
    toast(message) {
      const el = document.createElement('div');
      el.className = 'tx-toast';
      el.setAttribute('role', 'status');
      el.textContent = message;
      body.appendChild(el);
      setTimeout(() => el.remove(), 2400);
    },
    /** Format an ISO timestamp like the portal (en-GB, day month year). */
    date(iso) {
      return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    },
  };
  window.mock = mock;

  document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon, el.dataset.size); });
  if (!('hubPage' in body.dataset)) {
    mountShell();
    mountBar();
  }
  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-theme-toggle]');
    if (toggle) { setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); }
    const link = event.target.closest('a[href="#"]');
    if (link) { event.preventDefault(); }
  });
  setTheme(theme());
})();
