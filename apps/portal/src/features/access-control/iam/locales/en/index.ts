/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0: https://www.apache.org/licenses/LICENSE-2.0.
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are available under CC0-1.0; the human contributor reviewed the content.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/
export default {
  overline: "People and access",
  title: "Portal IAM configuration",
  subtitle: "Configuration and discovery metadata of the Portal IAM realm.",
  noticeTitle: "Read-only realm specification",
  notice:
    "Values below reflect the C2-M5 specification for the installation realm. Configuration changes are deployed through a versioned realm file.",
  sections: "Configuration sections",
  discovery: "OpenID discovery",
  realm: "Realm settings",
  identity: "Identity provider",
  discoveryDescription:
    "OpenID Connect Discovery 1.0 metadata endpoints of the realm (getOpenIdConfiguration).",
  realmDescription:
    "Realm configuration settings and token lifetimes defined by C2-M5.",
  deployment: "Deployment",
  sessions: "Sessions",
  signIn: "Sign-in and keys",
  realmName: "Realm",
  realmValue: "CX-Central",
  version: "Configuration version",
  source: "Source",
  sourceValue: "Versioned realm file",
  accessLifespan: "Access token lifespan",
  idleTimeout: "SSO idle timeout",
  maxLifespan: "SSO maximum lifespan",
  seconds300: "300 seconds",
  seconds1800: "1800 seconds",
  seconds36000: "36000 seconds",
  browserFlow: "Browser flow",
  directGrant: "Direct grant",
  denied: "Denied",
  signing: "Token signing",
  displayName: "Display name",
  alias: "Alias",
  authentication: "Authentication",
  identityDescription:
    "The EBW-Connector is the identity provider of the realm. Its address is configured at deployment.",
  loginControlsTitle: "Sign-in mode",
  normalLoginToggle: "Use standard backend login (/auth/login)",
  specResponseToggle: "Use spec-compliant /me session response",
  openSignIn: "Open sign-in",
  openTitle: "Realm deployment model",
  open: "Realm configuration changes are delivered through the versioned realm file rather than edited at runtime.",
  loading: "Loading discovery metadata…",
};
