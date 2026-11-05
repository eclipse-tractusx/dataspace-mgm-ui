# Helm chart

The Dataspace Management UI is deployed with the **product Helm chart** of the Dataspace Management, which contains all
components of the product (TRG 5.08). The chart is maintained in the leading repository:

- Chart: [eclipse-tractusx/dataspace-mgm-service/charts/dataspace-mgm](https://github.com/eclipse-tractusx/dataspace-mgm-service/tree/main/charts/dataspace-mgm)
- Values of the UI: `frontend.*` (image, `config.apiBaseUrl`, `config.environment`, ingress, resources, security context)
- Installation: [INSTALL.md](../INSTALL.md)

This repository therefore contains no chart of its own.

## NOTICE

This work is licensed under the [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

- SPDX-License-Identifier: CC-BY-4.0
- SPDX-FileCopyrightText: 2026 Contributors to the Eclipse Foundation
- Source URL: https://github.com/eclipse-tractusx/dataspace-mgm-ui/blob/main/charts/README.md
