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
export { SpaceGlow } from './components/SpaceGlow';

// MUI components, re-exported unchanged until a feature needs a Tractus-X specific wrapper.
export { default as Alert } from '@mui/material/Alert';
export { default as AppBar } from '@mui/material/AppBar';
export { default as Avatar } from '@mui/material/Avatar';
export { default as BottomNavigation } from '@mui/material/BottomNavigation';
export { default as BottomNavigationAction } from '@mui/material/BottomNavigationAction';
export { default as Box } from '@mui/material/Box';
export { default as Button } from '@mui/material/Button';
export { default as ButtonBase } from '@mui/material/ButtonBase';
export { default as Card } from '@mui/material/Card';
export { default as CardActionArea } from '@mui/material/CardActionArea';
export { default as CardActions } from '@mui/material/CardActions';
export { default as CardContent } from '@mui/material/CardContent';
export { default as CardHeader } from '@mui/material/CardHeader';
export { default as Chip } from '@mui/material/Chip';
export { default as CircularProgress } from '@mui/material/CircularProgress';
export { default as Collapse } from '@mui/material/Collapse';
export { default as Container } from '@mui/material/Container';
export { default as Dialog } from '@mui/material/Dialog';
export { default as DialogActions } from '@mui/material/DialogActions';
export { default as DialogContent } from '@mui/material/DialogContent';
export { default as DialogContentText } from '@mui/material/DialogContentText';
export { default as DialogTitle } from '@mui/material/DialogTitle';
export { default as Divider } from '@mui/material/Divider';
export { default as Drawer } from '@mui/material/Drawer';
export { default as FormControl } from '@mui/material/FormControl';
export { default as Grid } from '@mui/material/Grid';
export { default as IconButton } from '@mui/material/IconButton';
export { default as InputLabel } from '@mui/material/InputLabel';
export { default as Link } from '@mui/material/Link';
export { default as List } from '@mui/material/List';
export { default as ListItem } from '@mui/material/ListItem';
export { default as ListItemButton } from '@mui/material/ListItemButton';
export { default as ListItemIcon } from '@mui/material/ListItemIcon';
export { default as ListItemText } from '@mui/material/ListItemText';
export { default as Menu } from '@mui/material/Menu';
export { default as MenuItem } from '@mui/material/MenuItem';
export { default as Paper } from '@mui/material/Paper';
export { default as Slide } from '@mui/material/Slide';
export { default as Popover } from '@mui/material/Popover';
export { default as Select, type SelectChangeEvent } from '@mui/material/Select';
export { default as Skeleton } from '@mui/material/Skeleton';
export { default as Snackbar } from '@mui/material/Snackbar';
export { default as Stack } from '@mui/material/Stack';
export { default as Switch } from '@mui/material/Switch';
export { default as Toolbar } from '@mui/material/Toolbar';
export { default as Tooltip } from '@mui/material/Tooltip';
export { default as Typography } from '@mui/material/Typography';
export { default as useMediaQuery } from '@mui/material/useMediaQuery';
export { default as AlertTitle } from '@mui/material/AlertTitle';
export { default as Badge } from '@mui/material/Badge';
export { default as Checkbox } from '@mui/material/Checkbox';
export { default as FormControlLabel } from '@mui/material/FormControlLabel';
export { default as InputAdornment } from '@mui/material/InputAdornment';
// Added for the onboarding proof of concept (C1-M2 Registration).
export { default as Accordion } from '@mui/material/Accordion';
export { default as AccordionDetails } from '@mui/material/AccordionDetails';
export { default as AccordionSummary } from '@mui/material/AccordionSummary';
export { default as FormGroup } from '@mui/material/FormGroup';
export { default as Tab } from '@mui/material/Tab';
export { default as Table } from '@mui/material/Table';
export { default as TableBody } from '@mui/material/TableBody';
export { default as TableCell } from '@mui/material/TableCell';
export { default as TableContainer } from '@mui/material/TableContainer';
export { default as TableHead } from '@mui/material/TableHead';
export { default as TablePagination } from '@mui/material/TablePagination';
export { default as TableRow } from '@mui/material/TableRow';
export { default as Tabs } from '@mui/material/Tabs';
export { default as TextField } from '@mui/material/TextField';
// Added for the onboarding proof of concept (C1-M2 Registration).
export { default as Accordion } from '@mui/material/Accordion';
export { default as AccordionDetails } from '@mui/material/AccordionDetails';
export { default as AccordionSummary } from '@mui/material/AccordionSummary';
export { default as Checkbox } from '@mui/material/Checkbox';
export { default as DialogActions } from '@mui/material/DialogActions';
export { default as DialogTitle } from '@mui/material/DialogTitle';
export { default as FormControlLabel } from '@mui/material/FormControlLabel';
export { default as FormGroup } from '@mui/material/FormGroup';
export { default as Snackbar } from '@mui/material/Snackbar';
export { default as Tab } from '@mui/material/Tab';
export { default as Table } from '@mui/material/Table';
export { default as TableBody } from '@mui/material/TableBody';
export { default as TableCell } from '@mui/material/TableCell';
export { default as TableContainer } from '@mui/material/TableContainer';
export { default as TableHead } from '@mui/material/TableHead';
export { default as TableRow } from '@mui/material/TableRow';
export { default as Tabs } from '@mui/material/Tabs';
export { default as TextField } from '@mui/material/TextField';
export { default as FormControlLabel } from '@mui/material/FormControlLabel';
export { default as FormGroup } from '@mui/material/FormGroup';
export { alpha, useTheme, type SxProps, type Theme } from '@mui/material/styles';

