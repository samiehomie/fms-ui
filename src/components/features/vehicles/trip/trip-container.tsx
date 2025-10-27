"use client"

import { useState, useCallback, useEffect } from "react"
import DateRangePicker from "@/components/ui/data-range-picker"
import TripContent from "./trip-content"
import type { VehicleTripsQuery } from "@/types/features/vehicles/vehicle.types"
import { getDefaultDateRangeFormatted } from "@/lib/utils/date-formatter"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAllVehicles } from "@/lib/query-hooks/use-vehicles"


// TODO trip 날짜 선택이 초기값으로만 작용함 
// TODO 차량 등록전 화면 구현 필요
export default function TripContainer({ vehicleId }: { vehicleId?: string }) {
  const [carId, setCarId] = useState<string>()
  const { data: vehiclesData, isLoading: vehiclesLoading } = useAllVehicles(
    {
      page: 1,
      limit: 1000,
      includeDeleted: false,
    },
    vehicleId,
  )
  const [query, setQuery] = useState<Omit<VehicleTripsQuery, "id">>(() => {
    const defaultDateRange = getDefaultDateRangeFormatted()
    return {
      page: 1,
      limit: 6,
      status: undefined,
      startDate: defaultDateRange.from,
      endDate: defaultDateRange.to,
    }
  })

  const handleDateRangeChange = useCallback(
    (dateRange: { from: string; to: string } | null) => {
      if (dateRange) {
        setQuery((old) => ({
          ...old,
          startDate: dateRange.from,
          endDate: dateRange.to,
        }))
      }
    },
    [setQuery],
  )

  useEffect(() => {
    if (vehiclesData && vehiclesData.data) {
      const vehicleCount = vehiclesData.data.length
      if (vehicleCount > 0) {
        setCarId(vehiclesData.data[vehicleCount - 1].id?.toString())
      }
    }
  }, [vehiclesData])

  return (
    <div className="flex-1 w-full bg-background flex flex-col">
      <header className="flex items-center justify-between mb-[1.375rem]  shrink-0">
        <div className="flex items-center gap-x-4">
          {vehicleId === undefined && (
            <Select
              onValueChange={(value) => setCarId(value)}
              value={carId}
              disabled={vehiclesLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    vehiclesLoading ? "Loading vehicles..." : "Select vehicle"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {vehiclesData?.data?.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.plateNumber}
                  </SelectItem>
                ))}
                {vehiclesData?.data?.length === 0 && (
                  <SelectItem value="" disabled>
                    No vehicles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}

          <DateRangePicker
            onDateChange={handleDateRangeChange}
            className="h-9"
          />
        </div>
        <div />
      </header>
      <TripContent
        vehicleId={vehicleId ?? carId}
        setQuery={setQuery}
        query={query}
      />
    </div>
  )
}
