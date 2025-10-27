"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ChevronsRight, Truck, Signal } from "lucide-react"

interface Vehicle {
  id: number
  plate_number: string
  lat: number
  lng: number
  heading: number
}

interface VehicleListSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  vehicles: Vehicle[]
  onVehicleSelect: (vehicle: Vehicle) => void
  selectedVehicleId: number | null
}

export function VehicleListSidebar({
  isCollapsed,
  onToggle,
  vehicles,
  onVehicleSelect,
  selectedVehicleId,
}: VehicleListSidebarProps) {
  return (
    <div
      className={cn(
        "bg-background border-l relative transition-all duration-300 ease-in-out",
        isCollapsed ? "w-0" : "w-72",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 bg-background border rounded-full h-8 w-8"
      >
        <ChevronsRight
          className={cn(
            "h-4 w-4 transition-transform",
            !isCollapsed && "rotate-180",
          )}
        />
      </Button>
      <div
        className={cn(
          "h-full flex flex-col transition-opacity",
          isCollapsed && "opacity-0",
        )}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Active Vehicles ({vehicles.length})
          </h2>
        </div>
        <ScrollArea className="flex-1">
          {vehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => onVehicleSelect(vehicle)}
              className={cn(
                "w-full text-left p-3 flex items-center gap-3 hover:bg-muted",
                selectedVehicleId === vehicle.id && "bg-muted",
              )}
            >
              <Signal className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">{vehicle.plate_number}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {vehicle.id}
                </p>
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
