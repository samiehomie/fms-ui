'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
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

import { IconCircleCheckFilled } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { IconDotsVertical } from '@tabler/icons-react'
import { logger } from '@/lib/utils'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import type { Vehicle } from '@/types/api/vehicle.types'
import { useDeleteVehicle } from '@/lib/hooks/queries/useVehicles'

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: 'id',
    header: () => <div className="min-w-[45px] pl-2">{'ID'}</div>,
    cell: ({ row }) => <div className="pl-2">{row.getValue('id')}</div>,
  },
  {
    id: 'company',
    header: 'Company',
    cell: ({ row }) => {
      const company = row.original.company_id
      return <div>{company.name}</div>
    },
  },
  {
    accessorKey: 'vehicle_name',
    header: 'Name',
  },
  {
    accessorKey: 'plate_number',
    header: 'Plate No.',
  },

  {
    id: 'vehicle_info',
    header: 'Model',
    cell: ({ row }) => {
      const { model, brand, manuf_year, fuel_type, gear_type } = row.original
      return (
        <div className="flex gap-1">
          <div className="font-[400]">
            {brand} {model}
            <span className="text-muted-foreground pl-1 font-normal">
              {manuf_year} {gear_type} {fuel_type}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'can_bitrate',
    header: 'Can Bitrate',
  },
  {
    accessorKey: 'num_tire',
    header: 'Tires',
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
      const { isdeleted, id: companyId } = row.original
      const mutationDelete = useDeleteVehicle()

      const [open, setOpen] = useState(false)

      const handleDeleteAction = async () => {
        try {
          await mutationDelete.mutateAsync({
            id: companyId.toString(),
          })
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
          {isdeleted ? (
            <DropdownMenuContent align="end" className="w-32">
              <ConfirmDialog
                onClose={() => setOpen(false)}
                handleClick={handleDeleteAction}
              >
                <div className="text-sm p-2 text-red-500 hover:bg-gray-100/90 rounded-sm">
                  Restore
                </div>
              </ConfirmDialog>
            </DropdownMenuContent>
          ) : (
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/vehicles/${companyId}`)
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
          )}
        </DropdownMenu>
      )
    },
  },
  // 숨겨진 열 (스타일링용)
  {
    id: 'isDeleted',
    accessorKey: 'isdeleted', // 실제 데이터 키
    header: 'isDeleted',
  },
]
