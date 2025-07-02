'use client'

import type React from 'react'
import type { CompanyDetail } from '@/types/api/company.types'
import { Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
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
import DataTree from './data-tree'
import { VerifiedBadge, UnVerifiedBadge } from '@/components/ui/custom-badges'
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
      <span className="text-sm tracking-tight font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  </div>
)

export default function CompanyDetails() {
  const { company } = companyData

  const treeData: DataNode[] = [
    {
      title: `사용자 (${company.users.length})`,
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
      title: `차량 (${company.vehicles.length})`,
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
    <div className="min-h-screen">
      <div className=" grid gap-6 lg:grid-cols-9">
        <div className="lg:col-span-2">
          <DataTree />
        </div>
        <div className="lg:col-span-7 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex gap-x-3 items-start">
                <div>
                  <CardTitle className="text-2xl  leading-none font-bold flex items-center gap-2">
                    {company.name}
                  </CardTitle>
                  <CardDescription className="mt-1 ml-[.125rem]">
                    {company.details}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {company.verified ? <VerifiedBadge /> : <UnVerifiedBadge />}

                  <Badge variant="outline" className="text-muted-foreground">
                    {company.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <InfoRow
                  icon={<Phone size={14} />}
                  label="Main Contact"
                  value={company.phone}
                />
                <InfoRow
                  icon={<Mail size={14} />}
                  label="Email"
                  value={company.email}
                />
                <InfoRow
                  icon={<Globe size={14} />}
                  label="Website"
                  value={
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  }
                />
              </div>
              <div className="space-y-4">
                <InfoRow
                  icon={<Phone size={14} />}
                  label="Main Contact"
                  value={company.phone}
                />
                <InfoRow
                  icon={<Mail size={14} />}
                  label="Email"
                  value={company.email}
                />
                <InfoRow
                  icon={<Globe size={14} />}
                  label="Website"
                  value={
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  }
                />
              </div>
              <div className="space-y-4">
                <InfoRow
                  icon={<Phone size={14} />}
                  label="Main Contact"
                  value={company.phone}
                />
                <InfoRow
                  icon={<Mail size={14} />}
                  label="Email"
                  value={company.email}
                />
                <InfoRow
                  icon={<Globe size={14} />}
                  label="Website"
                  value={
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-lg">
                {company.address.street}, {company.address.city}
              </p>
              <p className="text-muted-foreground">
                {company.address.state}, {company.address.country} (
                {company.address.postal_code})
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
