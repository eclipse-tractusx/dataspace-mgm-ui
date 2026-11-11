/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 * Assisted-By: Claude Code (claude-opus-5-5)
 */
import {
  AddIcon,
  Box,
  Button,
  Card,
  CloseIcon,
  DataTable,
  IconButton,
  MenuItem,
  SmartToyOutlinedIcon,
  Stack,
  TextField,
  Typography,
  type GridColDef,
  type GridRenderCellParams,
} from "@dataspace-mgm/ui-mui";
import { useTranslation } from "react-i18next";
import { actionSx, PeopleHeader, PeopleState } from "./common";
import { cardGridSx, DotChip, Identity, ListToolbar, Tag, toneOf, useTableLocale, useViewMode } from "./display";
import { PEOPLE_NS } from "./i18n";
import type { PeopleStatus, TechnicalFilters, TechnicalUser } from "./types";

export interface TechnicalUsersProps {
  status: PeopleStatus;
  users: readonly TechnicalUser[];
  filters: TechnicalFilters;
  onFiltersChange: (filters: TechnicalFilters) => void;
  onCreate?: () => void;
  onView?: (user: TechnicalUser) => void;
  selectedUser?: TechnicalUser | null;
  onCloseDetails?: () => void;
  onEdit?: (user: TechnicalUser) => void;
  onRotate?: (user: TechnicalUser) => void;
  onDelete?: (user: TechnicalUser) => void;
  onRetry?: () => void;
  onSignIn?: () => void;
}

