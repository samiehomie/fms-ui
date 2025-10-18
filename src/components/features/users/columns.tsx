'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { formatDateTime } from '@/lib/utils/date-formatter'
import { ArrowUpDown, CircleSlash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useVerifyUser } from '@/lib/query-hooks/useUsers'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import type { User } from '@/types/features/user.types'
import { IconCircleCheckFilled, IconDotsVertical } from '@tabler/icons-react'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: () => <div className="min-w-[45px] pl-2">{'ID'}</div>,
    cell: ({ row }) => <div className="pl-2">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'company',
    header: 'Company',
    cell: ({ row }) => {
      const company = row.original.company
      return <div>{company.name}</div>
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    id: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role
      return <div className="">{role.name}</div>
    },
  },
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
    accessorKey: 'createdAt',
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
      const createdAt = row.getValue('createdAt') as string
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
      const username = row.original.username
      const verified = row.original.verified
      //const mutationDelete = useDeleteCompany()
      const mutationVerify = useVerifyUser()

      const [open, setOpen] = useState(false)

      const handleVerifyAction = async () => {
        try {
          await mutationVerify.mutateAsync({ username })
          setOpen(false) // 메뉴 닫기
        } catch (error) {
          logger.error('Verify action failed:', error)
        }
      }

      // const handleDeleteAction = async () => {
      //   try {
      //     await mutationDelete.mutateAsync(companyId)
      //     setOpen(false) // 메뉴 닫기
      //   } catch (error) {
      //     logger.error('Delete action failed:', error)
      //   }
      // }

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
            {/* <ModifyCompanyForm id={companyId} onClose={() => setOpen(false)} /> */}
            <ConfirmDialog
              onClose={() => setOpen(false)}
              handleClick={handleVerifyAction}
            >
              <div className="text-sm p-2 hover:bg-gray-100/90 rounded-sm">
                {verified ? 'Unverify' : 'Verify'}
              </div>
            </ConfirmDialog>

            {/* <DropdownMenuItem
              onClick={() => {
                router.push(`/companies/${companyId}`)
              }}
            >
              View Details
            </DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}
            {/* <ConfirmDialog
              onClose={() => setOpen(false)}
              handleClick={handleDeleteAction}
            >
              <div className="text-sm p-2 text-red-500 hover:bg-gray-100/90 rounded-sm">
                Delete
              </div>
            </ConfirmDialog> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
