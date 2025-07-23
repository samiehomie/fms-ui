'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import type { Company } from '@/types/api/company.types'
import { formatDateTime, getCompanyTypeColor } from '@/lib/utils'
import { ArrowUpDown, CircleSlash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModifyCompanyForm } from './modify-company-form'

import { IconCircleCheckFilled, IconDotsVertical } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useDeleteCompany, useVerifyCompany } from '@/lib/queries/useCompanies'
import ConfirmDialog from '@/components/ui/confirm-dialog'

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
    header: () => <div className="min-w-[45px] pl-2">{'ID'}</div>,
    cell: ({ row }) => <div className="pl-2">{row.getValue('id')}</div>,
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <Button
  //       variant={'ghost'}
  //       className="w-full text-center"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //     >
  //       ID
  //       <ArrowUpDown />
  //     </Button>
  //   ),
  //   //header: () => <div className="min-w-[35px] pl-1">{'ID'}</div>,
  //   cell: ({ row }) => (
  //     <div className="w-full text-center pr-4">{row.getValue('id')}</div>
  //   ),
  // },
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
    header: () => <div className="text-center">Verified</div>,
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
      const router = useRouter()
      const companyId = row.original.id
      const verified = row.original.verified
      const mutationDelete = useDeleteCompany()
      const mutationVerify = useVerifyCompany(companyId)

      const [open, setOpen] = useState(false)

      const handleVerifyAction = async () => {
        try {
          await mutationVerify.mutateAsync({ verified: !verified })
          setOpen(false) // 메뉴 닫기
        } catch (error) {
          logger.error('Verify action failed:', error)
        }
      }

      const handleDeleteAction = async () => {
        try {
          await mutationDelete.mutateAsync(companyId)
          setOpen(false) // 메뉴 닫기
        } catch (error) {
          logger.error('Delete action failed:', error)
        }
      }

      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
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
            <ModifyCompanyForm id={companyId} onClose={() => setOpen(false)} />
            <ConfirmDialog
              onClose={() => setOpen(false)}
              handleClick={handleVerifyAction}
            >
              <div className="text-sm p-2 hover:bg-gray-100/90 rounded-sm">
                {verified ? 'Unverify' : 'Verify'}
              </div>
            </ConfirmDialog>

            <DropdownMenuItem
              onClick={() => {
                router.push(`/companies/${companyId}`)
              }}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ConfirmDialog
              onClose={() => setOpen(false)}
              handleClick={handleDeleteAction}
            >
              <div className="text-sm p-2 text-red-500 hover:bg-gray-100/90 rounded-sm">
                Delete
              </div>
            </ConfirmDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
