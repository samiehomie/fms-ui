import { FC } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building, Mail, Phone, Globe, UserCircle, MapPin } from 'lucide-react'
import type { CompanyByIdResponse } from '@/types/features/company.types'
import { VerifiedBadge, UnVerifiedBadge } from '@/components/ui/custom-badges'

type CompanyDetailContentProps = {
  company: CompanyByIdResponse['company']
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

const CompanyDetailContent: FC<CompanyDetailContentProps> = ({ company }) => {
  return (
    <>
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
                <Badge variant="outline" className="text-muted-foreground ml-1">
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
                <Badge variant="outline" className="text-muted-foreground ml-1">
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
    </>
  )
}

export default CompanyDetailContent
