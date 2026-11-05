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

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { NavigationItem } from '../types/routing';

/** How many favourites the phone's bottom bar shows; the desktop sidebar shows all of them. */
export const PHONE_FAVOURITE_SLOTS = 5;
/** Always first in the sidebar and the bar, and not in the list of favourites to choose. */
export const HOME_PATH = '/';
/** The apps the person took out: everything else is a favourite, so a new feature shows up by itself. */
export const HIDDEN_STORAGE_KEY = 'dataspace-mgm.navigation.hidden';

interface FavouritesValue {
  /** Home first, then the favourite features in registry order. */
  favourites: NavigationItem[];
  /** Every feature that can be a favourite (all but Home), in registry order. */
  candidates: NavigationItem[];
  isFavourite: (path: string) => boolean;
  toggle: (path: string) => void;
}

const FavouritesContext = createContext<FavouritesValue | null>(null);

/** The paths that are not hidden, Home first. */
export function favouritesOf(items: readonly NavigationItem[], hidden: readonly string[]): NavigationItem[] {
  const home = items.filter((item) => item.path === HOME_PATH);
  return [...home, ...items.filter((item) => item.path !== HOME_PATH && !hidden.includes(item.path))];
}

/** The hidden list after `path` was switched between favourite and not. Home cannot be hidden. */
export function toggleHidden(hidden: readonly string[], path: string): string[] {
  if (path === HOME_PATH) return [...hidden];
  return hidden.includes(path) ? hidden.filter((entry) => entry !== path) : [...hidden, path];
}

function readHidden(): string[] {
  try {
    const parsed: unknown = JSON.parse(globalThis.localStorage?.getItem(HIDDEN_STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((path): path is string => typeof path === 'string') : [];
  } catch {
    return []; // blocked or unreadable storage: everything is a favourite
  }
}

/**
 * The person's favourite features, kept in this browser for now and shared with its other tabs.
 * Once the backend stores preferences, load and save them through its core package instead.
 */
export function FavouritesProvider({ items, children }: { items: NavigationItem[]; children: ReactNode }) {
  const [hidden, setHidden] = useState<string[]>(readHidden);

  // Another tab changed the favourites.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === HIDDEN_STORAGE_KEY) setHidden(readHidden());
    };
    globalThis.addEventListener?.('storage', onStorage);
    return () => globalThis.removeEventListener?.('storage', onStorage);
  }, []);

  const toggle = useCallback((path: string) => {
    setHidden((current) => {
      const next = toggleHidden(current, path);
      try {
        globalThis.localStorage?.setItem(HIDDEN_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // not remembered, the change holds until the page reloads
      }
      return next;
    });
  }, []);

  const value = useMemo<FavouritesValue>(() => {
    const favourites = favouritesOf(items, hidden);
    return {
      favourites,
      candidates: items.filter((item) => item.path !== HOME_PATH),
      isFavourite: (path) => favourites.some((item) => item.path === path),
      toggle,
    };
  }, [items, hidden, toggle]);

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites(): FavouritesValue {
  const value = useContext(FavouritesContext);
  if (!value) throw new Error('useFavourites must be used inside <FavouritesProvider>');
  return value;
}

/** The item whose path is the current page or a parent of it (Home only matches itself). */
export function activePath(pathname: string, paths: readonly string[]): string | undefined {
  return paths
    .filter((path) => pathname === path || (path !== HOME_PATH && pathname.startsWith(`${path}/`)))
    .sort((a, b) => b.length - a.length)[0];
}
