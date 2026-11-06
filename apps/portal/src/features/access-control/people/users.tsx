/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import { Box, Button, Card, Stack, Typography } from "@dataspace-mgm/ui-mui";
import { useTranslation } from "react-i18next";
import { actionSx, gridSx, PeopleHeader, PeopleState } from "./common";
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
  const name = (user: CompanyUser) =>
    [user.givenName, user.familyName].filter(Boolean).join(" ") ||
    t("nameUnavailable");
  return (
    <Box>
      <PeopleHeader
        title={t("users")}
        description={companyName}
        action={t("invite")}
        onAction={onInvite}
      />
      <PeopleState status={status} onRetry={onRetry} onSignIn={onSignIn} />
      {status === "empty" && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h2">{t("noUsers")}</Typography>
          <Typography sx={{ my: 2 }}>{t("invitePrompt")}</Typography>
          {onInvite && (
            <Button variant="contained" sx={actionSx} onClick={onInvite}>
              {t("invite")}
            </Button>
          )}
        </Card>
      )}
      {status === "loaded" && (
        <>
          <Stack
            direction="row"
            sx={{ flexWrap: "wrap", gap: 1, mb: 2.5 }}
            role="group"
            aria-label={t("statusFilter")}
          >
            {(["", "ACTIVE", "DISABLED", "REMOVED"] as const).map((value) => (
              <Button
                key={value}
                size="small"
                sx={actionSx}
                variant={filter === value ? "contained" : "outlined"}
                aria-pressed={filter === value}
                onClick={() => onFilterChange(value)}
              >
                {t(value || "defaultUsers")}
              </Button>
            ))}
          </Stack>
          {users.length === 0 ? (
            <Typography color="text.secondary">{t("noUserMatches")}</Typography>
          ) : (
            <Box sx={gridSx}>
              {users.map((user) => (
                <Card
                  key={user.userId}
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h2">{name(user)}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {user.portalRoles.join(", ") || t("noRoles")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {t(user.status, { defaultValue: user.status })}
                    </Typography>
                  </Box>
                  {onView && (
                    <Box>
                      <Button
                        variant="outlined"
                        sx={actionSx}
                        onClick={() => onView(user)}
                      >
                        {t("details")}
                      </Button>
                    </Box>
                  )}
                </Card>
              ))}
            </Box>
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
                <Typography variant="h2">{name(selectedUser)}</Typography>
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
              <Box component="dl" sx={{ ...gridSx, my: 2.5 }}>
                {[
                  [t("userId"), selectedUser.userId],
                  [
                    t("status"),
                    t(selectedUser.status, {
                      defaultValue: selectedUser.status,
                    }),
                  ],
                  [
                    t("roles"),
                    selectedUser.portalRoles.join(", ") || t("noRoles"),
                  ],
                  [t("joinedVia"), selectedUser.joinedVia ?? "—"],
                ].map(([label, value]) => (
                  <Box key={label}>
                    <Typography
                      component="dt"
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: "bold", mb: 0.5 }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      component="dd"
                      sx={{ m: 0, overflowWrap: "anywhere" }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                {onEditRoles && (
                  <Button
                    variant="outlined"
                    sx={actionSx}
                    onClick={() => onEditRoles(selectedUser)}
                  >
                    {t("editRoles")}
                  </Button>
                )}
                {onRemove && (
                  <Button
                    variant="outlined"
                    sx={actionSx}
                    onClick={() => onRemove(selectedUser)}
                  >
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
