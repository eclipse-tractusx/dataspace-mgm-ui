/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0: https://www.apache.org/licenses/LICENSE-2.0.
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are available under CC0-1.0; the human contributor reviewed the content.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Switch,
  Typography,
} from "@dataspace-mgm/ui-mui";
import { useTranslation } from "react-i18next";
import {
  buildBackendLoginUrl,
  getLoginMode,
  isSpecLoginResponseEnabled,
  MOCK_LOGIN_PATH,
  setLoginMode,
  setSpecLoginResponseEnabled,
} from "../../../core/mock-container";
import { IAM_NAMESPACE } from "./i18n";

const base = "https://iam.osp-a.example.org/auth/realms/CX-Central";
const metadata = [
  ["issuer", base],
  ["authorization_endpoint", `${base}/protocol/openid-connect/auth`],
  ["token_endpoint", `${base}/protocol/openid-connect/token`],
  ["jwks_uri", `${base}/protocol/openid-connect/certs`],
] as const;
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 2,
} as const;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ overflowWrap: "anywhere" }}>{value}</Typography>
    </Box>
  );
}

function LoadingReference() {
  const { t } = useTranslation(IAM_NAMESPACE);
  return (
    <Box role="status" aria-label={t("loading")} sx={{ mt: 3 }}>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {t("loading")}
      </Typography>
      <Box sx={grid} aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <Card key={item}>
            <CardContent>
              <Box
                sx={{
                  height: 12,
                  width: "40%",
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  mb: 2,
                }}
              />
              <Box
                sx={{
                  height: 16,
                  width: "100%",
                  bgcolor: "action.hover",
                  borderRadius: 1,
                }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

/** Portal IAM configuration and sign-in mode controls. */
export function IamConfiguration({ loading = false }: { loading?: boolean }) {
  const { t } = useTranslation(IAM_NAMESPACE);
  const [normalLogin, setNormalLogin] = useState(() => getLoginMode() === "normal");
  const [specResponse, setSpecResponse] = useState(() => isSpecLoginResponseEnabled());

  const handleOpenSignIn = () => {
    const returnTo = window.location.pathname || "/access-control/iam";
    if (normalLogin && !specResponse) {
      window.location.assign(buildBackendLoginUrl(returnTo));
      return;
    }
    window.location.assign(`${MOCK_LOGIN_PATH}?returnTo=${encodeURIComponent(returnTo)}`);
  };

  const sections = [
    {
      title: t("deployment"),
      fields: [
        [t("realmName"), t("realmValue")],
        [t("version"), "0.2.0"],
        [t("source"), t("sourceValue")],
      ],
    },
    {
      title: t("sessions"),
      fields: [
        [t("accessLifespan"), t("seconds300")],
        [t("idleTimeout"), t("seconds1800")],
        [t("maxLifespan"), t("seconds36000")],
      ],
    },
    {
      title: t("signIn"),
      fields: [
        [t("browserFlow"), "browser-ebw"],
        [t("directGrant"), t("denied")],
        [t("signing"), "RS256"],
      ],
    },
  ];
  return (
    <Box
      component="article"
      aria-labelledby="iam-title"
    >
      <Typography variant="overline" color="text.secondary">
        {t("overline")}
      </Typography>
      <Typography
        id="iam-title"
        variant="h1"
        component="h1"
        sx={{ fontSize: "clamp(2rem, 2vw + 1rem, 2.75rem)", mt: 0.5 }}
      >
        {t("title")}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        {t("subtitle")}
      </Typography>
      <Alert severity="info">
        <strong>{t("noticeTitle")}</strong>
        <br />
        {t("notice")}
      </Alert>
      {loading ? (
        <LoadingReference />
      ) : (
        <Stack spacing={3} sx={{ mt: 3 }}>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ flexWrap: "wrap" }}
            role="group"
            aria-label={t("sections")}
          >
            {(["discovery", "realm", "identity"] as const).map((section) => (
              <Button key={section} variant="outlined" href={`#iam-${section}`}>
                {t(section)}
              </Button>
            ))}
          </Stack>
          <Box
            component="section"
            id="iam-discovery"
            aria-labelledby="iam-discovery-title"
          >
            <Typography id="iam-discovery-title" variant="h2" component="h2">
              {t("discovery")}
            </Typography>
            <Typography color="text.secondary" sx={{ my: 2 }}>
              {t("discoveryDescription")}
            </Typography>
            <Box sx={grid}>
              {metadata.map(([label, value]) => (
                <Card key={label}>
                  <CardContent>
                    <Field label={label} value={value} />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
          <Box
            component="section"
            id="iam-realm"
            aria-labelledby="iam-realm-title"
          >
            <Typography id="iam-realm-title" variant="h2" component="h2">
              {t("realm")}
            </Typography>
            <Typography color="text.secondary" sx={{ my: 2 }}>
              {t("realmDescription")}
            </Typography>
            <Box sx={grid}>
              {sections.map((section) => (
                <Card key={section.title}>
                  <CardContent>
                    <Typography variant="h3" component="h3">
                      {section.title}
                    </Typography>
                    <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                      {section.fields.map(([label, value]) => (
                        <Field key={label} label={label} value={value} />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
          <Card
            component="section"
            id="iam-identity"
            aria-labelledby="iam-identity-title"
          >
            <CardContent>
              <Typography id="iam-identity-title" variant="h2" component="h2">
                {t("identity")}
              </Typography>
              <Box sx={{ ...grid, mt: 2 }}>
                <Field label={t("displayName")} value="EUDI-Wallet" />
                <Field label={t("alias")} value="ebw-connector" />
                <Field
                  label={t("authentication")}
                  value="private_key_jwt · ES256"
                />
              </Box>
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                {t("identityDescription")}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h3" component="h3">
                {t("loginControlsTitle")}
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                  <Typography>{t("normalLoginToggle")}</Typography>
                  <Switch
                    checked={normalLogin}
                    slotProps={{ input: { "aria-label": t("normalLoginToggle") } }}
                    onChange={(_, checked) => {
                      setNormalLogin(checked);
                      setLoginMode(checked ? "normal" : "eudi");
                    }}
                  />
                </Stack>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                  <Typography>{t("specResponseToggle")}</Typography>
                  <Switch
                    checked={specResponse}
                    slotProps={{ input: { "aria-label": t("specResponseToggle") } }}
                    onChange={(_, checked) => {
                      setSpecResponse(checked);
                      setSpecLoginResponseEnabled(checked);
                    }}
                  />
                </Stack>
                <Box>
                  <Button variant="outlined" onClick={handleOpenSignIn}>
                    {t("openSignIn")}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          <Alert severity="info">
            <strong>{t("openTitle")}</strong>
            <br />
            {t("open")}
          </Alert>
        </Stack>
      )}
    </Box>
  );
}
