'use client'

import { useState, useCallback } from 'react'
import { DateRangePicker } from '@/components/ui/data-range-picker'
import TripContent from './trip-content'
import type { VehicleTripsQuery } from '@/types/features/vehicles/vehicle.types'
import { getDefaultDateRangeFormatted } from '@/lib/utils/date-formatter'

export default function TripContainer({ vehicleId }: { vehicleId: string }) {
  const [query, setQuery] = useState<Omit<VehicleTripsQuery, 'id'>>(() => {
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

  return (
    <div className="flex-1 w-full bg-background flex flex-col">
      <header className="flex items-center justify-between mb-8  shrink-0">
        <h1 className="header-one">Trips History</h1>
        <DateRangePicker onDateChange={handleDateRangeChange} />
      </header>
      <TripContent vehicleId={vehicleId} setQuery={setQuery} query={query} />
    </div>
  )
}