export function TechnicalUsers({
  status,
  users,
  filters,
  onFiltersChange,
  onCreate,
  onView,
  selectedUser,
  onCloseDetails,
  onEdit,
  onRotate,
  onDelete,
  onRetry,
  onSignIn,
}: TechnicalUsersProps) {
  const { t } = useTranslation(PEOPLE_NS);
  const locale = useTableLocale();
  const [mode, setMode] = useViewMode("technical");
  const filterOptions = {
    status: ["ACTIVE", "PENDING", "PENDING_DELETION", "INACTIVE", "DELETED"],
    origin: ["OWN", "SUBSCRIPTION"],
    walletAccess: ["NONE", "REQUESTED", "ACTIVE", "FAILED", "REMOVING"],
  } as const;
  const label = (value: string) => t(value, { defaultValue: value });
  const filtered = Boolean(filters.status || filters.origin || filters.walletAccess);
  const statusChip = (user: TechnicalUser) => (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
      <DotChip tone={toneOf(user.status)} label={label(user.status)} />
      {user.disabled && <DotChip tone="warning" label={t("DISABLED")} />}
    </Stack>
  );
  const wallet = (user: TechnicalUser) => <DotChip tone={toneOf(user.walletAccess)} label={label(user.walletAccess)} />;
  const details = (user: TechnicalUser) =>
    onView && (
      <Button size="small" variant="text" onClick={(event) => { event.stopPropagation(); onView(user); }} aria-label={`${t("details")}: ${user.name}`}>
        {t("details")}
      </Button>
    );
  const columns: GridColDef<TechnicalUser>[] = [
    { field: "name", headerName: t("name"), flex: 1.4, minWidth: 220, renderCell: ({ row }: GridRenderCellParams<TechnicalUser>) => <Identity name={row.name} secondary={row.origin ? label(row.origin) : undefined} icon={<SmartToyOutlinedIcon />} /> },
    { field: "iamClientId", headerName: t("clientId"), width: 140, renderCell: ({ row }: GridRenderCellParams<TechnicalUser>) => <Tag mono>{row.iamClientId}</Tag> },
    { field: "status", headerName: t("status"), width: 170, valueGetter: (_, row) => label(row.status), renderCell: ({ row }: GridRenderCellParams<TechnicalUser>) => statusChip(row) },
    { field: "walletAccess", headerName: t("walletAccess"), width: 150, valueGetter: (_, row) => label(row.walletAccess), renderCell: ({ row }: GridRenderCellParams<TechnicalUser>) => wallet(row) },
    { field: "viewerRole", headerName: t("visibility"), width: 130, valueGetter: (_, row) => label(row.viewerRole), renderCell: ({ row }: GridRenderCellParams<TechnicalUser>) => <Tag>{label(row.viewerRole)}</Tag> },
    { field: "actions", headerName: "", width: 130, sortable: false, align: "right", renderCell: ({ row }: GridRenderCellParams<TechnicalUser>) => details(row) },
  ];
  const filterFields = (
    <>
      {(Object.keys(filterOptions) as (keyof TechnicalFilters)[]).map((key) => (
        <TextField
          key={key}
          select
          size="small"
          label={t(key)}
          value={filters[key]}
          onChange={(event) => onFiltersChange({ ...filters, [key]: event.target.value })}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="">{t(key === "status" ? "defaultStatuses" : "all")}</MenuItem>
          {filterOptions[key].map((option) => (
            <MenuItem key={option} value={option}>
              {label(option)}
            </MenuItem>
          ))}
        </TextField>
      ))}
      {filtered && (
        <Button size="small" variant="text" onClick={() => onFiltersChange({ status: "", origin: "", walletAccess: "" })}>
          {t("clear")}
        </Button>
      )}
    </>
  );
  return (
    <Box>
      <PeopleHeader
        title={t("technicalUsers")}
        description={t("technicalDescription")}
        action={t("create")}
        actionIcon={<AddIcon />}
        onAction={onCreate}
      />
      <PeopleState status={status} technical onRetry={onRetry} onSignIn={onSignIn} />
      {(status === "loaded" || status === "empty") && (
        <>
          <ListToolbar filters={filterFields} count={t("technicalCount", { count: users.length })} mode={mode} onMode={setMode} />
          {status === "empty" ? (
            <Card sx={{ p: 4, textAlign: "center", "&:hover": { boxShadow: "none" } }}>
              <Typography variant="h2" sx={{ fontSize: "1.375rem", fontWeight: 700 }}>{t("noTechnical")}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {t("createPrompt")}
              </Typography>
            </Card>
          ) : users.length === 0 ? (
            <Card sx={{ p: 3, "&:hover": { boxShadow: "none" } }}>
              <Typography color="text.secondary">{t("noTechnicalMatches")}</Typography>
            </Card>
          ) : mode === "table" ? (
            <DataTable<TechnicalUser>
              aria-label={t("technicalUsers")}
              rows={users}
              columns={columns}
              getRowId={(row) => row.iamClientId}
              locale={locale}
              hideFooter
              onRowClick={onView ? ({ row }) => onView(row) : undefined}
            />
          ) : (
            <Box sx={cardGridSx} component="ul" aria-label={t("technicalUsers")} style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {users.map((user) => (
                <Card
                  component="li"
                  key={user.iamClientId}
                  sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2, cursor: onView ? "pointer" : "default" }}
                  onClick={onView ? () => onView(user) : undefined}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Identity name={user.name} secondary={<Box component="span" sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{user.iamClientId}</Box>} icon={<SmartToyOutlinedIcon />} size={44} />
                    {statusChip(user)}
                  </Stack>
                  <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">{t("walletAccess")}</Typography>
                    {wallet(user)}
                    <Tag>{label(user.viewerRole)}</Tag>
                  </Stack>
                  {onView && <Box sx={{ mt: "auto", ml: -1 }}>{details(user)}</Box>}
                </Card>
              ))}
            </Box>
          )}
          {selectedUser && (
            <Card component="section" aria-label={selectedUser.name} sx={{ p: { xs: 3, md: 3.5 }, mt: 3, "&:hover": { boxShadow: "none" } }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                <Identity name={selectedUser.name} secondary={selectedUser.description || t("descriptionMissing")} icon={<SmartToyOutlinedIcon />} size={52} wrap />
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  {statusChip(selectedUser)}
                  {onCloseDetails && (
                    <IconButton aria-label={t("close")} onClick={onCloseDetails} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
              <Box
                component="dl"
                sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, columnGap: 4, rowGap: 2, my: 3, borderTop: 1, borderColor: "divider", pt: 2.5 }}
              >
                {(
                  [
                    [t("clientId"), <Tag key="client" mono>{selectedUser.iamClientId}</Tag>],
                    [t("walletAccess"), wallet(selectedUser)],
                    [t("visibility"), <Tag key="visibility">{label(selectedUser.viewerRole)}</Tag>],
                    [t("origin"), selectedUser.origin ? label(selectedUser.origin) : "—"],
                    [
                      t("technicalRoles"),
                      selectedUser.roles?.length ? (
                        <Stack key="roles" direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 0.75 }}>
                          {selectedUser.roles.map((role) => <Tag key={role}>{role}</Tag>)}
                        </Stack>
                      ) : "—",
                    ],
                  ] as const
                ).map(([key, value]) => (
                  <Box key={key} sx={{ minWidth: 0 }}>
                    <Typography component="dt" variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.75 }}>
                      {key}
                    </Typography>
                    <Box component="dd" sx={{ m: 0, overflowWrap: "anywhere" }}>
                      {value}
                    </Box>
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t("serviceChecks")}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                {onEdit && (
                  <Button variant="outlined" sx={actionSx} onClick={() => onEdit(selectedUser)}>
                    {t("edit")}
                  </Button>
                )}
                {onRotate && (
                  <Button variant="outlined" sx={actionSx} onClick={() => onRotate(selectedUser)}>
                    {t("rotate")}
                  </Button>
                )}
                {onDelete && (
                  <Button variant="outlined" color="error" sx={actionSx} onClick={() => onDelete(selectedUser)}>
                    {t("delete")}
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
