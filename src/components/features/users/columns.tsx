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
import type { User } from '@/types/api/user.types'

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
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role_id
      return <div className="">{role.name}</div>
    },
  },
]
