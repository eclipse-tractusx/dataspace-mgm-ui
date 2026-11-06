/********************************************************************************
 * Copyright (c) 2026 Catena-X Automotive Network e.V.
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * AI Disclosure: This file was entirely AI-generated.
 * The AI-generated portions are made available under CC0-1.0 and not subject
 * to the project's license. The human contributor has reviewed and verified
 * that the code is correct.
 *
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: Claude Code (claude-opus-5-5)
 ********************************************************************************/

import { useState, type MouseEvent } from "react";
import {
  Avatar,
  Box,
  CircleIcon,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  LoginIcon,
  LogoutIcon,
  Menu,
  MenuItem,
  NotificationsOutlinedIcon,
  PersonOutlinedIcon,
  Stack,
  Tooltip,
  Typography,
  alpha,
  tractusx,
} from "@dataspace-mgm/ui-mui";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import type { NotificationAnemic } from "@dataspace-mgm/c11-m1-core";
import { useCoreModules, useSession } from "../../core/CoreModulesContext";
import { useInbox } from "./useInbox";

/**
 * Where a menu button sits, which decides where its menu opens: below it in the header, above it in the
 * phone's bottom bar, to its right (bottom-aligned) at the foot of the desktop sidebar.
 */
export type MenuPlacement = "header" | "bar" | "rail";

export const originsFor = (placement: MenuPlacement) => {
  switch (placement) {
    case "bar":
      return {
        anchorOrigin: { vertical: "top", horizontal: "right" } as const,
        transformOrigin: { vertical: "bottom", horizontal: "right" } as const,
      };
    case "rail":
      return {
        anchorOrigin: { vertical: "bottom", horizontal: "right" } as const,
        transformOrigin: { vertical: "bottom", horizontal: "left" } as const,
      };
    default:
      return {
        anchorOrigin: { vertical: "bottom", horizontal: "right" } as const,
        transformOrigin: { vertical: "top", horizontal: "right" } as const,
      };
  }
};

/** The 44 px square of every button on the sidebar. */
export const railButtonSx = {
  width: 44,
  height: 44,
  borderRadius: "8px",
  color: "text.secondary",
} as const;

function useMenu() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return {
    anchor,
    open: Boolean(anchor),
    show: (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget),
    hide: () => setAnchor(null),
  };
}

/**
 * Profile of the signed-in person, from the session of the BFF (GET /me through identity-core). Sign-in and sign-out
 * leave the app for the BFF; the UI has no login screen and never sees a token.
 */
