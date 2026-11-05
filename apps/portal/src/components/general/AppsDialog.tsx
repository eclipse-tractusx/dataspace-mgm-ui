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

import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CloseIcon,
  Container,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Stack,
  StarBorderIcon,
  StarIcon,
  Toolbar,
  Tooltip,
  Typography,
  tractusx,
  useMediaQuery,
  useTheme,
} from '@dataspace-mgm/ui-mui';
import { useNavigate } from 'react-router-dom';
import { FIXED_FAVOURITES, MAX_FAVOURITES, useFavourites } from '../../contexts/FavouritesContext';
import type { NavigationItem } from '../../types/routing';

interface AppsDialogProps {
  open: boolean;
  onClose: () => void;
  items: NavigationItem[];
}

/**
 * Every feature of the portal in one view, full screen on phones and tablets. The star of each app
 * turns it on or off as a favourite: favourites appear in the sidebar and in the phone's bottom bar.
 */
export default function AppsDialog({ open, onClose, items }: AppsDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { favourites, isFavourite, canToggle, toggle } = useFavourites();
  const iconColor = theme.palette.mode === 'dark' ? tractusx.orange : tractusx.orangeDarkest;

  const openFeature = (item: NavigationItem) => {
    onClose();
    navigate(item.path);
  };

  const starHint = (item: NavigationItem) => {
    if (FIXED_FAVOURITES.includes(item.path)) return `${item.name} is always in your bar`;
    if (isFavourite(item.path)) return `Remove ${item.name} from favourites`;
    if (!canToggle(item.path)) return `Up to ${MAX_FAVOURITES} favourites: remove one first`;
    return `Add ${item.name} to favourites`;
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="md" aria-labelledby="apps-dialog-title">
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: theme.palette.ui.navbar, color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 74 }, gap: 2, pt: fullScreen ? 'env(safe-area-inset-top, 0px)' : 0 }}>
          <Typography id="apps-dialog-title" component="h2" sx={{ flex: 1, fontWeight: 800, fontSize: 20 }}>
            All apps
          </Typography>
          <IconButton edge="end" onClick={onClose} aria-label="Close all apps" sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ px: 0, py: 3, pb: fullScreen ? 'calc(32px + env(safe-area-inset-bottom, 0px))' : 4 }}>
        <Container maxWidth="md">
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Star up to {MAX_FAVOURITES} favourites for your sidebar and the bar on your phone ({favourites.length} of{' '}
            {MAX_FAVOURITES} chosen). Home is always there.
          </Typography>
          <Grid container spacing={2}>
            {items.map((item) => {
              const favourite = isFavourite(item.path);
              return (
                <Grid key={item.path} size={{ xs: 6, sm: 4 }}>
                  <Card sx={{ height: '100%', position: 'relative', borderColor: favourite ? tractusx.orange : undefined }}>
                    <CardActionArea
                      disabled={item.disabled}
                      onClick={() => openFeature(item)}
                      aria-label={item.disabled ? `${item.name}, coming soon` : `Open ${item.name}`}
                      sx={{ height: '100%', alignItems: 'flex-start' }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                        <Stack spacing={1.5} sx={{ opacity: item.disabled ? 0.6 : 1 }}>
                          <Avatar variant="rounded" aria-hidden sx={{ color: iconColor }}>
                            {item.icon}
                          </Avatar>
                          <Typography component="h3" sx={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3, pr: 4 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                          {item.disabled && (
                            <Chip label="Coming soon" size="small" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                          )}
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <Tooltip title={starHint(item)}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => toggle(item.path)}
                            disabled={!canToggle(item.path)}
                            aria-pressed={favourite}
                            aria-label={`Favourite: ${item.name}`}
                            sx={{ color: favourite ? tractusx.orange : 'text.secondary', '&.Mui-disabled': { color: favourite ? tractusx.orange : undefined } }}
                          >
                            {favourite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
