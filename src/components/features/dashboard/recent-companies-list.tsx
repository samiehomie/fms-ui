import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Company } from '@/types/api/company.types'

export function RecentCompaniesList({ companies }: { companies: Company[] }) {
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
            {/* <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
              <AvatarImage
                // src={company.logo || '/placeholder.svg'}
                alt={company.name}
              />
              <AvatarFallback>
                <Building2 className="w-5 h-5 text-slate-400" />
              </AvatarFallback>
            </Avatar> */}
            <div className="flex-1">
              <div className="flex items-center gap-x-3">
                <p className="text-sm font-medium text-[#0f172a] dark:text-slate-50">
                  {company.name}
                </p>
                <Badge
                  variant={'outline'}
                  className="text-[9px] py-[3px] px-[5px] font-[400]"
                >
                  {company.type}
                </Badge>
              </div>
              <div className=' text-muted-foreground text-xs'>{company.website}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
