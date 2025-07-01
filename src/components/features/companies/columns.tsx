'use client'

import { ColumnDef } from '@tanstack/react-table'
import type { Company } from '@/types/api/company.types'
import { ShieldCheck } from 'lucide-react'
import { formatDateTime, getCompanyTypeColor } from '@/lib/utils'
import { MoreHorizontal, ArrowUpDown, CircleSlash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { IconCircleCheckFilled } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { IconDotsVertical } from '@tabler/icons-react'
import { useDeleteCompany } from '@/lib/hooks/queries/useCompanies'
import { logger } from '@/lib/utils'

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
    cell: ({ row }) => (
      <div className="w-full text-center pr-4">{row.getValue('id')}</div>
    ),
  },

  { accessorKey: 'name', header: 'Company' },
  { accessorKey: 'reg_number', header: 'Reg No' },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        className=""
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Type
        <ArrowUpDown className="" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string

      return (
        <Badge
          variant="outline"
          className={`${getCompanyTypeColor(type)} px-1.5 font-medium ml-3 `}
        >
          {type}
        </Badge>
      )
    },
  },
  { accessorKey: 'details', header: 'Details' },
  {
    accessorKey: 'verified',
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        className="w-full"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Verified
        <ArrowUpDown />
      </Button>
    ),
    //header: () => <div className="text-center">Verified</div>,
    cell: ({ row }) => {
      const isVerified = row.getValue('verified')
      return (
        <div className="flex justify-center">
          {isVerified ? (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <IconCircleCheckFilled className="fill-green-500" />
              {`Verified`}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              <CircleSlash className="stroke-gray-500  " />
              {`Not yet`}
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
      const companyId = row.original.id
      logger.log('companyId', companyId)
      const mutation = useDeleteCompany()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Verify</DropdownMenuItem>
            <DropdownMenuItem>Copy ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                await mutation.mutateAsync(companyId)
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
