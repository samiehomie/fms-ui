import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description: string
  Icon: LucideIcon
}

export function StatCard({ title, value, description, Icon }: StatCardProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-[#475569] dark:text-slate-400">
          {title}
        </CardTitle>
        <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#0f172a] dark:text-slate-50">
          {value}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
