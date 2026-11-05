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
 * component library stays replaceable. Add a wrapper or re-export here when a feature needs one.
 */
export { ColorModeProvider, useColorMode } from './ColorModeProvider';
export { createPortalTheme } from './theme/theme';
export { tractusx, type BrandColors } from './theme/palette';
export { BrandStripe } from './components/BrandStripe';
export { DataspaceMark } from './components/DataspaceMark';

// Layout and content primitives, used as they are until a wrapper is needed.
export { default as AppBar } from '@mui/material/AppBar';
export { default as Box } from '@mui/material/Box';
export { default as Button } from '@mui/material/Button';
export { default as Card } from '@mui/material/Card';
export { default as CardContent } from '@mui/material/CardContent';
export { default as Chip } from '@mui/material/Chip';
export { default as Container } from '@mui/material/Container';
export { default as IconButton } from '@mui/material/IconButton';
export { default as Link } from '@mui/material/Link';
export { default as Stack } from '@mui/material/Stack';
export { default as Toolbar } from '@mui/material/Toolbar';
export { default as Tooltip } from '@mui/material/Tooltip';
export { default as Typography } from '@mui/material/Typography';
export { alpha, useTheme, type SxProps, type Theme } from '@mui/material/styles';

// Icons used by the apps.
export { default as DarkModeOutlinedIcon } from '@mui/icons-material/DarkModeOutlined';
export { default as LightModeOutlinedIcon } from '@mui/icons-material/LightModeOutlined';
export { default as HomeOutlinedIcon } from '@mui/icons-material/HomeOutlined';
export { default as TravelExploreOutlinedIcon } from '@mui/icons-material/TravelExploreOutlined';
export { default as HubOutlinedIcon } from '@mui/icons-material/HubOutlined';
export { default as SwapHorizOutlinedIcon } from '@mui/icons-material/SwapHorizOutlined';
export { default as AdminPanelSettingsOutlinedIcon } from '@mui/icons-material/AdminPanelSettingsOutlined';
export { default as OpenInNewIcon } from '@mui/icons-material/OpenInNew';
