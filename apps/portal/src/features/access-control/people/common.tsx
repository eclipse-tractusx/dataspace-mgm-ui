/*
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * AI Disclosure: This file was entirely AI-generated; the human contributor has reviewed it.
 * Assisted-By: OpenAI GPT-6.1 Terra
 * Assisted-By: Claude Code (claude-opus-5-5)
 */
import type { ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  LoginIcon,
  Skeleton,
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
  actionIcon,
  onAction,
}: {
  title: string;
  description?: string;
  action: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
}) {
  const { t } = useTranslation(PEOPLE_NS);
  return (
    <Stack
      direction="row"
      useFlexGap
      sx={{ justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2, mb: 3 }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="overline"
          sx={{ display: "block", color: "text.secondary", fontWeight: 700, letterSpacing: "0.16em", lineHeight: 1.6 }}
        >
          {t("overline")}
        </Typography>
        <Typography
          variant="h1"
          sx={{ fontSize: "clamp(2rem, 2vw + 1rem, 2.75rem)", fontWeight: 800, mt: 0.5 }}
        >
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 640 }}>
            {description}
          </Typography>
        )}
      </Box>
      {onAction && (
        <Button variant="contained" startIcon={actionIcon} sx={actionSx} onClick={onAction}>
          {action}
        </Button>
      )}
    </Stack>
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
        <Card sx={{ p: 2, "&:hover": { boxShadow: "none" } }} aria-hidden="true">
          {Array.from({ length: 3 }, (_, i) => (
            <Stack key={i} direction="row" spacing={2} sx={{ alignItems: "center", py: 1.25 }}>
              <Skeleton variant="circular" width={36} height={36} />
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="20%" />
              <Skeleton variant="rounded" width={72} height={24} sx={{ ml: "auto" }} />
            </Stack>
          ))}
        </Card>
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
