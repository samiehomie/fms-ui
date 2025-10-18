'use client'

import { useState, useCallback } from 'react'
import { DateRangePicker } from '@/components/ui/data-range-picker'
import TripContent from './trip-content'
import type { VehicleTripsQuery } from '@/types/features/vehicle/vehicle.types'

export default function TripContainer({ vehicleId }: { vehicleId: string }) {
  const [query, setQuery] = useState<Omit<VehicleTripsQuery, 'id'>>({
    page: 1,
    limit: 6,
    status: undefined,
    startDate: undefined,
    endDate: undefined,
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

  return (
    <div className="flex-1 w-full bg-background text-foreground flex flex-col">
      <header className="flex items-center justify-between mb-8  shrink-0">
        <h1 className="text-xl font-semibold leading-none sm:text-3xl tracking-tight">
          Trips History
        </h1>
        <DateRangePicker onDateChange={handleDateRangeChange} />
      </header>
      <TripContent vehicleId={vehicleId} setQuery={setQuery} query={query} />
    </div>
  )
}
