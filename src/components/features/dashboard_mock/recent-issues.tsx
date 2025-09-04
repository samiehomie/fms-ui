import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Wrench, Fuel, Siren as Tire, PenLine as Engine, HelpCircle } from "lucide-react"
import type { Issue } from "@/constants/mock_data/dashboard"

interface RecentIssuesProps {
  issues: Issue[]
}

const getIssueIcon = (type: Issue["type"]) => {
  switch (type) {
    case "maintenance":
      return Wrench
    case "fuel":
      return Fuel
    case "tire":
      return Tire
    case "engine":
      return Engine
    default:
      return HelpCircle
  }
}

const getSeverityColor = (severity: Issue["severity"]) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusColor = (status: Issue["status"]) => {
  switch (status) {
    case "open":
      return "bg-red-100 text-red-800"
    case "in-progress":
      return "bg-yellow-100 text-yellow-800"
    case "resolved":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function RecentIssues({ issues }: RecentIssuesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Recent Issues
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue) => {
            const IconComponent = getIssueIcon(issue.type)
            return (
              <div key={issue.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <IconComponent className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{issue.plateNumber}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(issue.status)}>
                        {issue.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(issue.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
