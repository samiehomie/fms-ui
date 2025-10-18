'use client'

import { useState } from 'react'
import type { ApiResponseType } from '@/types/features'
import type React from 'react'
import type { CompanyDetail } from '@/types/features/company.types'
import CompanyVehiclesContent from '@/components/features/companies/vehicles/company-vehicles-content'
import SubSidebar from './sub-sidebar'
import CompanyDetailContent from './detail/company-detail-content'

export type NavItems = 'Company' | 'Users' | 'Vehicles' | 'Devices'

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

export default function CompanyDetails({
  detail,
  companyId,
}: {
  detail: ApiResponseType<'GET /companies/{id}'>
  companyId: number
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState<NavItems>('Company')

  return (
    <div className="flex flex-1">
      <SubSidebar
        isCollapsed={isSidebarCollapsed}
        activeNavItem={activeNavItem}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        setActiveNavItem={setActiveNavItem}
      />
      <div className="flex-1 flex flex-col pl-[1.8rem] pt-5 pb-10">
        {activeNavItem === 'Vehicles' && (
          <CompanyVehiclesContent companyId={companyId} />
        )}
        {activeNavItem === 'Company' && (
          <CompanyDetailContent
            company={detail.company}
            handleClick={() => setActiveNavItem('Vehicles')}
          />
        )}
      </div>
    </div>
  )
}
