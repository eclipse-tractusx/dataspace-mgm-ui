# Installation

The Dataspace Management UI is installed together with the Dataspace Management Service through the **product Helm
chart** of the Dataspace Management (TRG 5.08), maintained in the leading repository
[dataspace-mgm-service](https://github.com/eclipse-tractusx/dataspace-mgm-service).

- [Install with Helm](#install-with-helm)
- [Configure the UI](#configure-the-ui)
- [Run the container image](#run-the-container-image)
- [Local development](#local-development)
- [Troubleshooting](#troubleshooting)

## Install with Helm

Prerequisites: Kubernetes 1.29+, Helm 3.8.0+, an ingress controller if the UI is exposed through an ingress.

```shell
helm repo add tractusx-dev https://eclipse-tractusx.github.io/charts/dev
helm repo update
helm install dataspace-mgm tractusx-dev/dataspace-mgm --namespace dataspace-mgm --create-namespace
helm test dataspace-mgm --namespace dataspace-mgm
```

The complete installation guide, including upgrade and uninstall, is in the
[INSTALL.md of the leading repository](https://github.com/eclipse-tractusx/dataspace-mgm-service/blob/main/INSTALL.md).

## Configure the UI

The image is built once and configured at runtime through `/config.json`. In the Helm chart:

| Value | Meaning | Default |
|---|---|---|
| `frontend.enabled` | Install the UI | `true` |
| `frontend.image.repository`, `frontend.image.tag` | Image on DockerHub | `tractusx/dataspace-mgm-ui`, `appVersion` of the chart |
| `frontend.config.apiBaseUrl` | Address of the backend API as seen by the browser | the backend ingress host, else `http://localhost:8000` |
| `frontend.config.environment` | `local`, `dev`, `int` or `prod` | `prod` |
| `frontend.ingress.*` | Ingress class, hosts, TLS, annotations | disabled |

UI and API must share the same registrable domain (session cookie `SameSite=Lax`), and the API must allow the origin of
the UI in CORS with credentials. All values are listed in the
[chart README](https://github.com/eclipse-tractusx/dataspace-mgm-service/blob/main/charts/dataspace-mgm/README.md).

## Run the container image

```shell
cat > config.json <<'JSON'
{ "api_base_url": "http://localhost:8000", "environment": "local" }
JSON
docker run --rm -p 8080:8080 --read-only --tmpfs /tmp \
  -v "$PWD/config.json:/usr/share/nginx/html/config/config.json:ro" \
  tractusx/dataspace-mgm-ui:latest
# -> http://localhost:8080
```

Build the image yourself (`APP` selects the app of the workspace, default `portal`):

```shell
docker build --build-arg APP=portal -t tractusx/dataspace-mgm-ui:local .
```

## Local development

Prerequisites: Node.js 24 LTS and npm.

```shell
npm ci
npx nx serve portal          # development server with hot reload
npx nx test <project>        # unit tests (Vitest)
npx nx e2e portal-e2e        # end-to-end tests (Playwright)
npx nx run-many -t lint      # lint, including the module boundaries
```

In development the API address comes from `apps/portal/.env.local` (`VITE_API_BASE_URL`, git-ignored). With
`VITE_USE_MOCKS=true` the UI runs against MSW mocks of the backend.

## Troubleshooting

| Problem | Solution |
|---|---|
| The page shows "The portal could not start" | `/config.json` is missing or invalid; check the ConfigMap and `frontend.config.apiBaseUrl` (must be a URL). |
| Calls to the API fail with CORS errors | Allow the UI origin in the CORS configuration of the API, with credentials. |
| You are signed out after every reload | UI and API are on different registrable domains, so the session cookie is not sent. |
| The pod does not start with a read-only root file system | `/tmp` must be writable (`emptyDir`), as set by the Helm chart. |

## NOTICE

This work is licensed under the [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

- SPDX-License-Identifier: CC-BY-4.0
- SPDX-FileCopyrightText: 2026 Contributors to the Eclipse Foundation
- Source URL: https://github.com/eclipse-tractusx/dataspace-mgm-ui/blob/main/INSTALL.md
