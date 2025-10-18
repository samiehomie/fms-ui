'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical } from '@tabler/icons-react'
import type { VehiclesByCompany } from '@/types/features/vehicle/vehicle.types'

export const columns: ColumnDef<VehiclesByCompany>[] = [
  {
    accessorKey: 'id',
    header: () => <div className="min-w-[45px] pl-2">{'ID'}</div>,
    cell: ({ row }) => <div className="pl-2">{row.getValue('id')}</div>,
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
    id: 'actions',
    cell: ({ row }) => {
      const router = useRouter()
      const companyId = row.original.id

      const [open, setOpen] = useState(false)

      // const handleVerifyAction = async () => {
      //   try {
      //     await mutationVerify.mutateAsync({ verified: !verified })
      //     setOpen(false) // 메뉴 닫기
      //   } catch (error) {
      //     logger.error('Verify action failed:', error)
      //   }
      // }

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
            {/* <ConfirmDialog
              onClose={() => setOpen(false)}
              handleClick={handleVerifyAction}
            >
              <div className="text-sm p-2 hover:bg-gray-100/90 rounded-sm">
                {verified ? 'Unverify' : 'Verify'}
              </div>
            </ConfirmDialog> */}

            <DropdownMenuItem
              onClick={() => {
                router.push(`/vehicles/${companyId}`)
              }}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
