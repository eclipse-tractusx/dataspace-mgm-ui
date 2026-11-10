/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 * Assisted-By: Claude Code (claude-opus-5-5)
 */
import {
  Box,
  Button,
  Card,
  Chip,
  DataTable,
  IconButton,
  PersonAddAltOutlinedIcon,
  CloseIcon,
  Stack,
  Typography,
  type GridColDef,
  type GridRenderCellParams,
} from "@dataspace-mgm/ui-mui";
import { useTranslation } from "react-i18next";
import { actionSx, PeopleHeader, PeopleState } from "./common";
import { cardGridSx, DotChip, Identity, ListToolbar, Tag, toneOf, useTableLocale, useViewMode } from "./display";
import { PEOPLE_NS } from "./i18n";
import type { CompanyUser, PeopleStatus, UserFilter } from "./types";

export interface UsersProps {
  status: PeopleStatus;
  users: readonly CompanyUser[];
  companyName?: string;
  filter: UserFilter;
  onFilterChange: (filter: UserFilter) => void;
  onInvite?: () => void;
  onView?: (user: CompanyUser) => void;
  selectedUser?: CompanyUser | null;
  onCloseDetails?: () => void;
  onEditRoles?: (user: CompanyUser) => void;
  onRemove?: (user: CompanyUser) => void;
  onRetry?: () => void;
  onSignIn?: () => void;
}

