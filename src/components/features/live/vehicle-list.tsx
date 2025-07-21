'use client'

import React, { useMemo } from 'react'
import { Vehicle } from '@/lib/hooks/queries/useVehicleStream'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Search, Truck, Car, Bus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VehicleListProps {
  vehicles: Vehicle[]
  selectedVehicleId: string | null
  onVehicleSelect: (vehicleId: string) => void
}

const VehicleIcon = ({ type }: { type: Vehicle['type'] }) => {
  const icons = {
    sedan: Car,
    truck: Truck,
    bus: Bus,
    van: Car,
  }
  const Icon = icons[type] || Car
  return <Icon className="w-4 h-4" />
}

const StatusBadge = ({ status }: { status: Vehicle['status'] }) => {
  const variants = {
    active: 'bg-green-500',
    idle: 'bg-yellow-500',
    maintenance: 'bg-gray-500',
  }

  const labels = {
    active: '운행중',
    idle: '대기중',
    maintenance: '정비중',
  }

  return (
    <Badge className={cn('text-white', variants[status])}>
      {labels[status]}
    </Badge>
  )
}

export default function VehicleList({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
}: VehicleListProps) {
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return vehicles

    const term = searchTerm.toLowerCase()
    return vehicles.filter(
      (vehicle) =>
        vehicle.name.toLowerCase().includes(term) ||
        vehicle.driver.toLowerCase().includes(term) ||
        vehicle.type.toLowerCase().includes(term),
    )
  }, [vehicles, searchTerm])

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-3">차량 목록</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="차량명, 운전자 검색..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-3 text-sm text-gray-600">
          총 {filteredVehicles.length}대 / {vehicles.length}대
        </div>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="p-4 space-y-2">
          {filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className={cn(
                'p-3 cursor-pointer transition-all hover:shadow-md',
                selectedVehicleId === vehicle.id &&
                  'ring-2 ring-blue-500 bg-blue-50',
              )}
              onClick={() => onVehicleSelect(vehicle.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <VehicleIcon type={vehicle.type} />
                  <div>
                    <div className="font-medium">{vehicle.name}</div>
                    <div className="text-sm text-gray-600">
                      {vehicle.driver}
                    </div>
                  </div>
                </div>
                <StatusBadge status={vehicle.status} />
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">속도:</span>
                  <span className="ml-1 font-medium">{vehicle.speed}km/h</span>
                </div>
                <div>
                  <span className="text-gray-500">연료:</span>
                  <span className="ml-1 font-medium">
                    {vehicle.fuel.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="mt-1 text-xs text-gray-400">
                마지막 업데이트:{' '}
                {new Date(vehicle.lastUpdate).toLocaleTimeString()}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
