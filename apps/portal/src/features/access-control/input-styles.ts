/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
export const inputSx = {
  display: 'block',
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0,
  px: 1.5,
  py: 1.25,
  color: 'text.primary',
  bgcolor: 'background.paper',
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  font: 'inherit',
  '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
  '&[aria-invalid="true"]': { borderColor: 'error.main' },
} as const;

export const labelSx = { display: 'grid', gap: 0.75, minWidth: 0, fontWeight: 500 } as const;

export const checkboxSx = {
  accentColor: 'primary.main',
  '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
} as const;
