import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import {
  IconTrendingDown,
  IconTrendingUp,
  IconMinus,
} from "@tabler/icons-react"
import { DataDirection } from "@/types/features/dashboard/dashbaord.enum"

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: DataDirection
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
}: MetricCardProps) {
  const getChangeIcon = () => {
    switch (changeType) {
      case DataDirection.UP:
        return <IconTrendingUp />
      case DataDirection.DOWN:
        return <IconTrendingDown />
      case DataDirection.STABLE:
        return <IconMinus />
      default:
        return
    }
  }

  return (
    <Card className="gap-3 flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-[400]">{title}</CardTitle>
        {change && (
          <CardAction>
            <Badge variant="outline">
              {getChangeIcon()}
              {change}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
