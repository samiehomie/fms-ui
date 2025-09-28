'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { VehicleReference } from '@/types/api/vehicle.types'

interface VehicleListProps {
  vehicles: VehicleReference[]
  selectedVehicleId?: number
  onVehicleSelectAction: (vehicleId: number) => void
}

export default function VehicleList({ vehicles, selectedVehicleId, onVehicleSelectAction }: VehicleListProps) {
  return (
    <div className="space-y-2">
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle.id}
          className={`cursor-pointer transition-colors hover:bg-muted/50  ${
            selectedVehicleId === vehicle.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onVehicleSelectAction(vehicle.id)}
        >
          <CardHeader className="">
            <CardTitle className="text-lg">{vehicle.plate_number}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Brand:</span> {vehicle.brand}
              </div>
              <div>
                <span className="font-medium">Model:</span> {vehicle.model}
              </div>
              <div>
                <span className="font-medium">Year:</span> {vehicle.manuf_year}
              </div>
              <div>
                <span className="font-medium">Fuel:</span> {vehicle.fuel_type}
              </div>
              <div>
                <span className="font-medium">Gear:</span> {vehicle.gear_type}
              </div>
              <div>
                <span className="font-medium">Tires:</span> {vehicle.num_tire}
              </div>
            </div>
            {/* <div className="flex justify-between items-center mt-3">
              <Badge variant={vehicle.isdeleted ? 'destructive' : 'default'}>
                {vehicle.isdeleted ? 'Inactive' : 'Active'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {vehicle.can_bitrate}
              </span>
            </div> */}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}