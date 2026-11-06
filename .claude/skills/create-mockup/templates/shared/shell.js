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
// Configurator (the default for every view): each alternative of a part of the screen carries
// data-variant="<dimension>:<value>" (data-variant-label names the value, data-dimension names the dimension on its
// first alternative). The configurator panel switches every dimension independently, keeps the combination in the URL
// (#layout=cards&filter=chips) and copies it for the decision in the hub.
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
      console.warn(`mockup: icon ${name} is not in icons.js; run: mockup.py sync <feature>`);
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

  // ── states (one per result of the use case) and variants (the configurator) ──
  let state = null;
  const chosen = {};
  const dimensions = {};

  function readDimensions() {
    document.querySelectorAll('[data-variant]').forEach((el) => {
      const [key, value] = el.dataset.variant.split(':');
      if (!key || !value) { console.warn(`mockup: data-variant="${el.dataset.variant}" is not <dimension>:<value>`); return; }
      const dimension = dimensions[key] || (dimensions[key] = { label: key, values: [] });
      if (el.dataset.dimension) { dimension.label = el.dataset.dimension; }
      if (!dimension.values.some((v) => v.value === value)) {
        dimension.values.push({ value, label: el.dataset.variantLabel || value });
      }
    });
    const fromUrl = new URLSearchParams(location.hash.slice(1));
    Object.entries(dimensions).forEach(([key, dimension]) => {
      const asked = fromUrl.get(key);
      chosen[key] = dimension.values.some((v) => v.value === asked) ? asked : dimension.values[0].value;
    });
  }

  function apply() {
    document.querySelectorAll('[data-show-state], [data-variant]').forEach((el) => {
      const byState = el.dataset.showState && state !== null && !el.dataset.showState.split(/[\s,]+/).includes(state);
      const variant = el.dataset.variant ? el.dataset.variant.split(':') : null;
      el.hidden = Boolean(byState || (variant && chosen[variant[0]] !== variant[1]));
    });
    document.querySelectorAll('[data-state-button]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.stateButton === state));
    });
    document.querySelectorAll('[data-choose]').forEach((button) => {
      const [key, value] = button.dataset.choose.split(':');
      button.setAttribute('aria-pressed', String(chosen[key] === value));
    });
    const combination = document.querySelector('[data-combination]');
    if (combination) { combination.textContent = describe(); }
  }

  function describe() {
    const combination = Object.keys(dimensions).map((key) => `${key}=${chosen[key]}`).join(' · ');
    const suggestion = document.querySelector('[data-config-suggestion]')?.value.trim();
    return suggestion ? `${combination}\nSuggestion: ${suggestion}` : combination;
  }

  function setState(next) {
    state = next;
    body.dataset.state = next;
    apply();
  }

  function choose(key, value) {
    chosen[key] = value;
    const params = new URLSearchParams(Object.entries(chosen));
    history.replaceState(null, '', `${location.pathname}${location.search}#${params}`);
    apply();
    document.dispatchEvent(new CustomEvent('mock:configure', { detail: { ...chosen } }));
  }

  function mountConfigurator() {
    const keys = Object.keys(dimensions);
    if (!keys.length) { return; }
    const total = keys.reduce((n, key) => n * dimensions[key].values.length, 1);
    const panel = document.createElement('aside');
    panel.className = 'mock-config';
    panel.id = 'mock-config';
    panel.setAttribute('aria-label', 'Configurator (not part of the portal)');
    panel.innerHTML = `
      <div class="mock-config__head"><span class="mock-bar__tag">Configurator</span><span>${total} combinations</span></div>
      ${keys.map((key) => `
        <div class="mock-config__dim" role="group" aria-label="${dimensions[key].label}">
          <div class="mock-config__label">${dimensions[key].label}</div>
          <div class="mock-config__values">${dimensions[key].values.map((v) =>
            `<button type="button" data-choose="${key}:${v.value}">${v.label}</button>`).join('')}</div>
        </div>`).join('')}
      <label class="mock-config__suggestion">Suggestions (optional)
        <textarea data-config-suggestion rows="3" placeholder="Suggest a change or add context"></textarea>
      </label>
      <div class="mock-config__foot"><code data-combination></code><button type="button" data-copy-combination>Copy</button></div>`;
    body.appendChild(panel);
    body.classList.add('mock-config-open');
    panel.querySelector('[data-config-suggestion]').addEventListener('input', apply);
    panel.addEventListener('click', (event) => {
      const button = event.target.closest('[data-choose]');
      if (button) { const [key, value] = button.dataset.choose.split(':'); choose(key, value); }
      if (event.target.closest('[data-copy-combination]')) {
        const text = describe();
        (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject(new Error('no clipboard')))
          .then(() => mock.toast(`Copied: ${text}`), () => mock.toast(text));
      }
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
      ${Object.keys(dimensions).length ? '<button type="button" data-toggle-config aria-pressed="true">configure</button>' : ''}
      <button type="button" data-theme-toggle></button>`;
    body.appendChild(bar);
    bar.querySelectorAll('[data-state-button]').forEach((button) => {
      button.addEventListener('click', () => setState(button.dataset.stateButton));
    });
    bar.querySelectorAll('[data-toggle-config]').forEach((button) => {
      button.addEventListener('click', () => {
        const panel = document.getElementById('mock-config');
        panel.hidden = !panel.hidden;
        body.classList.toggle('mock-config-open', !panel.hidden);
        button.setAttribute('aria-pressed', String(!panel.hidden));
      });
    });
    if (states.length) { setState(body.dataset.state || states[0]); } else { apply(); }
  }

  // ── helpers for the interactions of a view ───────────────────────────────
  const mock = {
    data: window.MOCK_DATA || {},
    icon,
    setState,
    /** The chosen value of a configurator dimension: mock.variant('layout') === 'cards'. */
    variant: (key) => chosen[key],
    /** Re-render JavaScript-built parts when the combination changes: mock.onConfigure((chosen) => …). */
    onConfigure(handler) {
      document.addEventListener('mock:configure', (event) => handler(event.detail));
    },
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
    readDimensions();
    mountShell();
    mountConfigurator();
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
