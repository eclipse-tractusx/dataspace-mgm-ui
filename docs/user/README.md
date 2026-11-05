# User manual

End user manual of the **Dataspace Management UI**, the portal of an onboarding service provider (OSP) in a dataspace
such as Catena-X (TRG 1.07).

> The UI is being built. This manual describes the functions as specified for the first release and will be completed
> with screenshots as the functions become available.

## Contents

- [Roles](#roles)
- [Sign in](#sign-in)
- [Register a company](#register-a-company)
- [Review applications (OSP staff)](#review-applications-osp-staff)
- [Manage your company](#manage-your-company)
- [Notifications](#notifications)
- [Supported browsers](#supported-browsers)
- [Help and support](#help-and-support)

## Roles

What you can do depends on your portal role, assigned in the Portal IAM of the OSP:

| Role | For | Can |
|---|---|---|
| Applicant | Every new account | Register a company and follow the application |
| Company Admin | Administrator of a company | Manage the company profile, people and their roles, technical users, connectors and subscriptions |
| IT Admin | Technical administrator of a company | Manage technical users and connectors |
| Member | Employee of a company | Use the portal and the apps the company subscribed to |
| OSP Reviewer | Staff of the OSP | Review and decide on applications |
| OSP Admin | Staff of the OSP | Administer the portal of the OSP, approve offers |

## Sign in

There are no passwords. You sign in with your **EUDI Wallet** (the European digital identity wallet on your phone):

1. Open the portal of your OSP and choose **Sign in**.
2. Scan the QR code with your EUDI Wallet, or open the link on your phone.
3. Confirm in the wallet that your identity data (PID) is shared with the OSP.

At your first sign-in an account is created for you with the role **Applicant**.

## Register a company

To register your company you need your EUDI Wallet and access to the **Business Wallet** of your company, which holds
the company data (LPID) and a mandate that allows you to act for the company.

1. Choose **Register company**.
2. **Connect the wallets:** scan the QR code with your EUDI Wallet and confirm your identity and your mandate, then
   confirm the company data in the Business Wallet.
3. **Company data:** the data verified from the Business Wallet is shown read-only. Complete the missing data and the
   company roles you request.
4. **Submit:** accept the terms of the OSP and of the dataspace and submit the application.
5. **Review:** the application is now in review by the OSP. The page shows the current status and updates by itself.
   Until the decision you can withdraw the application.

When the application is approved, the OSP registers your company in the dataspace: the company gets its Business
Partner Number (BPN), a dataspace wallet and its credentials. You become the **Company Admin** of your company.

## Review applications (OSP staff)

With the role **OSP Reviewer** you see the list of applications in review:

1. Open an application to see the company data, the result of the automatic pre-check (including the check whether the
   company is already registered with an OSP) and the verified data from the wallets.
2. **Approve** or **decline** the application. Nobody can decide on an application they submitted themselves; depending
   on the configuration of the OSP, an approval needs a second person (four-eyes principle).

## Manage your company

With the role **Company Admin** you can:

- view and update the **company profile**,
- invite **people**, bind them to the company and assign portal roles and app roles,
- create **technical users** for connectors and programs, optionally with access to the dataspace wallet,
- register **connectors** of the company,
- subscribe to **apps and services** offered in the dataspace.

## Notifications

The notification inbox shows your notifications, for example when an application was decided or a subscription was activated.
New notifications appear without reloading the page.

## Supported browsers

The current versions of Chrome, Edge, Firefox and Safari. Browsers that are not supported will be listed here.

## Help and support

For questions about your account or your company, contact the support of your OSP. For questions about the software,
contact the Eclipse Tractus-X community on the [dev mailing list](https://accounts.eclipse.org/mailing-list/tractusx-dev).

## NOTICE

This work is licensed under the [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

- SPDX-License-Identifier: CC-BY-4.0
- SPDX-FileCopyrightText: 2026 Contributors to the Eclipse Foundation
- Source URL: https://github.com/eclipse-tractusx/dataspace-mgm-ui/blob/main/docs/user/README.md
