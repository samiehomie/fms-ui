'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Truck, Calendar, Fuel, Settings, Building } from 'lucide-react'
import { VehiclesGetResponse } from '@/types/features/vehicles/vehicle.types'

interface VehicleListProps {
  vehicles: VehiclesGetResponse
  selectedVehicleId: number | undefined
  onVehicleSelect: (vehicle: VehiclesGetResponse[number]) => void
}

export function VehicleList({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
}: VehicleListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const getStatusColor = (vehicle:  VehiclesGetResponse[number]) => {
    if (vehicle.isdeleted) return 'bg-red-100 text-red-800'
    // if (vehicle.tires.length === 0) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (vehicle:  VehiclesGetResponse[number]) => {
    if (vehicle.isdeleted) return 'Inactive'
    // if (vehicle.tires.length === 0) return 'No Tires'
    return 'Active'
  }

  return (
    <Card className="h-full shadow-none border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          Vehicle List ({vehicles.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-2 p-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => onVehicleSelect(vehicle)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedVehicleId === vehicle.id
                    ? 'bg-muted border-primary'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{vehicle.plateNumber}</h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.brand} {vehicle.model} ({vehicle.manufactureYear})
                    </p>
                  </div>
                  {/* <Badge className={getStatusColor(vehicle)}>
                    {getStatusText(vehicle)}
                  </Badge> */}
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building className="h-3 w-3" />
                    <span>{vehicle.company.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-3 w-3" />
                    <span>{vehicle.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-3 w-3" />
                    <span>{vehicle.numTire} Tires</span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Updated: {formatDate(vehicle.updated_at)}</span>
                  </div> */}
                </div>

                {/* {vehicle.tires.length > 0 && (
                  <div className="mt-3 pt-2 border-t">
                    <div className="flex flex-wrap gap-1">
                      {vehicle.tires.map((tire) => (
                        <Badge
                          key={tire.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {tire.tire_location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
