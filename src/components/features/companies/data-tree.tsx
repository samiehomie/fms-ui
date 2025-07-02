'use client'

import type React from 'react'
import type { CompanyDetail } from '@/types/api/company.types'
import { Tree } from 'antd'
import type { TreeDataNode, TreeProps } from 'antd'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building,
  Mail,
  Phone,
  UserIcon,
  Globe,
  Truck,
  UserCircle,
  CheckCircle2,
  XCircle,
  MapPin,
} from 'lucide-react'

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
        username: 'via_km',
        email: 'viakm@company.com',
        role: 'driver',
      },
      {
        id: 2,
        username: 'john_doe',
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

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) => (
  <div className="flex items-start space-x-3">
    <div className="text-muted-foreground mt-0.5">{icon}</div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-base">{value}</span>
    </div>
  </div>
)

export default function DataTree() {
  const { company } = companyData

  const treeData: TreeDataNode[] = [
    {
      title: `users (${company.users.length})`,
      key: 'users',
      icon: <UserIcon className="w-4 h-4" />,
      children: company.users.map((user) => ({
        title: (
          <div className="flex items-center space-x-2">
            <span>{user.username}</span>
            <Badge variant="outline">{user.role}</Badge>
          </div>
        ),
        key: `user-${user.id}`,
        icon: <UserCircle className="w-4 h-4 text-muted-foreground" />,
      })),
    },
    {
      title: `vehicles (${company.vehicles.length})`,
      key: 'vehicles',
      icon: <Truck className="w-4 h-4" />,
      children: company.vehicles.map((vehicle) => ({
        title: vehicle.plate_number,
        key: `vehicle-${vehicle.id}`,
        icon: <Truck className="w-4 h-4 text-muted-foreground" />,
      })),
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{`Users & Vehicles`}</CardTitle>
        <CardDescription>{`Expand for Details`}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tree
          showLine
          defaultExpandAll
          treeData={treeData}
          className="bg-transparent"
        />
      </CardContent>
    </Card>
  )
}
