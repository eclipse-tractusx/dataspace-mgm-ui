/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 */
import {
  Alert,
  Box,
  Button,
  Card,
  LoginIcon,
  Stack,
  Typography,
} from "@dataspace-mgm/ui-mui";
import { useTranslation } from "react-i18next";
import { PEOPLE_NS } from "./i18n";
import type { PeopleStatus } from "./types";

export const actionSx = { px: 2, py: 1 };
export const gridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 2,
};

export function PeopleHeader({
  title,
  description,
  action,
  onAction,
}: {
  title: string;
  description?: string;
  action: string;
  onAction?: () => void;
}) {
  const { t } = useTranslation(PEOPLE_NS);
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="overline" color="text.secondary">
        {t("overline")}
      </Typography>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{ fontSize: "clamp(2rem, 2vw + 1rem, 2.75rem)", mt: 0.5 }}
          >
            {title}
          </Typography>
          {description && (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {description}
            </Typography>
          )}
        </Box>
        {onAction && (
          <Button variant="contained" sx={actionSx} onClick={onAction}>
            {action}
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export function PeopleState({
  status,
  technical,
  onRetry,
  onSignIn,
}: {
  status: PeopleStatus;
  technical?: boolean;
  onRetry?: () => void;
  onSignIn?: () => void;
}) {
  const { t } = useTranslation(PEOPLE_NS);
  if (status === "loading") {
    return (
      <Box
        role="status"
        aria-label={t(technical ? "loadingTechnical" : "loadingUsers")}
      >
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t(technical ? "loadingTechnical" : "loadingUsers")}
        </Typography>
        <Box sx={technical ? {} : gridSx} aria-hidden="true">
          {Array.from({ length: technical ? 2 : 3 }, (_, i) => (
            <Card
              key={i}
              sx={{ p: 3, mb: technical ? 1 : 0, bgcolor: "action.hover" }}
            >
              <Stack direction={technical ? "row" : "column"} sx={{ gap: 2 }}>
                {[1, 2, 3].map((line) => (
                  <Box
                    key={line}
                    sx={{
                      height: 12,
                      width: technical ? "25%" : line === 1 ? "80%" : "50%",
                      bgcolor: "action.selected",
                      borderRadius: 1,
                    }}
                  />
                ))}
              </Stack>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }
  if (status === "loaded" || status === "empty") {
    return null;
  }
  const key =
    status === "conflict"
      ? technical
        ? "conflictTechnical"
        : "conflictUsers"
      : status;
  return (
    <Stack sx={{ alignItems: "flex-start", gap: 2 }}>
      <Alert
        severity={
          status === "signed-out"
            ? "info"
            : status === "conflict" && technical
              ? "warning"
              : "error"
        }
        action={
          status === "signed-out" && onSignIn ? (
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={onSignIn}
            >
              {t("signIn")}
            </Button>
          ) : undefined
        }
      >
        {t(key)}
      </Alert>
      {onRetry && (status === "error" || status === "conflict") && (
        <Button variant="outlined" sx={actionSx} onClick={onRetry}>
          {t("retry")}
        </Button>
      )}
    </Stack>
  );
}
