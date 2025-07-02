'use client'

import type { ApiResponseType } from '@/types/api'
import type React from 'react'
import type { CompanyDetail } from '@/types/api/company.types'
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
  Globe,
  UserCircle,
  MapPin,
  Minus,
} from 'lucide-react'
import DataTree from './data-tree'
import { VerifiedBadge, UnVerifiedBadge } from '@/components/ui/custom-badges'

const vehicleData = {
  vehicle_name: 'Fleet Vehicle 01',
  plate_number: 'ABC-1234',
  brand: 'Toyota',
  model: 'Camry',
  manuf_year: 2023,
  can_bitrate: '500000',
  fuel_type: 'gasoline',
  gear_type: 'automatic',
  num_tire: 4,
  isdeleted: false,
  deletedAt: '2025-07-02T08:13:18.475Z',
}
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
      <span className="text-sm tracking-tight font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{value}</span>
    </div>
  </div>
)

export default function CompanyDetails({
  detail,
}: {
  detail: ApiResponseType<'GET /companies/id'>
}) {
  const { company } = detail

  return (
    <div className="min-h-screen">
      <div className=" grid gap-6 lg:grid-cols-9">
        <div className="lg:col-span-2">
          <DataTree detail={detail} />
        </div>
        <div className="lg:col-span-7 space-y-5">
          <Card className="shadow-none px-5">
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
                  icon={<Phone size={15} />}
                  label="Main Contact"
                  value={company.phone}
                />
                <InfoRow
                  icon={<Mail size={15} />}
                  label="Email"
                  value={company.email}
                />
                <InfoRow
                  icon={<Globe size={15} />}
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
                  icon={<UserCircle size={15} />}
                  label="Contact Person"
                  value={company.contact_person}
                />
                <InfoRow
                  icon={<Phone size={15} />}
                  label="Contact Phone"
                  value={company.contact_phone}
                />
                <InfoRow
                  icon={<Building size={15} />}
                  label="Registration No."
                  value={company.reg_number}
                />
              </div>
              <div className="space-y-4">
                <InfoRow
                  icon={<MapPin size={15} />}
                  label="Address"
                  value={
                    <div>
                      {`${company.address.street}`}
                      <br />
                      <span className="leading-4">{`${company.address.state}, ${company.address.country} (${company.address.postal_code})`}</span>
                    </div>
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none px-5">
            <CardHeader>
              <div className="flex items-center gap-x-3">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  12가3456
                </CardTitle>
                <Badge variant="outline" className="text-muted-foreground">
                  {`Vehicle`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <InfoRow
                  icon={
                    <Minus size={12} className="mt-[.125rem]" stroke="#000" />
                  }
                  label="Vehicle Name"
                  value={vehicleData.vehicle_name}
                />
                <InfoRow
                  icon={
                    <Minus size={12} className="mt-[.125rem]" stroke="#000" />
                  }
                  label="Brand"
                  value={vehicleData.brand}
                />
                <InfoRow
                  icon={
                    <Minus size={12} className="mt-[.125rem]" stroke="#000" />
                  }
                  label="Model"
                  value={vehicleData.model}
                />
              </div>
              <div className="space-y-4">
                <InfoRow
                  icon={
                    <Minus size={12} className="mt-[.125rem]" stroke="#000" />
                  }
                  label="Manufacture Year"
                  value={vehicleData.manuf_year}
                />
                <InfoRow
                  icon={
                    <Minus size={12} className="mt-[.125rem]" stroke="#000" />
                  }
                  label="Fuel Type"
                  value={vehicleData.fuel_type}
                />
                <InfoRow
                  icon={
                    <Minus size={12} className="mt-[.125rem]" stroke="#000" />
                  }
                  label="Gear Type"
                  value={vehicleData.gear_type}
                />
              </div>
              <div className="space-y-4">
                <InfoRow
                  icon={
                    <Minus size={12} className="mt-[.125rem]" stroke="#000" />
                  }
                  label="Can Bitrate"
                  value={vehicleData.can_bitrate}
                />
                <InfoRow
                  icon={
                    <Minus size={12} className="mt-[.125rem]" stroke="#000" />
                  }
                  label="Number of Tires"
                  value={vehicleData.num_tire}
                />
                {/* <InfoRow
                  icon={
                    <Minus size={12} className="mt-[.125rem]" stroke="#000" />
                  }
                  label="Model"
                  value={vehicleData.model}
                /> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
