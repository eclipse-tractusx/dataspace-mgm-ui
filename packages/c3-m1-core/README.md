<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 AI Disclosure: This file was entirely AI-generated.
 The AI-generated portions are made available under CC0-1.0 and not subject
 to the project's license. The human contributor has reviewed and verified
 that the content is correct.

 SPDX-License-Identifier: CC-BY-4.0 AND CC0-1.0
 Assisted-By: Claude Code (claude-opus-5-5)
-->

# @dataspace-mgm/c3-m1-core

Framework-free core package of the backend module **C3-M1 Company Profile**
([spec](../../specs/c3-m1/openapi.yaml), copied from
[portal-backend-spec](https://github.com/tx-arena-events/portal-backend-spec/tree/main/C3-M1-CompanyProfile)).
It is the example of [docs/developers/integrate-a-backend-module.md](../../docs/developers/integrate-a-backend-module.md).

## Use cases

| Use case | Operation | Result |
|---|---|---|
| `getOwnCompany.execute(companyId)` | `GET /companies/{companyId}` (`getCompany`, permission `view_company`, scope `company`) | `found` with the company, `no-company`, `not-found`, `failed` with the HTTP status and Problem Details type |

## Use it

```ts
import { C3M1_BASE_PATH, createC3M1Module } from '@dataspace-mgm/c3-m1-core';

const c3m1 = createC3M1Module({ baseUrl: `${apiBaseUrl}${C3M1_BASE_PATH}` });
const result = await c3m1.getOwnCompany.execute(session.companyId);
```

Tests use `@dataspace-mgm/c3-m1-core/testing` (`InMemoryCompanyRepository`, `OSP_A_COMPANY`).

## Update the spec

```bash
cp ../dataspace-mgm-service/spec/C3-M1-CompanyProfile/openapi.yaml specs/c3-m1/openapi.yaml
npx nx run c3-m1-core:generate-api     # rewrites src/generated/, never edit it by hand
npx nx run c3-m1-core:check-api        # fails when the generated types are not up to date
```

## Layout

`domain/` (anemic, port, in-memory adapter) ← `application/` (use cases) and `infrastructure/` (generated client,
mapper, HTTP adapter); only `index.ts` imports `infrastructure/`.
