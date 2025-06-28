import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Building2 } from 'lucide-react'

const companies = [
  {
    name: 'BANF Corporation',
    type: 'Customer',
    logo: '/generic-mountain-lake-logo.png',
  },
  { name: 'Bot Auto', type: 'Partners', logo: '/bot-auto-logo.png' },
  {
    name: 'Fleet Solutions Inc',
    type: 'Partners',
    logo: '/placeholder-2l59c.png',
  },
  {
    name: 'GreenTech Innovations',
    type: 'Customer',
    logo: '/greentech-logo.png',
  },
  { name: 'SmartDrive LLC', type: 'Partners', logo: '/smartdrive-logo.png' },
  {
    name: 'NextGen Logistics',
    type: 'Customer',
    logo: '/placeholder.svg?width=40&height=40',
  },
]

export function RecentCompaniesList() {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#0f172a] dark:text-slate-50">
          Recent Companies
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          Latest registered companies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {companies.map((company) => (
          <div key={company.name} className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
              <AvatarImage
                // src={company.logo || '/placeholder.svg'}
                alt={company.name}
              />
              <AvatarFallback>
                <Building2 className="w-5 h-5 text-slate-400" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#0f172a] dark:text-slate-50">
                {company.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {company.type}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
