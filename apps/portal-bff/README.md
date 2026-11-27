<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-fable-5-2)
-->

# Portal BFF

The server part of the portal (backend for frontend). It serves the built portal, signs persons in at the identity
provider (Keycloak, OpenID Connect authorization code flow with PKCE), keeps their tokens in a server-side session
and forwards `/api/**` to the Dataspace Management Service with the access token of the person. The browser only
holds an HttpOnly session cookie and never sees a token of the identity provider.

With the settings of an EBW-Connector it also runs the wallet step of the registration (`/ebw/**`, see
[Wallet step](#wallet-step)): it is the OpenID Connect client of the EBW-Connector and hands the verification
attestation to the portal.

It replaces the development stand-in `apps/portal/dev-bff/` in a hosted portal and serves the same contract to the
UI (`packages/identity-core`, `packages/core-http`).

It needs Node >= 24 and has no dependencies: Node runs the TypeScript sources directly, so there is no build step.

## Endpoints

| Endpoint | What it does |
|---|---|
| `GET /auth/login?return_to=<path>` | Starts the sign-in: 302 to the authorization endpoint with `state`, `nonce` and a PKCE S256 challenge. `return_to` must be a path of the portal; anything else becomes `/`. |
| `GET /auth/callback` | Checks `state` (once, and only in the browser that started the sign-in), exchanges the code, checks the ID token (signature, `iss`, `aud`, `azp`, `exp`, `iat`, `nonce`), creates the session and goes back to `return_to`. Errors are shown on a plain page; nothing from the query is reflected as markup. |
| `POST /auth/logout` | Ends the session, clears the cookie and ends the session at Keycloak with the refresh token (no browser redirect). Always 204. |
| `GET /me` | `{ id, name, username, company_id, bpn, permissions, csrf_token }` from the claims of the access token; 401 as Problem Details when nobody is signed in. `Cache-Control: no-store`. |
| `/api/**` | Forwarded to the backend with `Authorization: Bearer <access token>`. Write requests need the header `X-CSRF-Token` with the token from `/me` (403 otherwise). The access token is refreshed 30 seconds before it expires; when the identity provider refuses the refresh, the session ends and the answer is 401. Bodies are streamed in both directions, Server-Sent Events included. |
| `GET /ebw/attestation/start?return_to=<path>[&purpose=representation]` | Wallet step: 302 to the authorization endpoint of the EBW-Connector with `state`, `nonce`, a PKCE S256 challenge and the scopes of the purpose. Without `purpose` (or with `onboarding`): `openid profile representation company attestation`, the step of the registration. `representation`: `openid profile representation attestation`, the step of a person who joins a company with a mandate; the Business Wallet takes no part. Another word: 400. Needs a session; without one it goes to `/auth/login` first. |
| `GET /ebw/callback` | Wallet step: checks `state` (once, and only in the session that started the step), exchanges the code with `private_key_jwt`, checks the ID token, keeps the outcome in the session and goes back to `return_to` with the query parameter `wallet=returned`. |
| `POST /ebw/attestation` | Wallet step: the outcome, handed out once: `{ "status": "received", "attestation": "<JWS>" }`, `cancelled`, `failed` with a `reason`, or `none`. Needs the session and the header `X-CSRF-Token`. |
| `GET /ebw/jwks` | The public key of the client at the EBW-Connector, for its entry there (`jwksUri`). |
| `GET /config.json` | The runtime configuration of the portal, from `BFF_CONFIG_FILE`. |
| `GET /health` | `{"status":"ok"}`, for liveness and readiness probes. |
| everything else (`GET`, `HEAD`) | The files of the built portal; `index.html` for the routes of the app. |

Errors of the BFF are RFC 9457 Problem Details with the type `urn:portal-bff:problem:<type>`: `unauthorized` (401),
`csrf` and `forbidden-origin` (403), `not-found` (404), `method-not-allowed` (405), `bad-request` (400), `upstream`
(502), `identity-provider-unavailable` (503), `upstream-timeout` (504), `internal` (500).

## Settings

All settings come from the environment. They are checked at start; the BFF stops with a message that names every
wrong setting.

| Variable | Required | Example | Meaning |
|---|---|---|---|
| `BFF_PUBLIC_URL` | yes | `https://portal.example.org` | The address the browser uses, without a path. `https` is required, except for `localhost`. With `https` the cookies are `Secure` and carry the `__Host-` prefix. The redirect URI is `<BFF_PUBLIC_URL>/auth/callback`. |
| `BFF_ISSUER_URL` | yes | `https://iam.example.org/auth/realms/CX-Central` | Issuer of the identity provider; its discovery document is read from there. Must be `https` when the public URL is. |
| `BFF_CLIENT_ID` | yes | `portal-ui` | Client of the portal at the identity provider. |
| `BFF_CLIENT_SECRET` | no | | Only for a confidential client. Without it the client is public (PKCE only). |
| `BFF_BACKEND_URL` | yes | `http://dataspace-mgm-service:8000` | Address of the backend; `/api/...` is appended. |
| `BFF_STATIC_DIR` | yes | `/app/public` | Directory of the built portal (absolute path, contains `index.html`). Set in the image. |
| `BFF_CONFIG_FILE` | no | `/app/config/config.json` | File served as `/config.json` (absolute path). Without it, or when the file is missing, the answer is 404 and the portal uses its defaults (`api_base_url: /api`, which is right behind the BFF). Set in the image. |
| `BFF_PORT` | no | `8080` | Port to listen on. Default 8080. |
| `BFF_IDP_HINT` | no | `ebw-connector` | Sent as `kc_idp_hint`, so Keycloak goes straight to this identity provider. |
| `BFF_SESSION_IDLE_SECONDS` | no | `1800` | A session ends after this time without a request. Default 30 minutes. |
| `BFF_SESSION_MAX_SECONDS` | no | `36000` | A session ends after this time in any case. Default 10 hours. |
| `BFF_EBW_ISSUER_URL` | no | `https://ebw-connector.example.org` | Issuer of the EBW-Connector (C5-M1); its discovery document is read from there. Must be `https` when the public URL is. |
| `BFF_EBW_CLIENT_ID` | no | `osp-a-ui` | Client of the portal at the EBW-Connector. The verification attestation names it as `client_id`, so the backend has to allow it (`ATTESTATION_CLIENT_IDS` of C1-M2). |
| `BFF_EBW_KEY_FILE` | no | `/app/keys/ebw-client.pem` | Private key of that client (absolute path; PEM, EC P-256). A secret: mount it, never put it into the image. |

The three `BFF_EBW_*` settings belong together: set all three or none. Without them the wallet step is not connected,
every path under `/ebw/` answers 404, and the registration runs with supporting documents only.

The `config.json` of a portal behind the BFF needs `"api_base_url": "/api"` (same origin).

At the identity provider the client needs: standard flow, PKCE S256, the redirect URI
`<BFF_PUBLIC_URL>/auth/callback`, and access tokens that are JWTs with the claims of C2-M5 7.5 (`sub`, `given_name`,
`family_name`, `company_id`, `bpn`, `resource_access.portal-core.roles`).

## Wallet step

The registration with the Business Wallet needs a verification attestation of the EBW-Connector (FRAMEWORK 5.2
step 2, C1-M2 6.4). The EBW-Connector hands it only to a registered client, in the token response
(`ebw_attestation`, C5-M1 6.8). That client is the BFF:

```text
portal page          BFF                          EBW-Connector            wallets
    |  POST /ebw/attestation  -> { status: none }        |                       |
    |  GET /ebw/attestation/start?return_to=<page>       |                       |
    |------------------>|  302 /authorize (PKCE, state)  |                       |
    |                   |------------------------------->|  OpenID4VP: PID, mandate, LPID
    |                   |   302 /ebw/callback?code=...   |<--------------------->|
    |                   |<-------------------------------|                       |
    |                   |  POST /token (private_key_jwt) |                       |
    |                   |------------------------------->|                       |
    |                   |  id_token, ebw_attestation     |                       |
    |  302 <page>?wallet=returned                        |                       |
    |<------------------|                                |                       |
    |  POST /ebw/attestation  -> { status: received, attestation }              |
    |  POST /api/registration/applications { attestation, ... }                 |
```

The page leaves the portal for the step and continues after the return (`packages/c1-m2-core`, adapter
`wallet-attestation-bff.repository.ts`; `apps/portal/src/core/useWalletReturn.ts`).

The same step with `purpose=representation` serves a person who joins a company with a mandate (C2-M2): the page
Users of Access control passes the attestation to `POST /api/app-access/invitations/accept`
(`packages/c2-m2-core`, adapter `mandate-attestation-bff.repository.ts`). The client at the EBW-Connector is the same.

- The outcome is kept in the session and handed out once. A new step drops an outcome that was not collected.
- A step has to come back within 20 minutes. That is longer than a transaction lives at the EBW-Connector (10 minutes
  by default), so a step that expires there returns to the page as `failed` with `EXPIRED`.
- `reason` of a failed step is a failure reason of the EBW-Connector (C5-M1 6.2, for example `STATUS_UNAVAILABLE`,
  `UNTRUSTED_ISSUER`, `EXPIRED`) or a fixed word of the BFF: `connector_unavailable`, `connector_answer`,
  `no_attestation`, `no_code`, `iss`. A person who declines in the wallet (`WALLET_ERROR`) gives `cancelled`.
- The BFF checks the ID token of the step (signature, `iss`, `aud`, `exp`, `iat`, `nonce`) and that the attestation is
  a compact JWS of at most 16 KB. It does not check the attestation itself: the backend does (C1-M2 6.4), and it
  compares the person of the attestation with the signed-in person.
- The wallet step is independent of the sign-in: it works whether the person signed in with a wallet or in another
  way, and it never creates or changes a session.

At the EBW-Connector the client needs an entry in its `CLIENTS_FILE`:

```json
{ "clientId": "osp-a-ui", "name": "Portal UI of OSP A",
  "jwksUri": "https://portal.example.org/ebw/jwks",
  "redirectUris": ["https://portal.example.org/ebw/callback"],
  "scopes": ["openid", "profile", "representation", "company", "attestation"] }
```

`jwksUri` must be reachable from the EBW-Connector; where it is not, put the content of `GET /ebw/jwks` into the entry
as `jwks`. A key for the client:

```bash
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 -out ebw-client.pem
```

## Run it locally against Keycloak

With the test Keycloak and a backend of `dataspace-mgm-service` running (see `iam/README.md` there):

```bash
npx nx build portal
BFF_PUBLIC_URL=http://localhost:8081 \
BFF_ISSUER_URL=http://localhost:8080/auth/realms/CX-Central \
BFF_CLIENT_ID=portal-ui \
BFF_BACKEND_URL=http://localhost:8000 \
BFF_STATIC_DIR="$PWD/dist/apps/portal" \
BFF_PORT=8081 \
BFF_IDP_HINT=ebw-connector \
node apps/portal-bff/src/main.ts
```

Open `http://localhost:8081`. The portal sends you to Keycloak, which shows the form of the stand-in for the
EBW-Connector; the names and the password of the test persons are described in `iam/README.md` of the backend. The
public URL must be one of the redirect URIs of the client `portal-ui`.

Tests, type check and lint:

```bash
npx nx run-many -t test typecheck lint -p portal-bff
```

The integration test (`src/bff.integration.test.ts`) starts the BFF with an identity provider and a backend in the
same process (`src/testing/`), so it needs neither Keycloak nor a network.

## Container image

```bash
docker build -f apps/portal-bff/Dockerfile -t tractusx/dataspace-mgm-ui-bff:local .
docker run --rm -p 8080:8080 --read-only --cap-drop ALL \
  -e BFF_PUBLIC_URL=https://portal.example.org \
  -e BFF_ISSUER_URL=https://iam.example.org/auth/realms/CX-Central \
  -e BFF_CLIENT_ID=portal-ui \
  -e BFF_BACKEND_URL=http://dataspace-mgm-service:8000 \
  -v "$PWD/config.json:/app/config/config.json:ro" \
  tractusx/dataspace-mgm-ui-bff:local
```

The image contains Node, the sources of the BFF and the built portal. It runs as user 1000, writes nothing to the
file system and listens on 8080. TLS ends in front of it (ingress); `BFF_PUBLIC_URL` is the address in front.

## Limits

- **One replica.** Sessions and sign-ins that are under way live in the memory of the process
  (`src/session/session.store.ts`, marked `MINIMAL`). A restart signs everybody out, and a second replica does not
  know the sessions of the first. Upgrade path: a shared store with expiry (Redis or PostgreSQL) behind the same
  operations.
- **One address for the identity provider.** The browser and the BFF reach it at the same issuer URL. The same
  holds for the EBW-Connector of the wallet step.
- **The wallet step leaves the portal.** The person sees the page of the EBW-Connector with the QR code and comes
  back. Showing the wallet request inside the portal needs an interface of the EBW-Connector that C5-M1 does not
  have. An outcome that was not collected is lost with the session, like the session itself.
- **The portal is served at the root of its host**, not under a path.
- **Logout** ends the session of the realm. A session at an identity provider behind Keycloak (for example the
  EBW-Connector stand-in) stays, because ending it needs a browser redirect; the UI expects 204.
- **No `GET /config`** (branding, feature flags): the frontend spec names it, the UI does not call it yet.
- **No CORS.** The portal and the BFF are one origin; requests from other origins are not supported.
- **No rate limiting, compression, `Content-Security-Policy` or `Strict-Transport-Security`**: set them at the
  ingress. The BFF sets the same headers as `docker/nginx.conf` (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`).
- The error pages of a failed sign-in and of a wallet step that is no longer valid are English only.

## Layout

```text
src/
  main.ts              entry: settings, server, shutdown
  create-bff.ts        routes and wiring
  load-config.ts       settings from the environment
  routes/              /auth/*, /me, /api/**, /ebw/* (wallet step), static files
  oidc/                discovery, code and refresh grant, PKCE, JWT signature and ID token checks;
                       client of the EBW-Connector (ebw-connector.client.ts), its key and client assertion
  session/             session store, sign-ins under way, GET /me
  http/                cookies, CSRF, return_to, forwarded headers, responses
  data/, constants/    types and fixed values
  testing/             fake identity provider, EBW-Connector and backend for the tests (not in the image)
```