export function ProfileMenu({
  placement = "header",
}: {
  placement?: MenuPlacement;
}) {
  const { t } = useTranslation();
  const menu = useMenu();
  const session = useSession();
  const { identity } = useCoreModules();
  const { pathname } = useLocation();
  const person = session.status === "signed-in" ? session.session : null;
  const signOut = () => {
    menu.hide();
    identity.logout.execute().then(() => window.location.assign("/"));
  };
  return (
    <>
      <Tooltip
        title={t("profile.label")}
        placement={placement === "rail" ? "right" : "bottom"}
      >
        <IconButton
          onClick={menu.show}
          aria-label={t("profile.label")}
          aria-haspopup="menu"
          aria-expanded={menu.open}
          aria-controls={menu.open ? `profile-menu-${placement}` : undefined}
          sx={placement === "rail" ? { ...railButtonSx, p: 0 } : { p: 0.5 }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: alpha(tractusx.orange, 0.15),
              color: tractusx.orange,
            }}
          >
            <PersonOutlinedIcon fontSize="small" />
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id={`profile-menu-${placement}`}
        anchorEl={menu.anchor}
        open={menu.open}
        onClose={menu.hide}
        {...originsFor(placement)}
      >
        <MenuItem
          disabled
          sx={{
            opacity: "1 !important",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            {person ? person.user.name : t("profile.guest")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {person
              ? (person.bpn ?? t("profile.noCompany"))
              : session.status === "loading"
                ? t("profile.checking")
                : t("profile.signedOut")}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemIcon>
            <PersonOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={t("profile.myProfile")}
            secondary={t("navigation.comingSoon")}
          />
        </MenuItem>
        {person ? (
          <MenuItem onClick={signOut}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("profile.signOut")} />
          </MenuItem>
        ) : (
          <MenuItem
            disabled={session.status === "loading"}
            onClick={() => identity.login.execute(pathname)}
          >
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("profile.signIn")} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

/**
 * The person's notifications (C11-M1), live: the badge counts the unread ones, the menu lists the newest. The bell sits
 * on the sidebar above "All services" on desktop and in the header on phones. The texts come from the `type` of a
 * notification (`notifications.types.<TYPE>`); C11-M1 stores no texts and no names.
 */
export function NotificationsMenu({
  placement = "header",
}: {
  placement?: MenuPlacement;
}) {
  const { t, i18n } = useTranslation();
  const menu = useMenu();
  const { state, live, arrivedLive } = useInbox();
  const unread = state.status === "ready" ? state.unread : 0;
  const time = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "short",
    timeStyle: "short",
  });
  const titleOf = (type: string) =>
    t(`notifications.types.${type}`, {
      defaultValue: t("notifications.unknownType", { type }),
    });
  const detailsOf = (notification: NotificationAnemic) =>
    [
      time.format(new Date(notification.createdAt)),
      notification.done === null
        ? null
        : notification.done
          ? t("notifications.taskDone")
          : t("notifications.taskOpen"),
      arrivedLive.has(notification.id) ? t("notifications.justNow") : null,
    ]
      .filter((part) => part !== null)
      .join(" · ");
  const label =
    unread > 0
      ? t("notifications.labelUnread", { count: unread })
      : t("notifications.label");
  return (
    <>
      <Tooltip
        title={label}
        placement={placement === "rail" ? "right" : "bottom"}
      >
        <IconButton
          onClick={menu.show}
          aria-label={label}
          aria-haspopup="menu"
          aria-expanded={menu.open}
          aria-controls={
            menu.open ? `notifications-menu-${placement}` : undefined
          }
          sx={
            placement === "rail"
              ? {
                  ...railButtonSx,
                  "&:hover": {
                    color: "text.primary",
                    bgcolor: alpha(tractusx.orange, 0.08),
                  },
                }
              : { color: "text.primary", "&:hover": { color: tractusx.orange } }
          }
        >
          <Box
            component="span"
            sx={{ position: "relative", display: "inline-flex" }}
          >
            <NotificationsOutlinedIcon />
            {unread > 0 ? (
              <Box
                component="span"
                data-testid="notifications-badge"
                aria-hidden
                sx={{
                  position: "absolute",
                  top: -6,
                  right: -9,
                  minWidth: 18,
                  height: 18,
                  px: 0.5,
                  borderRadius: "9px",
                  bgcolor: tractusx.orange,
                  color: "common.black",
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: "18px",
                  textAlign: "center",
                }}
              >
                {unread > 99 ? "99+" : unread}
              </Box>
            ) : null}
          </Box>
        </IconButton>
      </Tooltip>
      <Menu
        id={`notifications-menu-${placement}`}
        anchorEl={menu.anchor}
        open={menu.open}
        onClose={menu.hide}
        slotProps={{
          paper: { sx: { width: 380, maxWidth: "calc(100vw - 32px)" } },
        }}
        {...originsFor(placement)}
      >
        <MenuItem
          disabled
          sx={{
            opacity: "1 !important",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            {t("notifications.label")}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
            <CircleIcon
              sx={{
                fontSize: 8,
                color: live ? "success.main" : "text.disabled",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {state.status === "signed-out"
                ? t("notifications.signedOut")
                : live
                  ? t("notifications.live", { count: unread })
                  : t("notifications.connecting")}
            </Typography>
          </Stack>
        </MenuItem>
        <Divider />
        {state.status === "signed-out" ? (
          <MenuItem disabled>
            <ListItemText primary={t("notifications.signInToSee")} />
          </MenuItem>
        ) : null}
        {state.status === "loading" ? (
          <MenuItem disabled>
            <ListItemIcon>
              <CircularProgress size={16} />
            </ListItemIcon>
            <ListItemText primary={t("notifications.loading")} />
          </MenuItem>
        ) : null}
        {state.status === "failed" ? (
          <MenuItem disabled>
            <ListItemText
              primary={t("notifications.loadFailed")}
              secondary={state.message}
            />
          </MenuItem>
        ) : null}
        {state.status === "ready" && state.items.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary={t("notifications.nothingNew")} />
          </MenuItem>
        ) : null}
        {state.status === "ready"
          ? state.items.map((notification) => (
              <MenuItem
                key={notification.id}
                data-testid="notification-item"
                sx={{
                  alignItems: "flex-start",
                  whiteSpace: "normal",
                  bgcolor: arrivedLive.has(notification.id)
                    ? alpha(tractusx.orange, 0.08)
                    : undefined,
                }}
              >
                <ListItemIcon sx={{ mt: 0.75, minWidth: 20 }}>
                  <CircleIcon
                    sx={{
                      fontSize: 8,
                      color: notification.read
                        ? "transparent"
                        : tractusx.orange,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={titleOf(notification.type)}
                  secondary={detailsOf(notification)}
                  slotProps={{
                    primary: {
                      sx: { fontWeight: notification.read ? 400 : 700 },
                    },
                  }}
                />
              </MenuItem>
            ))
          : null}
      </Menu>
    </>
  );
}
