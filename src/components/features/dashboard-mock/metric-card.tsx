import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
}: MetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="gap-3 flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-[400]">{title}</CardTitle>
        {change && (
          <CardAction>
            <Badge variant="outline">
              {change[0] === "-" ? <IconTrendingDown /> : <IconTrendingUp />}
              {`${change}`}
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
