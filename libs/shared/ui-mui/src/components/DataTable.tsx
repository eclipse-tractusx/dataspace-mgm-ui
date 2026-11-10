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

import { alpha } from '@mui/material/styles';
import { DataGrid, type DataGridProps, type GridValidRowModel } from '@mui/x-data-grid';
import { deDE, enUS } from '@mui/x-data-grid/locales';
import { RADIUS } from '../theme/theme';
import { tractusx } from '../theme/palette';

/** Languages of the portal with a translation of the grid's own texts (pagination, sorting, no rows). */
export type DataTableLocale = 'en' | 'de';

const LOCALE_TEXT = {
  en: enUS.components.MuiDataGrid.defaultProps.localeText,
  de: deDE.components.MuiDataGrid.defaultProps.localeText,
} as const;

export type DataTableProps<R extends GridValidRowModel> = DataGridProps<R> & {
  /** The portal language; the grid's own texts follow it. */
  locale?: DataTableLocale;
};

/**
 * The table of the portal: MUI X Data Grid (community, MIT) in the Eclipse Tractus-X look of the wallet pages — one
 * card (10px radius, subtle border), quiet uppercase headers, no cell grid lines, an orange tint on hover and focus,
 * whole rows clickable when `onRowClick` is set. Every list view with a table uses it; features never import
 * @mui/x-data-grid themselves.
 */
export function DataTable<R extends GridValidRowModel>({ locale = 'en', sx, localeText, onRowClick, ...props }: DataTableProps<R>) {
  return (
    <DataGrid<R>
      autoHeight
      disableRowSelectionOnClick
      disableColumnMenu
      rowHeight={60}
      columnHeaderHeight={48}
      pageSizeOptions={[10, 25, 50]}
      initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
      {...props}
      onRowClick={onRowClick}
      localeText={{ ...LOCALE_TEXT[locale], ...localeText }}
      sx={[
        (theme) => ({
          border: '1px solid',
          borderColor: theme.palette.ui.subtleBorder,
          borderRadius: `${RADIUS}px`,
          bgcolor: 'background.paper',
          fontSize: 14,
          '--DataGrid-containerBackground': theme.palette.background.paper,
          '--DataGrid-rowBorderColor': theme.palette.ui.subtleBorder,
          '& .MuiDataGrid-columnHeaders': { borderBottom: `1px solid ${theme.palette.ui.subtleBorder}` },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: theme.palette.text.secondary,
          },
          '& .MuiDataGrid-columnSeparator': { display: 'none' },
          '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-row': { cursor: onRowClick ? 'pointer' : 'default' },
          '& .MuiDataGrid-row:hover, & .MuiDataGrid-row.Mui-hovered': { bgcolor: alpha(tractusx.orange, 0.06) },
          '& .MuiDataGrid-row:focus-visible, & .MuiDataGrid-row.Mui-selected': { bgcolor: alpha(tractusx.orange, 0.1) },
          '& .MuiDataGrid-footerContainer': { borderTop: `1px solid ${theme.palette.ui.subtleBorder}` },
          '& .MuiDataGrid-overlay': { bgcolor: 'transparent', color: theme.palette.text.secondary },
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
}
