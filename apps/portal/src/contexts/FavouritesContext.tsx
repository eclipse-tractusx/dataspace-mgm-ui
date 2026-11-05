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

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { NavigationItem } from '../types/routing';

/** At most this many favourites: the phone's bottom bar has room for five destinations. */
export const MAX_FAVOURITES = 5;
/** Home is always a favourite, so the bar never ends up empty. */
export const FIXED_FAVOURITES = ['/'];
export const FAVOURITES_STORAGE_KEY = 'dataspace-mgm.favourites';

interface FavouritesValue {
  /** The favourite items, in registry order: the sidebar and the bottom bar show these. */
  favourites: NavigationItem[];
  isFavourite: (path: string) => boolean;
  /** Fixed favourites cannot be removed, and no more than MAX_FAVOURITES can be added. */
  canToggle: (path: string) => boolean;
  toggle: (path: string) => void;
}

const FavouritesContext = createContext<FavouritesValue | null>(null);

/** Known paths only, the fixed ones first, no duplicates, at most MAX_FAVOURITES. */
export function sanitiseFavourites(paths: unknown, items: NavigationItem[]): string[] {
  const known = new Set(items.map((item) => item.path));
  const list = Array.isArray(paths) ? paths.filter((p): p is string => typeof p === 'string' && known.has(p)) : [];
  const fixed = FIXED_FAVOURITES.filter((p) => known.has(p));
  return [...new Set([...fixed, ...list])].slice(0, MAX_FAVOURITES);
}

function load(items: NavigationItem[]): string[] {
  try {
    const stored = globalThis.localStorage?.getItem(FAVOURITES_STORAGE_KEY);
    if (stored) return sanitiseFavourites(JSON.parse(stored), items);
  } catch {
    // storage blocked or corrupt: use the defaults
  }
  return sanitiseFavourites(
    items.slice(0, MAX_FAVOURITES).map((item) => item.path),
    items,
  );
}

/**
 * The person's favourite features. Kept in this browser for now (a per-person convenience);
 * once the backend stores preferences, load and save them through its core package instead.
 */
export function FavouritesProvider({ items, children }: { items: NavigationItem[]; children: ReactNode }) {
  const [paths, setPaths] = useState<string[]>(() => load(items));

  const isFavourite = useCallback((path: string) => paths.includes(path), [paths]);
  const canToggle = useCallback(
    (path: string) => !FIXED_FAVOURITES.includes(path) && (paths.includes(path) || paths.length < MAX_FAVOURITES),
    [paths],
  );
  const toggle = useCallback(
    (path: string) => {
      if (!canToggle(path)) return;
      const next = sanitiseFavourites(paths.includes(path) ? paths.filter((p) => p !== path) : [...paths, path], items);
      try {
        globalThis.localStorage?.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // not persisted, the choice still applies to this visit
      }
      setPaths(next);
    },
    [canToggle, items, paths],
  );

  const value = useMemo<FavouritesValue>(
    () => ({ favourites: items.filter((item) => paths.includes(item.path)), isFavourite, canToggle, toggle }),
    [items, paths, isFavourite, canToggle, toggle],
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites(): FavouritesValue {
  const value = useContext(FavouritesContext);
  if (!value) throw new Error('useFavourites must be used inside <FavouritesProvider>');
  return value;
}
