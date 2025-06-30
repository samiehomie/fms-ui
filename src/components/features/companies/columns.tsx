'use client'

import { ColumnDef } from '@tanstack/react-table'
import type { Company } from '@/types/api/company.types'
import { ShieldCheck } from 'lucide-react'
import { formatDateTime, getCompanyTypeColor } from '@/lib/utils'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

export const columns: ColumnDef<Company>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className="ml-2 mr-2"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="ml-2 mr-2"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        className="w-full text-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ID
        <ArrowUpDown />
      </Button>
    ),
    //header: () => <div className="min-w-[35px] pl-1">{'ID'}</div>,
    cell: ({ row }) => <div className="w-full text-center pr-4">{row.getValue('id')}</div>,
  },

  { accessorKey: 'name', header: 'Company' },
  { accessorKey: 'reg_number', header: 'Reg No' },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return <div className={`${getCompanyTypeColor(type)}`}>{type}</div>
    },
  },
  { accessorKey: 'details', header: 'Details' },
  {
    accessorKey: 'verified',
    header: () => <div className="text-center">Verified</div>,
    cell: ({ row }) => {
      const isVerified = row.getValue('verified')
      return (
        <div className="flex justify-center">
          {!isVerified ? (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
              {`verified`}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
              {`verified`}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        className="w-full"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created at
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string
      return (
        <div className="flex justify-center tracking-tight">
          {formatDateTime(createdAt)}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const company = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(`${company.id}`)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
