import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, User, MapPin, Clock } from "lucide-react"
import type { VehicleStatus } from "@/constants/mock_data/dashboard"

interface VehicleStatusListProps {
  vehicles: VehicleStatus[]
}

const getStatusColor = (status: VehicleStatus["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "idle":
      return "bg-yellow-100 text-yellow-800"
    case "maintenance":
      return "bg-orange-100 text-orange-800"
    case "offline":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function VehicleStatusList({ vehicles }: VehicleStatusListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{vehicle.plateNumber}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {vehicle.driver}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {vehicle.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {vehicle.lastUpdate}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                {vehicle.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
