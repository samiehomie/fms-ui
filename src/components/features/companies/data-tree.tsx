'use client'

import type React from 'react'
import type { CompanyDetail } from '@/types/features/company.types'
import { Tree } from 'antd'
import type { TreeDataNode, TreeProps } from 'antd'
import { Badge } from '@/components/ui/badge'
import { UserIcon, Truck, UserCircle, Search } from 'lucide-react'
import { ApiResponseType } from '@/types/features'
import { Input } from '@/components/ui/input'
import CompanyDetailsPagination from './company-details-pagination'

// Mock data as requested
const companyData: CompanyDetail = {
  company: {
    id: 1,
    name: 'BANF Smart Tire',
    reg_number: 'REG-2024-STL-001',
    type: 'logistics',
    details: 'Full-service logistics company',
    phone: '+82-2-1234-5678',
    email: 'info@banf.ai',
    website: 'https://www.banf.ai',
    contact_person: 'Via Kazadi',
    contact_phone: '+82-10-9876-5432',
    verified: true,
    isdeleted: false,
    deletedAt: '2025-07-02T05:13:07.714Z',
    created_at: '2025-06-25T10:30:00Z',
    updated_at: '2025-06-25T11:15:00Z',
    address: {
      id: 1,
      street: '123 Gangnam-daero, Gangnam-gu',
      city: 'Seoul',
      state: 'Seoul',
      country: 'South Korea',
      postal_code: '06292',
      latitude: 37.5665,
      longitude: 126.978,
      created_at: '2025-06-25T10:30:00Z',
      updated_at: '2025-06-25T11:15:00Z',
    },
    users: [
      {
        id: 1,
        username: 'Vially',
        email: 'viakm@company.com',
        role: 'driver',
      },
      {
        id: 2,
        username: 'John Doe',
        email: 'johndoe@company.com',
        role: 'manager',
      },
    ],
    vehicles: [
      {
        id: 1,
        plate_number: '99노8743',
      },
      {
        id: 2,
        plate_number: '12가3456',
      },
      {
        id: 3,
        plate_number: '서울34사1234',
      },
    ],
  },
}

export default function DataTree({
  detail,
}: {
  detail: ApiResponseType<'GET /companies/{id}'>
}) {
  const { company } = detail

  const users = company.users ?? []
  const vehicles = company.vehicles ?? []

  const treeData: TreeDataNode[] = [
    {
      title: <div className="font-bold">{company.name}</div>,
      key: company.name,
      children: [
        {
          title: `users (${users?.length})`,
          key: `${company.name}-users`,
          icon: <UserIcon className="w-4 h-4" />,
          children: users.map((user) => ({
            title: (
              <div className="flex items-center space-x-2">
                <span>{user.username}</span>
                <Badge variant="outline">{user.role}</Badge>
              </div>
            ),
            key: `${company.name}-user-${user.id}`,
            icon: <UserCircle className="w-4 h-4 text-muted-foreground" />,
          })),
        },
        {
          title: `vehicles (${vehicles.length})`,
          key: 'vehicles',
          icon: <Truck className="w-4 h-4" />,
          children: vehicles.map((vehicle) => ({
            title: vehicle.plate_number,
            key: `${company.name}-vehicle-${vehicle.id}`,
            icon: <Truck className="w-4 h-4 text-muted-foreground" />,
          })),
        },
      ],
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      {/* <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
        <Input
          type="search"
          placeholder="Type a command or search..."
          className="pl-8 w-full bg-[#f8fafc]"
        />
      </div> */}
      <Tree
        showLine
        defaultExpandAll
        treeData={treeData}
        className="bg-transparent"
      />
      {/* <CompanyDetailsPagination /> */}
    </div>
  )
}
