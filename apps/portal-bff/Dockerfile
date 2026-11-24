#################################################################################
#  Copyright (c) 2026 Contributors to the Eclipse Foundation
#
#  See the NOTICE file(s) distributed with this work for additional
#  information regarding copyright ownership.
#
#  This program and the accompanying materials are made available under the
#  terms of the Apache License, Version 2.0 which is available at
#  https://www.apache.org/licenses/LICENSE-2.0.
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#  License for the specific language governing permissions and limitations
#  under the License.
#
#  AI Disclosure: This file was entirely AI-generated.
#  The AI-generated portions are made available under CC0-1.0 and not subject
#  to the project's license. The human contributor has reviewed and verified
#  that the code is correct.
#
#  SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
#  Assisted-By: Claude Code (claude-fable-5-2)
#################################################################################

# Container image of the portal together with its server part (apps/portal-bff): the BFF serves the built portal,
# signs persons in at the identity provider and forwards /api/** to the backend. Settings: apps/portal-bff/README.md.
# Build (from the root of the repository):
#   docker build -f apps/portal-bff/Dockerfile -t tractusx/dataspace-mgm-ui-bff:local .
# Run:
#   docker run --rm -p 8080:8080 --read-only --cap-drop ALL \
#     -e BFF_PUBLIC_URL=https://portal.example.org \
#     -e BFF_ISSUER_URL=https://iam.example.org/auth/realms/CX-Central \
#     -e BFF_CLIENT_ID=portal-ui \
#     -e BFF_BACKEND_URL=http://dataspace-mgm-service:8000 \
#     -v "$PWD/config.json:/app/config/config.json:ro" tractusx/dataspace-mgm-ui-bff:local

# ---- Build stage: the portal (nx build portal) and the sources of the BFF without its tests ----
FROM node:24-alpine AS build
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
# The image serves the real service, so the application review calls it too (src/core/review-container.ts).
# Vite reads the value at build time; --build-arg VITE_REVIEW_API=mock builds the review on example data.
ARG VITE_REVIEW_API=live
RUN npx nx build portal --configuration=production \
    && mkdir -p /out/public /out/src \
    && cp -R dist/apps/portal/. /out/public/ \
    && cp -R apps/portal-bff/src/. /out/src/ \
    && find /out/src -name '*.test.ts' -delete \
    && rm -rf /out/src/testing \
    && printf '{"type":"module","private":true}\n' > /out/package.json

# ---- Runtime stage: Node only. The BFF has no dependencies and Node runs its TypeScript directly, so the image
# needs neither node_modules nor a package manager. ----
FROM node:24-alpine
# Take the security fixes Alpine has published since the base image was built, and remove the package managers: they
# are not used at runtime and are a frequent source of findings in image scans.
RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
              /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn-*
WORKDIR /app
COPY --from=build /out/package.json /app/package.json
COPY --from=build /out/src /app/src
COPY --from=build /out/public /app/public
# config.json is mounted at runtime into /app/config, never baked in. Nothing is written to the file system, so the
# container runs with a read-only root file system.
ENV BFF_PORT=8080 \
    BFF_STATIC_DIR=/app/public \
    BFF_CONFIG_FILE=/app/config/config.json
# The user "node" of the base image (TRG 4.03: not root).
USER 1000
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1
CMD ["node", "src/main.ts"]
