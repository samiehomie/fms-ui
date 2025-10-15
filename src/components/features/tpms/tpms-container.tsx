'use client'

import { useState, useCallback } from 'react'
import type { VehicleTripsPaginationParams } from '@/types/api/vehicle.types'
import { DateRangePicker } from '@/components/ui/data-range-picker'
import TpmsContent from './tpms-content'

export default function TpmsContainer({ vehicleId }: { vehicleId: number }) {
  const [pageParams, setPageParams] = useState<VehicleTripsPaginationParams>({
    page: 1,
    limit: 6,
    status: '',
    start_date: undefined,
    end_date: undefined,
  })

  const handleDateRangeChange = useCallback(
    (dateRange: { from: string; to: string } | null) => {
      if (dateRange) {
        setPageParams((old) => ({
          ...old,
          start_date: dateRange.from,
          end_date: dateRange.to,
        }))
      }
    },
    [setPageParams],
  )

  return (
    <div className="flex-1 w-full bg-background text-foreground flex flex-col">
      <header className="flex items-center justify-between mb-8  shrink-0">
        <h1 className="text-xl font-semibold leading-none sm:text-3xl tracking-tight">
          Trips History
        </h1>
        <DateRangePicker onDateChange={handleDateRangeChange} />
      </header>
      <TpmsContent
        vehicleId={vehicleId}
        setPageParams={setPageParams}
        pageParams={pageParams}
      />
    </div>
  )
}
