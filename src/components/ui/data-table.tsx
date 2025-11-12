"use client"
import { useState, type ReactNode } from "react"
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
  VisibilityState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "../features/companies/data-table-pagination"
import { cn } from "@/lib/utils/utils"

interface DataTableProps<TData, TValue, TPagination = any> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination: TPagination
  setPagination: React.Dispatch<React.SetStateAction<TPagination>>
  totalCount: number
  hiddenColumns?: VisibilityState
  children?: ReactNode
}

export function DataTable<
  TData,
  TValue,
  TPagination extends Record<string, any>,
>({
  columns,
  data,
  totalCount,
  pagination,
  setPagination,
  hiddenColumns,
  children,
}: DataTableProps<TData, TValue, TPagination>) {
  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [tablePagination, setTablePagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1, // TanStack Table은 0부터 시작
    pageSize: pagination.limit,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    hiddenColumns ?? {},
  )

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
        typeof updater === "function" ? updater(tablePagination) : updater

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
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  })

  // const selectedFiles = Object.keys(rowSelection).map((rowId) => {
  //   const row = table.getRow(rowId)
  //   return row?.getValue('id')
  // })

  const handleSearch = () => {
    setPagination((old) => ({ ...old, search }))
  }

  // Enter 키 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }

  //const selectedFilesCount = selectedFiles.length

  return (
    <div className="flex flex-col gap-y-3 flex-1">
      <div className="text-slate-900 ">
        <Table className="border-none">
          <TableHeader className="bg-slate-50  border border-slate-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-none" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
              table.getRowModel().rows.map((row) => {
                let isDeleted = false
                if (hiddenColumns && "isDeleted" in hiddenColumns) {
                  isDeleted = row.getValue("isDeleted") as boolean
                }
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    // onClick={() =>
                    //   router.push(`/vehicles/${row.getValue('id')}`)
                    // }
                    className={cn(
                      isDeleted && "opacity-30 text-muted-foreground",
                    )}
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
                )
              })
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
      <div
        className={cn(
          "flex items-center justify-end py-5 px-1",
          children && "justify-between",
        )}
      >
        {children}
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
