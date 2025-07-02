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
import { Tag } from 'antd'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination: CompaniesPaginationParams
  setPagination: React.Dispatch<React.SetStateAction<CompaniesPaginationParams>>
  totalCount: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  pagination,
  setPagination,
}: DataTableProps<TData, TValue>) {
  const [search, setSearch] = useState('')
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

  const handleSearch = () => {
    setPagination((old) => ({ ...old, search }))
  }

  // Enter 키 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  //const selectedFilesCount = selectedFiles.length

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-2 ">
          <Input
            placeholder="Search in company name, reg number, or email"
            value={search}
            onChange={(event) => {
              //setPagination((old) => ({ ...old, search: event.target.value }))
              setSearch(event.target.value)
              // table.getColumn('name')?.setFilterValue(event.target.value)
            }}
            onKeyDown={handleKeyDown}
            className="min-w-[400px]"
          />
          <Button variant={'outline'} onClick={handleSearch}>
            Search
          </Button>
          <div className="ml-2">
            {pagination.search && (
              <Tag
                color="processing"
                className="ml-3"
                bordered={false}
                onClose={() => {
                  setPagination((old) => ({
                    ...old,
                    search: '',
                  }))
                  setSearch('')
                }}
                closable={true}
              >
                {pagination.search}
              </Tag>
            )}
          </div>
        </div>
        <div className="flex space-x-2 py-2 px-3 bg-[#f8fafc] rounded-lg border border-[#cad5e3] ">
          <Switch id="verified" />
          <Label htmlFor="verified" className="text-sm ">
            Verified
          </Label>
        </div>

        <AddCompanyForm />
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
          {/* {selectedFilesCount} of {table.getFilteredRowModel().rows.length}{' '}
          row(s) selected */}
          {/* <Button
            className="ml-4"
            variant="secondary"
            // onClick={handleDelete}
          >{`${selectedFilesCount} row(s) delete`}</Button> */}
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