// Icons used by the apps.
export { default as AppRegistrationOutlinedIcon } from '@mui/icons-material/AppRegistrationOutlined';
export { default as AppsOutlinedIcon } from '@mui/icons-material/AppsOutlined';
export { default as BusinessOutlinedIcon } from '@mui/icons-material/BusinessOutlined';
export { default as CableOutlinedIcon } from '@mui/icons-material/CableOutlined';
export { default as CloseIcon } from '@mui/icons-material/Close';
export { default as LoginIcon } from '@mui/icons-material/Login';
export { default as LogoutIcon } from '@mui/icons-material/Logout';
export { default as ManageAccountsOutlinedIcon } from '@mui/icons-material/ManageAccountsOutlined';
export { default as MoreVertIcon } from '@mui/icons-material/MoreVert';
export { default as NotificationsOutlinedIcon } from '@mui/icons-material/NotificationsOutlined';
export { default as PersonOutlinedIcon } from '@mui/icons-material/PersonOutlined';
export { default as RocketLaunchOutlinedIcon } from '@mui/icons-material/RocketLaunchOutlined';
export { default as StarBorderIcon } from '@mui/icons-material/StarBorder';
export { default as StarIcon } from '@mui/icons-material/Star';
export { default as StorefrontOutlinedIcon } from '@mui/icons-material/StorefrontOutlined';
export { default as AccountBalanceWalletOutlinedIcon } from '@mui/icons-material/AccountBalanceWalletOutlined';
export { default as AddIcon } from '@mui/icons-material/Add';
export { default as AdminPanelSettingsOutlinedIcon } from '@mui/icons-material/AdminPanelSettingsOutlined';
export { default as ArrowForwardIcon } from '@mui/icons-material/ArrowForward';
export { default as ChevronLeftIcon } from '@mui/icons-material/ChevronLeft';
export { default as ChevronRightIcon } from '@mui/icons-material/ChevronRight';
export { default as CheckIcon } from '@mui/icons-material/Check';
export { default as CircleIcon } from '@mui/icons-material/Circle';
export { default as DarkModeOutlinedIcon } from '@mui/icons-material/DarkModeOutlined';
export { default as GitHubIcon } from '@mui/icons-material/GitHub';
export { default as GroupsOutlinedIcon } from '@mui/icons-material/GroupsOutlined';
export { default as HomeOutlinedIcon } from '@mui/icons-material/HomeOutlined';
export { default as HowToRegOutlinedIcon } from '@mui/icons-material/HowToRegOutlined';
export { default as HubOutlinedIcon } from '@mui/icons-material/HubOutlined';
export { default as InfoOutlinedIcon } from '@mui/icons-material/InfoOutlined';
export { default as TranslateOutlinedIcon } from '@mui/icons-material/TranslateOutlined';
export { default as LightModeOutlinedIcon } from '@mui/icons-material/LightModeOutlined';
export { default as ArrowBackIcon } from '@mui/icons-material/ArrowBack';
export { default as OpenInNewIcon } from '@mui/icons-material/OpenInNew';
export { default as SwapHorizOutlinedIcon } from '@mui/icons-material/SwapHorizOutlined';
export { default as VerifiedUserOutlinedIcon } from '@mui/icons-material/VerifiedUserOutlined';
export { default as TravelExploreOutlinedIcon } from '@mui/icons-material/TravelExploreOutlined';
export { default as AttachFileIcon } from '@mui/icons-material/AttachFile';
export { default as BlockOutlinedIcon } from '@mui/icons-material/BlockOutlined';
export { default as ArrowBackOutlinedIcon } from '@mui/icons-material/ArrowBackOutlined';
export { default as BadgeOutlinedIcon } from '@mui/icons-material/BadgeOutlined';
export { default as ChevronRightOutlinedIcon } from '@mui/icons-material/ChevronRightOutlined';
export { default as ContentCopyOutlinedIcon } from '@mui/icons-material/ContentCopyOutlined';
export { default as ErrorOutlineOutlinedIcon } from '@mui/icons-material/ErrorOutlineOutlined';
export { default as HourglassTopOutlinedIcon } from '@mui/icons-material/HourglassTopOutlined';
export { default as PendingActionsOutlinedIcon } from '@mui/icons-material/PendingActionsOutlined';
export { default as ScheduleOutlinedIcon } from '@mui/icons-material/ScheduleOutlined';
export { default as SearchOffOutlinedIcon } from '@mui/icons-material/SearchOffOutlined';
export { default as TaskAltOutlinedIcon } from '@mui/icons-material/TaskAltOutlined';
export { default as WarningAmberOutlinedIcon } from '@mui/icons-material/WarningAmberOutlined';
// Icons added for the onboarding proof of concept (C1-M2 Registration).
export { default as AddBusinessOutlinedIcon } from '@mui/icons-material/AddBusinessOutlined';
export { default as AutorenewOutlinedIcon } from '@mui/icons-material/AutorenewOutlined';
export { default as CheckCircleOutlinedIcon } from '@mui/icons-material/CheckCircleOutlined';
export { default as CloudOffOutlinedIcon } from '@mui/icons-material/CloudOffOutlined';
export { default as ContentCopyIcon } from '@mui/icons-material/ContentCopy';
export { default as DeleteOutlinedIcon } from '@mui/icons-material/DeleteOutlined';
export { default as DescriptionOutlinedIcon } from '@mui/icons-material/DescriptionOutlined';
export { default as EditOutlinedIcon } from '@mui/icons-material/EditOutlined';
export { default as ExpandLessIcon } from '@mui/icons-material/ExpandLess';
export { default as ErrorOutlineOutlinedIcon } from '@mui/icons-material/ErrorOutlineOutlined';
export { default as ExpandMoreIcon } from '@mui/icons-material/ExpandMore';
export { default as FactCheckOutlinedIcon } from '@mui/icons-material/FactCheckOutlined';
export { default as FileDownloadOutlinedIcon } from '@mui/icons-material/FileDownloadOutlined';
export { default as HourglassEmptyIcon } from '@mui/icons-material/HourglassEmpty';
export { default as LockOutlinedIcon } from '@mui/icons-material/LockOutlined';
export { default as RadioButtonUncheckedIcon } from '@mui/icons-material/RadioButtonUnchecked';
export { default as ScheduleIcon } from '@mui/icons-material/Schedule';
export { default as SearchIcon } from '@mui/icons-material/Search';
export { default as SendIcon } from '@mui/icons-material/Send';
export { default as UndoIcon } from '@mui/icons-material/Undo';
// Icons added for the onboarding proof of concept (C1-M2 Registration).
export { default as HelpOutlineOutlinedIcon } from '@mui/icons-material/HelpOutlineOutlined';
export { default as SendOutlinedIcon } from '@mui/icons-material/SendOutlined';
export { default as UploadFileOutlinedIcon } from '@mui/icons-material/UploadFileOutlined';
