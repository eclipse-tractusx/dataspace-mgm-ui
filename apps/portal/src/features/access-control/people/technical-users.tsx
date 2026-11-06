/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { Box, Button, Card, Stack, Typography } from "@dataspace-mgm/ui-mui";
import { useTranslation } from "react-i18next";
import { actionSx, PeopleHeader, PeopleState } from "./common";
import { PEOPLE_NS } from "./i18n";
import type { PeopleStatus, TechnicalFilters, TechnicalUser } from "./types";
import { inputSx } from "../input-styles";

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
  const filterOptions = {
    status: ["ACTIVE", "PENDING", "PENDING_DELETION", "INACTIVE", "DELETED"],
    origin: ["OWN", "SUBSCRIPTION"],
    walletAccess: ["NONE", "REQUESTED", "ACTIVE", "FAILED", "REMOVING"],
  } as const;
  const label = (value: string) => t(value, { defaultValue: value });
  return (
    <Box>
      <PeopleHeader
        title={t("technicalUsers")}
        description={t("technicalDescription")}
        action={t("create")}
        onAction={onCreate}
      />
      <PeopleState status={status} technical onRetry={onRetry} onSignIn={onSignIn} />
      {(status === "loaded" || status === "empty") && (
        <>
          <Stack
            direction="row"
            sx={{ alignItems: "flex-end", flexWrap: "wrap", gap: 2, mb: 2.5 }}
          >
            {(Object.keys(filterOptions) as (keyof TechnicalFilters)[]).map(
              (key) => (
                <Box
                  component="label"
                  key={key}
                  sx={{ display: "grid", gap: 0.75, minWidth: 180, fontWeight: 500 }}
                >
                  {t(key)}
                  <Box
                    component="select"
                    value={filters[key]}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      onFiltersChange({ ...filters, [key]: event.target.value })
                    }
                    sx={inputSx}
                  >
                    <option value="">
                      {t(key === "status" ? "defaultStatuses" : "all")}
                    </option>
                    {filterOptions[key].map((option) => (
                      <option key={option} value={option}>
                        {label(option)}
                      </option>
                    ))}
                  </Box>
                </Box>
              ),
            )}
            <Button
              variant="outlined"
              sx={{ ...actionSx, py: 1.25 }}
              onClick={() =>
                onFiltersChange({ status: "", origin: "", walletAccess: "" })
              }
            >
              {t("clear")}
            </Button>
          </Stack>
          {status === "empty" ? (
            <Card sx={{ p: 3 }}>
              <Typography variant="h2">{t("noTechnical")}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {t("createPrompt")}
              </Typography>
            </Card>
          ) : (
            <>
              <Card sx={{ overflowX: "auto" }}>
                <Box
                  component="table"
                  sx={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    "& th, & td": {
                      p: 2,
                      verticalAlign: "middle",
                      borderBottom: 1,
                      borderColor: "divider",
                    },
                    "& th": {
                      color: "text.secondary",
                      fontWeight: 600,
                    },
                    "& tbody tr:last-of-type td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "name",
                        "clientId",
                        "status",
                        "walletAccess",
                        "visibility",
                      ].map((key) => (
                        <th key={key} scope="col">
                          {t(key)}
                        </th>
                      ))}
                      <th scope="col">
                        <span className="sr-only">{t("details")}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.iamClientId}>
                        <td>{user.name}</td>
                        <td>{user.iamClientId}</td>
                        <td>
                          {label(user.status)}
                          {user.disabled && ` · ${t("DISABLED")}`}
                        </td>
                        <td>{label(user.walletAccess)}</td>
                        <td>{label(user.viewerRole)}</td>
                        <td>
                          {onView && (
                            <Button
                              variant="outlined"
                              sx={actionSx}
                              onClick={() => onView(user)}
                            >
                              {t("details")}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Box>
              </Card>
              {users.length === 0 && (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  {t("noTechnicalMatches")}
                </Typography>
              )}
            </>
          )}
          {selectedUser && (
            <Card sx={{ p: 3, mt: 3 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography variant="h2">{selectedUser.name}</Typography>
                {onCloseDetails && (
                  <Button
                    variant="outlined"
                    sx={actionSx}
                    onClick={onCloseDetails}
                  >
                    {t("close")}
                  </Button>
                )}
              </Stack>
              <Typography color="text.secondary" sx={{ my: 2 }}>
                {selectedUser.description || t("descriptionMissing")}
              </Typography>
              <Box component="dl" sx={{ display: "grid", gap: 1, my: 2.5 }}>
                {[
                  [t("clientId"), selectedUser.iamClientId],
                  [t("status"), label(selectedUser.status)],
                  [t("walletAccess"), label(selectedUser.walletAccess)],
                  [
                    t("origin"),
                    selectedUser.origin ? label(selectedUser.origin) : "—",
                  ],
                  [t("visibility"), label(selectedUser.viewerRole)],
                  [t("technicalRoles"), selectedUser.roles?.join(", ") || "—"],
                ].map(([key, value]) => (
                  <Box key={key} sx={{ display: "flex", flexWrap: "wrap", gap: 1, overflowWrap: "anywhere" }}>
                    <Typography component="dt" sx={{ fontWeight: "bold" }}>
                      {key}:
                    </Typography>
                    <Typography component="dd" sx={{ m: 0 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {t("serviceChecks")}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                {onEdit && (
                  <Button
                    variant="outlined"
                    sx={actionSx}
                    onClick={() => onEdit(selectedUser)}
                  >
                    {t("edit")}
                  </Button>
                )}
                {onRotate && (
                  <Button
                    variant="outlined"
                    sx={actionSx}
                    onClick={() => onRotate(selectedUser)}
                  >
                    {t("rotate")}
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outlined"
                    sx={actionSx}
                    onClick={() => onDelete(selectedUser)}
                  >
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
