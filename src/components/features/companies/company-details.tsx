'use client'

import { useState } from 'react'
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
import CompanyVehiclesContent from '@/components/features/companies/vehicles/company-vehicles-content'
import { TripHistorySidebar } from './sub-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

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
      {/* <span className="text-sm tracking-tight font-medium text-muted-foreground">
        {label}
      </span> */}
      <span className="text-sm tracking-wide">{value}</span>
    </div>
  </div>
)

export default function CompanyDetails({
  detail,
  companyId,
}: {
  detail: ApiResponseType<'GET /companies/id'>
  companyId: number
}) {
  const { company } = detail
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex flex-1">
      <TripHistorySidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col pl-[1.625rem] pt-5">
        <CompanyVehiclesContent companyId={companyId} />
        {/* <div className="flex-1 grid gap-x-12 lg:grid-cols-11">
            <div className="lg:col-span-2 h-full flex flex-col relative">
              <DataTree detail={detail} />

              <div className="absolute bg-gray-200/90 w-[1px] h-[100%] -translate-y-1/2 top-1/2 right-[-23px]" />
            </div>
            <div className="lg:col-span-9 space-y-5 grid grid-cols-3 gap-x-5 self-start">
              <Card className="shadow-none px-3 gap-3">
            <CardHeader>
              <div className="flex gap-x-3 items-start">
                <div>
                  <CardTitle className="text-xl leading-none font-bold flex items-center gap-y-2 gap-x-2">
                    {company.name}
                    <Badge
                      variant="outline"
                      className="text-muted-foreground ml-1 text-[11px] rounded-sm"
                    >
                      {company.type}
                    </Badge>
                    {company.verified ? (
                      <VerifiedBadge className="text-[11px] rounded-sm" />
                    ) : (
                      <UnVerifiedBadge className="text-[11px] rounded-sm" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1 ml-[.125rem] text-sm">
                    {company.details}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="">
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
                icon={<Building size={15} />}
                label="Registration No."
                value={company.reg_number}
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
            </CardContent>
          </Card>
          <Card className="shadow-none px-5">
            <CardHeader>
              <div className="flex gap-x-3 items-start">
                <div>
                  <CardTitle className="text-2xl  leading-none font-bold flex items-center gap-y-2 gap-x-2">
                    {company.name}
                    <Badge
                      variant="outline"
                      className="text-muted-foreground ml-1"
                    >
                      {company.type}
                    </Badge>
                    {company.verified ? <VerifiedBadge /> : <UnVerifiedBadge />}
                  </CardTitle>
                  <CardDescription className="mt-1 ml-[.125rem]">
                    {company.details}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none px-5">
            <CardHeader>
              <div className="flex gap-x-3 items-start">
                <div>
                  <CardTitle className="text-2xl  leading-none font-bold flex items-center gap-y-2 gap-x-2">
                    {company.name}
                    <Badge
                      variant="outline"
                      className="text-muted-foreground ml-1"
                    >
                      {company.type}
                    </Badge>
                    {company.verified ? <VerifiedBadge /> : <UnVerifiedBadge />}
                  </CardTitle>
                  <CardDescription className="mt-1 ml-[.125rem]">
                    {company.details}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>
          </div> */}
      </div>
    </div>
  )
}
