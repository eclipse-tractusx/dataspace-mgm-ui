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

/**
 * The only place of the workspace that imports MUI (docs/architecture: UI styleguide).
 * Apps and feature libraries import from '@dataspace-mgm/ui-mui', never from '@mui/*', so the
 * component library stays replaceable. The theme implements the Eclipse Tractus-X Design Guidelines v1.0.
 */
export { ColorModeProvider, useColorMode } from './ColorModeProvider';
export { createPortalTheme, RADIUS, BUTTON_RADIUS } from './theme/theme';
export { tractusx, uiTokens, type BrandColors, type UiTokens } from './theme/palette';
export { fontFamily } from './theme/typography';
export { TractusXLogo } from './components/TractusXLogo';
export { BrandBackdrop } from './components/BrandBackdrop';

// MUI components, re-exported unchanged until a feature needs a Tractus-X specific wrapper.
export { default as AppBar } from '@mui/material/AppBar';
export { default as Avatar } from '@mui/material/Avatar';
export { default as Box } from '@mui/material/Box';
export { default as Button } from '@mui/material/Button';
export { default as Card } from '@mui/material/Card';
export { default as CardActions } from '@mui/material/CardActions';
export { default as CardContent } from '@mui/material/CardContent';
export { default as CardHeader } from '@mui/material/CardHeader';
export { default as Chip } from '@mui/material/Chip';
export { default as Container } from '@mui/material/Container';
export { default as Divider } from '@mui/material/Divider';
export { default as Drawer } from '@mui/material/Drawer';
export { default as Grid } from '@mui/material/Grid';
export { default as IconButton } from '@mui/material/IconButton';
export { default as Link } from '@mui/material/Link';
export { default as List } from '@mui/material/List';
export { default as ListItem } from '@mui/material/ListItem';
export { default as ListItemButton } from '@mui/material/ListItemButton';
export { default as ListItemIcon } from '@mui/material/ListItemIcon';
export { default as Paper } from '@mui/material/Paper';
export { default as Stack } from '@mui/material/Stack';
export { default as Toolbar } from '@mui/material/Toolbar';
export { default as Tooltip } from '@mui/material/Tooltip';
export { default as Typography } from '@mui/material/Typography';
export { alpha, useTheme, type SxProps, type Theme } from '@mui/material/styles';

// Icons used by the apps.
export { default as AdminPanelSettingsOutlinedIcon } from '@mui/icons-material/AdminPanelSettingsOutlined';
export { default as ArrowForwardIcon } from '@mui/icons-material/ArrowForward';
export { default as CircleIcon } from '@mui/icons-material/Circle';
export { default as DarkModeOutlinedIcon } from '@mui/icons-material/DarkModeOutlined';
export { default as GitHubIcon } from '@mui/icons-material/GitHub';
export { default as HomeOutlinedIcon } from '@mui/icons-material/HomeOutlined';
export { default as HubOutlinedIcon } from '@mui/icons-material/HubOutlined';
export { default as LightModeOutlinedIcon } from '@mui/icons-material/LightModeOutlined';
export { default as OpenInNewIcon } from '@mui/icons-material/OpenInNew';
export { default as SwapHorizOutlinedIcon } from '@mui/icons-material/SwapHorizOutlined';
export { default as TravelExploreOutlinedIcon } from '@mui/icons-material/TravelExploreOutlined';
