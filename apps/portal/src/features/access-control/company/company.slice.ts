/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserFilter } from '../people';

type CompanyUiState = { filter: UserFilter; selectedUserId: string | null; confirming: boolean; page: number; roleDraft: string; editingRoles: boolean; invitationsOpen: boolean };
const initialState: CompanyUiState = { filter: '', selectedUserId: null, confirming: false, page: 0, roleDraft: '', editingRoles: false, invitationsOpen: false };
export const companyUsersSlice = createSlice({
  name: 'companyUsersUi',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<UserFilter>) { state.filter = action.payload; state.page = 0; state.selectedUserId = null; state.confirming = false; state.editingRoles = false; },
    selectUser(state, action: PayloadAction<string | null>) { state.selectedUserId = action.payload; state.confirming = false; state.editingRoles = false; state.roleDraft = ''; },
    editRoles(state, action: PayloadAction<string[]>) { state.roleDraft = action.payload.join(', '); state.editingRoles = true; },
    setRoleDraft(state, action: PayloadAction<string>) { state.roleDraft = action.payload; },
    cancelRoleEdit(state) { state.editingRoles = false; state.roleDraft = ''; },
    toggleInvitations(state) { state.invitationsOpen = !state.invitationsOpen; },
    setConfirming(state, action: PayloadAction<boolean>) { state.confirming = action.payload; },
    setPage(state, action: PayloadAction<number>) { state.page = action.payload; state.selectedUserId = null; state.confirming = false; state.editingRoles = false; },
  },
});
