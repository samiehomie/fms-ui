'use client'
import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from './data-table-pagination'
import { Input } from '@/components/ui/input'
import { CompaniesPaginationParams } from '@/types/api/company.types'
import { AddCompanyForm } from './add-company-form'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination: CompaniesPaginationParams
  setPagination: (pagination: CompaniesPaginationParams) => void
  totalCount: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  pagination,
  setPagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [tablePagination, setTablePagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1, // TanStack Table은 0부터 시작
    pageSize: pagination.limit,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(tablePagination) : updater

      setTablePagination(newPagination)

      // 서버 사이드 페이지네이션 상태 업데이트
      setPagination({
        ...pagination,
        page: newPagination.pageIndex + 1, // 1부터 시작하도록 변환
        limit: newPagination.pageSize,
      })
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pagination.limit),
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination: tablePagination,
    },
  })

  const selectedFiles = Object.keys(rowSelection).map((rowId) => {
    const row = table.getRow(rowId)
    return row?.getValue('id')
  })

  const selectedFilesCount = selectedFiles.length

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center gap-x-4">
        <Input
          placeholder="Filter file name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <AddCompanyForm />
        {/* <Button variant={'outline'} size="sm">
          <IconPlus />
          Add Company
        </Button> */}
      </div>

      <div className="text-slate-900 ">
        <Table className="border-none">
          <TableHeader className="bg-slate-50  border border-slate-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-none" key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const isFirst = index === 0
                  const isLast = index === headerGroup.headers.length - 1
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-slate-500 text-sm font-[400]`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4 px-1">
        <div className="text-sm text-muted-foreground flex items-center">
          {selectedFilesCount} of {table.getFilteredRowModel().rows.length}{' '}
          row(s) selected
          <Button
            className="ml-4"
            variant="secondary"
            // onClick={handleDelete}
          >{`${selectedFilesCount} row(s) delete`}</Button>
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
