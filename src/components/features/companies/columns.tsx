'use client'

import { ColumnDef } from '@tanstack/react-table'
import type { Company } from '@/types/api/admin.types'
import { ShieldCheck } from 'lucide-react'

export const columns: ColumnDef<Company>[] = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'name', header: 'Company' },
  { accessorKey: 'reg_number', header: 'Registeration Number' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'details', header: 'Details' },
  {
    accessorKey: 'verified',
    header: () => <div className="text-center">Verified</div>,
    cell: ({ row }) => {
      const isVerified = row.getValue('verified')
      return (
        <div className="flex justify-center">
          {isVerified ? (
            <ShieldCheck stroke={`var(--color-success)`} size={20} />
          ) : (
            <ShieldCheck stroke={`var(--color-disabled)`} size={20} />
          )}
        </div>
      )
    },
  },
  { accessorKey: 'created_at', header: 'Created at' },
]
