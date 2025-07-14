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
} from 'lucide-react'
import dynamic from 'next/dynamic'
import type { CompanyByIdResponse } from '@/types/api/company.types'

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
  <div className="flex items-start gap-3">
    <Icon className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
)

export default function CompanyDetailContent({
  company,
}: {
  company: CompanyByIdResponse['company']
}) {
  const { name, verified, users = [], vehicles = [], address } = company

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <Building className="h-6 w-6" />
          <h1 className="text-xl font-bold sm:text-2xl">{name}</h1>
          {verified && (
            <Badge variant="secondary" className="gap-1 pl-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              Verified
            </Badge>
          )}
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={Hash}
                  label="Registration Number"
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
                  icon={MapPin}
                  label="Address"
                  value={`${address.street}, ${address.city}`}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div>{`${address.street}, ${address.city}`}</div>
                <CompanyLocationMap
                  lat={companyData.address.latitude}
                  lng={companyData.address.longitude}
                  popupText={name}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Users
                </CardTitle>
                <Badge variant="outline">{users.length}</Badge>
              </CardHeader>
              <CardContent>
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
                  className="w-full mt-4 bg-transparent"
                >
                  View All Users
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" /> Vehicles
                </CardTitle>
                <Badge variant="outline">{vehicles.length}</Badge>
              </CardHeader>
              <CardContent>
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
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 bg-transparent"
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
