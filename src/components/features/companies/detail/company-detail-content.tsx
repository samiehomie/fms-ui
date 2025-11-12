import type React from 'react'
import { companyData } from './data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Building,
  Mail,
  Phone,
  Globe,
  User,
  Truck,
  CheckCircle2,
  MapPin,
  Hash,
  Briefcase,
  ClockPlus,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import type { CompanyByIdResponse } from '@/types/features/companies/company.types'
import { VerifiedBadge, UnVerifiedBadge } from '@/components/ui/custom-badges'
import { formatDateTime } from '@/lib/utils/date-formatter'

const CompanyLocationMap = dynamic(() => import('./company-location-map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted rounded-lg animate-pulse" />
  ),
})

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) => (
  <div className="flex flex-col leading-none gap-y-1">
    <div className="flex items-center gap-x-1">
      <Icon className="h-[.87rem] w-[.87rem] text-muted-foreground shrink-0" />
      <p className="text-[13px] text-muted-foreground">{label}</p>
    </div>
    <div className="flex items-center gap-x-1">
      <div className="h-[.87rem] w-[.87rem]" />
      <p className="font-medium text-[14px]">{value}</p>
    </div>
  </div>
)

export default function CompanyDetailContent({
  company,
  handleClick,
}: {
  company: CompanyByIdResponse['company']
  handleClick: () => void
}) {
  const { name, verified, users = [], vehicles = [], address } = company

  return (
    <div className="flex flex-col flex-1 ">
      <header className="flex items-center justify-between pb-2 pl-2 pt-5 border-b shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold sm:text-[1.625rem]">{name}</h1>
          {verified ? <VerifiedBadge /> : <UnVerifiedBadge />}
        </div>
      </header>
      <main className="flex-1 overflow-y-auto pt-5 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
            <Card className="shadow-none relative flex-1">
              {/* <div className='h-[60%] absolute left-1/2 w-[1px] bg-gray-200 top-1/2 -translate-y-1/2 -translate-x-5' /> */}
              <CardHeader>
                <CardTitle className="flex items-baseline gap-x-1 text-[1.2rem] leading-tight">
                  <Building size={17} />
                  Company Information
                </CardTitle>
                <p className="text-[12.5px] text-muted-foreground tracking-[-0.019em] ml-[2px] font-light">
                  {company.details}
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <InfoItem
                  icon={Hash}
                  label="Reg Number"
                  value={company.reg_number}
                />
                <InfoItem
                  icon={Briefcase}
                  label="Business Type"
                  value={company.type}
                />
                <InfoItem icon={Phone} label="Phone" value={company.phone} />
                <InfoItem icon={Mail} label="Email" value={company.email} />
                <InfoItem
                  icon={Globe}
                  label="Website"
                  value={company.website}
                />

                <InfoItem
                  icon={User}
                  label="Contact Person"
                  value={company.contact_person}
                />
                <InfoItem
                  icon={Phone}
                  label="Contact Phone"
                  value={company.contact_phone}
                />
                <InfoItem
                  icon={ClockPlus}
                  label="Created at"
                  value={formatDateTime(company.created_at)}
                />
              </CardContent>
            </Card>
            <Card className="flex-1 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-baseline gap-x-1 text-[1.2rem] leading-tight">
                  <MapPin size={18} className="mt-[2px]" />
                  Address
                </CardTitle>
                <p className="text-[13.5px] text-muted-foreground tracking-[-0.019em] ml-[2px] font-light">
                  {`${address.street}, ${address.city}, ${address.country} (${address.postal_code})`}
                </p>
              </CardHeader>
              <CardContent className="h-80">
                <CompanyLocationMap
                  lat={companyData.address.latitude}
                  lng={companyData.address.longitude}
                  popupText={name}
                />
              </CardContent>
            </Card>
          </div>
          {/* Right Column */}
          <div className="space-y-6 flex flex-col h-full">
            <Card className="shadow-none relative flex-1 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Users
                </CardTitle>
                <Badge variant="outline">{users.length}</Badge>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2 text-sm">
                  {users.slice(0, 3).map((user) => (
                    <li key={user.id} className="flex justify-between">
                      <span>{user.username}</span>
                      <span className="text-muted-foreground">{user.role}</span>
                    </li>
                  ))}
                </ul>
                {users.length > 3 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ...and {users.length - 3} more
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-auto bg-transparent"
                >
                  View All Users
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-none relative flex-1 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" /> Vehicles
                </CardTitle>
                <Badge variant="outline">{vehicles.length}</Badge>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2 text-sm">
                  {vehicles.slice(0, 3).map((vehicle) => (
                    <li key={vehicle.id}>
                      <span>{vehicle.plate_number}</span>
                    </li>
                  ))}
                </ul>
                {vehicles.length > 3 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ...and {vehicles.length - 3} more
                  </p>
                )}
                <Button
                  onClick={handleClick}
                  variant="outline"
                  size="sm"
                  className="w-full mt-auto bg-transparent"
                >
                  View All Vehicles
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
