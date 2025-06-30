'use client'
import type { Company } from '@/types/api/company.types'
import { useState, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // const { data: tableData } = useQuery({
  //   queryKey: ['companies'],
  //   queryFn: async () =>
  // })
  const [oageParams, setPageParams] = useState({
    page: 1,
    limit: 10,
    // sort: 'created_at',
    // order: 'desc' as const,
  })
  //const { data, isLoading, error } = useCompaniesPaginated(oageParams)
  const [tableData, setTableData] = useState<Company[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    // data: tableData as TData[],
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  // useEffect(() => {
  //   if (data) {
  //     setTableData(data.companies)
  //   }
  // }, [data])

  const selectedFiles = Object.keys(rowSelection).map((rowId) => {
    const row = table.getRow(rowId)
    return row?.getValue('filepath')
  })

  const selectedFilesCount = selectedFiles.length

  // if (isLoading) return <div>Loading...</div>
  // if (error) return <div>Error: {error.message}</div>
  // if (!data) return <div>No data</div>

  return (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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
