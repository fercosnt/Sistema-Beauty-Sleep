/**
 * List With Filters Template
 * Beauty Smile Design System
 *
 * Template for list pages with filters, search, pagination, and bulk actions
 */

import * as React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { cn } from '@/utils/cn'

export interface TableColumn<T = any> {
  /**
   * Column key (must match data object key)
   */
  key: string
  /**
   * Column header label
   */
  label: string
  /**
   * Custom render function for cell content
   */
  render?: (value: any, row: T) => React.ReactNode
  /**
   * Whether this column is sortable
   * @default false
   */
  sortable?: boolean
}

export interface FilterOption {
  /**
   * Filter identifier
   */
  id: string
  /**
   * Filter label
   */
  label: string
  /**
   * Filter options (for select-based filters)
   */
  options?: Array<{ value: string; label: string }>
}

export interface BulkAction {
  /**
   * Action identifier
   */
  id: string
  /**
   * Action label
   */
  label: string
  /**
   * Action variant (affects button style)
   * @default 'outline'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive'
  /**
   * Callback when action is triggered
   */
  onClick: (selectedIds: string[]) => void
}

export interface ListWithFiltersTemplateProps<T = any> {
  /**
   * Page title
   * @default 'Lista'
   */
  title?: string
  /**
   * Table columns configuration
   */
  columns: TableColumn<T>[]
  /**
   * Table data
   */
  data: T[]
  /**
   * Unique key for each row (used for selection)
   * @default 'id'
   */
  rowKey?: string
  /**
   * Search placeholder text
   * @default 'Buscar...'
   */
  searchPlaceholder?: string
  /**
   * Filter options
   */
  filters?: FilterOption[]
  /**
   * Bulk actions (shown when items are selected)
   */
  bulkActions?: BulkAction[]
  /**
   * Current page (1-indexed)
   * @default 1
   */
  currentPage?: number
  /**
   * Total number of pages
   * @default 1
   */
  totalPages?: number
  /**
   * Items per page
   * @default 10
   */
  itemsPerPage?: number
  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean
  /**
   * Callback when search input changes
   */
  onSearch?: (query: string) => void
  /**
   * Callback when filter changes
   */
  onFilterChange?: (filterId: string, value: string) => void
  /**
   * Callback when sort changes
   */
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void
  /**
   * Callback when page changes
   */
  onPageChange?: (page: number) => void
  /**
   * Callback when row is clicked
   */
  onRowClick?: (row: T) => void
  /**
   * Additional class name
   */
  className?: string
}

/**
 * List With Filters Template
 *
 * Pre-built template for list pages with search, filters, pagination, and bulk actions.
 *
 * @example
 * ```tsx
 * <ListWithFiltersTemplate
 *   title="Usuários"
 *   columns={[
 *     { key: 'name', label: 'Nome', sortable: true },
 *     { key: 'email', label: 'Email' },
 *     { key: 'role', label: 'Função' },
 *   ]}
 *   data={users}
 *   bulkActions={[
 *     { id: 'delete', label: 'Deletar', variant: 'destructive', onClick: (ids) => {} },
 *   ]}
 *   onSearch={(query) => console.log('Search:', query)}
 *   onPageChange={(page) => console.log('Page:', page)}
 * />
 * ```
 */
export const ListWithFiltersTemplate = <T extends Record<string, any>>({
  title = 'Lista',
  columns,
  data,
  rowKey = 'id',
  searchPlaceholder = 'Buscar...',
  filters = [],
  bulkActions = [],
  currentPage = 1,
  totalPages = 1,
  isLoading = false,
  onSearch,
  onFilterChange,
  onSort,
  onPageChange,
  onRowClick,
  className,
}: ListWithFiltersTemplateProps<T>) => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleSort = (columnKey: string) => {
    const newDirection =
      sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(columnKey)
    setSortDirection(newDirection)
    onSort?.(columnKey, newDirection)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.map((row) => String(row[rowKey])))
      setSelectedIds(allIds)
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectRow = (rowId: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds)
    if (checked) {
      newSelectedIds.add(rowId)
    } else {
      newSelectedIds.delete(rowId)
    }
    setSelectedIds(newSelectedIds)
  }

  const isAllSelected =
    data.length > 0 && selectedIds.size === data.length
  const isSomeSelected = selectedIds.size > 0 && !isAllSelected

  return (
    <div className={cn('p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
      </div>

      <Card>
        <CardHeader>
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Filters */}
            {filters.map((filter) => (
              <div key={filter.id} className="sm:w-48">
                {/* Simple text input for now - can be replaced with Select component */}
                <Input
                  placeholder={filter.label}
                  onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && bulkActions.length > 0 && (
            <div className="flex items-center gap-3 pt-4 border-t">
              <span className="text-sm text-neutral-600">
                {selectedIds.size} selecionado{selectedIds.size > 1 ? 's' : ''}
              </span>
              {bulkActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={() => action.onClick(Array.from(selectedIds))}
                  disabled={isLoading}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Table */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  {/* Select All Checkbox */}
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected || isSomeSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>

                  {/* Column Headers */}
                  {columns.map((column) => (
                    <TableHead key={column.key}>
                      {column.sortable ? (
                        <button
                          onClick={() => handleSort(column.key)}
                          className="flex items-center gap-2 hover:text-neutral-900 transition-colors"
                        >
                          {column.label}
                          {sortColumn === column.key && (
                            <span className="text-xs">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="text-center text-neutral-500"
                    >
                      Nenhum resultado encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => {
                    const rowId = String(row[rowKey])
                    const isSelected = selectedIds.has(rowId)

                    return (
                      <TableRow
                        key={rowId}
                        className={cn(
                          onRowClick && 'cursor-pointer hover:bg-neutral-50',
                          isSelected && 'bg-primary-50'
                        )}
                        onClick={() => onRowClick?.(row)}
                      >
                        {/* Select Checkbox */}
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelectRow(rowId, checked as boolean)
                            }
                            aria-label={`Select row ${rowId}`}
                          />
                        </TableCell>

                        {/* Data Cells */}
                        {columns.map((column) => (
                          <TableCell key={column.key}>
                            {column.render
                              ? column.render(row[column.key], row)
                              : row[column.key]}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <p className="text-sm text-neutral-600">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

ListWithFiltersTemplate.displayName = 'ListWithFiltersTemplate'
