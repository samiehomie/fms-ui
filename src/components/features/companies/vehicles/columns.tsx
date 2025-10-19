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
import type { CompanyVehiclesReponse } from '@/types/features/companies/company.types'

export const columns: ColumnDef<CompanyVehiclesReponse[number]>[] = [
  {
    accessorKey: 'id',
    header: () => <div className="min-w-[45px] pl-2">{'ID'}</div>,
    cell: ({ row }) => <div className="pl-2">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'plateNumber',
    header: 'Plate No.',
  },

  {
    id: 'vehicle_info',
    header: 'Model',
    cell: ({ row }) => {
      const { model, brand, manufactureYear, fuelType, gearType } = row.original
      return (
        <div className="flex gap-1">
          <div className="font-[400]">
            {brand} {model}
            <span className="text-muted-foreground pl-1 font-normal">
              {manufactureYear} {gearType} {fuelType}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'canBitrate',
    header: 'Can Bitrate',
  },
  {
    accessorKey: 'numTire',
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