export function Users({
  status,
  users,
  companyName,
  filter,
  onFilterChange,
  onInvite,
  onView,
  selectedUser,
  onCloseDetails,
  onEditRoles,
  onRemove,
  onRetry,
  onSignIn,
}: UsersProps) {
  const { t } = useTranslation(PEOPLE_NS);
  const locale = useTableLocale();
  const [mode, setMode] = useViewMode("users");
  const name = (user: CompanyUser) =>
    [user.givenName, user.familyName].filter(Boolean).join(" ") ||
    t("nameUnavailable");
  const joined = (user: CompanyUser) =>
    user.joinedVia ? t("joinedViaValue", { via: t(`via.${user.joinedVia}`, { defaultValue: user.joinedVia }) }) : undefined;
  const statusLabel = (value: string) => t(value, { defaultValue: value });
  const roles = (user: CompanyUser) =>
    user.portalRoles.length ? (
      <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 0.75 }}>
        {user.portalRoles.map((role) => <Tag key={role}>{role}</Tag>)}
      </Stack>
    ) : (
      <Typography variant="body2" color="text.secondary">{t("noRoles")}</Typography>
    );
  const details = (user: CompanyUser) =>
    onView && (
      <Button size="small" variant="text" onClick={(event) => { event.stopPropagation(); onView(user); }} aria-label={`${t("details")}: ${name(user)}`}>
        {t("details")}
      </Button>
    );
  const columns: GridColDef<CompanyUser>[] = [
    { field: "name", headerName: t("name"), flex: 1.4, minWidth: 220, valueGetter: (_, row) => name(row), renderCell: ({ row }: GridRenderCellParams<CompanyUser>) => <Identity name={name(row)} secondary={joined(row)} /> },
    { field: "portalRoles", headerName: t("roles"), flex: 1, minWidth: 180, sortable: false, renderCell: ({ row }: GridRenderCellParams<CompanyUser>) => roles(row) },
    { field: "status", headerName: t("status"), width: 150, valueGetter: (_, row) => statusLabel(row.status), renderCell: ({ row }: GridRenderCellParams<CompanyUser>) => <DotChip tone={toneOf(row.status)} label={statusLabel(row.status)} /> },
    { field: "actions", headerName: "", width: 140, sortable: false, align: "right", renderCell: ({ row }: GridRenderCellParams<CompanyUser>) => details(row) },
  ];
  const filters = (
    <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1 }} role="group" aria-label={t("statusFilter")}>
      {(["", "ACTIVE", "DISABLED", "REMOVED"] as const).map((value) => (
        <Chip
          key={value}
          label={t(value || "defaultUsers")}
          clickable
          color={filter === value ? "primary" : "default"}
          variant={filter === value ? "filled" : "outlined"}
          aria-pressed={filter === value}
          onClick={() => onFilterChange(value)}
          sx={{ fontWeight: 600 }}
        />
      ))}
    </Stack>
  );
  return (
    <Box>
      <PeopleHeader
        title={t("users")}
        description={companyName}
        action={t("invite")}
        actionIcon={<PersonAddAltOutlinedIcon />}
        onAction={onInvite}
      />
      <PeopleState status={status} onRetry={onRetry} onSignIn={onSignIn} />
      {status === "empty" && (
        <Card sx={{ p: 4, textAlign: "center", "&:hover": { boxShadow: "none" } }}>
          <Typography variant="h2" sx={{ fontSize: "1.375rem", fontWeight: 700 }}>{t("noUsers")}</Typography>
          <Typography color="text.secondary" sx={{ my: 2 }}>{t("invitePrompt")}</Typography>
          {onInvite && (
            <Button variant="contained" startIcon={<PersonAddAltOutlinedIcon />} sx={actionSx} onClick={onInvite}>
              {t("invite")}
            </Button>
          )}
        </Card>
      )}
      {status === "loaded" && (
        <>
          <ListToolbar filters={filters} count={t("userCount", { count: users.length })} mode={mode} onMode={setMode} />
          {users.length === 0 ? (
            <Card sx={{ p: 3, "&:hover": { boxShadow: "none" } }}>
              <Typography color="text.secondary">{t("noUserMatches")}</Typography>
            </Card>
          ) : mode === "table" ? (
            <DataTable<CompanyUser>
              aria-label={t("users")}
              rows={users}
              columns={columns}
              getRowId={(row) => row.userId}
              locale={locale}
              hideFooter
              onRowClick={onView ? ({ row }) => onView(row) : undefined}
            />
          ) : (
            <Box sx={cardGridSx} component="ul" aria-label={t("users")} style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {users.map((user) => (
                <Card
                  component="li"
                  key={user.userId}
                  sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2, cursor: onView ? "pointer" : "default" }}
                  onClick={onView ? () => onView(user) : undefined}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Identity name={name(user)} secondary={joined(user)} size={44} />
                    <DotChip tone={toneOf(user.status)} label={statusLabel(user.status)} />
                  </Stack>
                  {roles(user)}
                  {onView && <Box sx={{ mt: "auto", ml: -1 }}>{details(user)}</Box>}
                </Card>
              ))}
            </Box>
          )}
          {selectedUser && (
            <Card component="section" aria-label={name(selectedUser)} sx={{ p: { xs: 3, md: 3.5 }, mt: 3, "&:hover": { boxShadow: "none" } }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                <Identity name={name(selectedUser)} secondary={joined(selectedUser)} size={52} />
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <DotChip tone={toneOf(selectedUser.status)} label={statusLabel(selectedUser.status)} />
                  {onCloseDetails && (
                    <IconButton aria-label={t("close")} onClick={onCloseDetails} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
              <Box
                component="dl"
                sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, columnGap: 4, rowGap: 2, my: 3, borderTop: 1, borderColor: "divider", pt: 2.5 }}
              >
                {(
                  [
                    [t("userId"), <Tag key="id" mono>{selectedUser.userId}</Tag>],
                    [t("roles"), roles(selectedUser)],
                    [t("joinedVia"), selectedUser.joinedVia ? t(`via.${selectedUser.joinedVia}`, { defaultValue: selectedUser.joinedVia }) : "—"],
                    [t("status"), statusLabel(selectedUser.status)],
                  ] as const
                ).map(([label, value]) => (
                  <Box key={label} sx={{ minWidth: 0 }}>
                    <Typography component="dt" variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.75 }}>
                      {label}
                    </Typography>
                    <Box component="dd" sx={{ m: 0, overflowWrap: "anywhere" }}>
                      {value}
                    </Box>
                  </Box>
                ))}
              </Box>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                {onEditRoles && (
                  <Button variant="outlined" sx={actionSx} onClick={() => onEditRoles(selectedUser)}>
                    {t("editRoles")}
                  </Button>
                )}
                {onRemove && (
                  <Button variant="outlined" color="error" sx={actionSx} onClick={() => onRemove(selectedUser)}>
                    {t("remove")}
                  </Button>
                )}
              </Stack>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}
