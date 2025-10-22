'use client'

import { useState, useCallback } from 'react'
import { useTripTpmsDetails } from '@/lib/query-hooks/use-vehicles'
import type { TripTpmsDetailsQuery } from '@/types/features/trips/trip.types'
import { Skeleton } from '@/components/ui/skeleton'
import TPMSDataTable from '../../tpms-data-table/tpms-data-table'
import { TripPagination } from './trip-pagination'
import { Button } from '@/components/ui/button'
import type {
  PressureUnit,
  TemperatureUnit,
} from '@/lib/utils/unit-conversions'
import { TireMultiSelect } from './tire-multi-select'
import { DateRangePicker } from '@/components/ui/data-range-picker'

interface TripTpmsTableProps {
  selectedId: number
  numTire: number
  pressureUnit: PressureUnit
  temperatureUnit: TemperatureUnit
  tireLocations: string[]
  selectedTires: string[]
  startDate?: string
  endDate?: string
}

const rows = 15

export default function TripTpmsTable({
  selectedId,
  numTire,
  startDate,
  endDate,
  pressureUnit,
  temperatureUnit,
  selectedTires,
  tireLocations,
}: TripTpmsTableProps) {
  const [query, setQuery] = useState<
    Omit<TripTpmsDetailsQuery, 'id' | 'limit'>
  >({
    page: 1,
    endDate,
    startDate,
  })

  const { data: tpmsData, isLoading } = useTripTpmsDetails({
    page: query.page,
    id: selectedId,
    limit: numTire * rows,
    endDate: query.endDate,
    startDate: query.startDate,
  })

  if (isLoading)
    return (
      <div className="flex flex-col gap-y-2">
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-full h-5" />
      </div>
    )

  if (!tpmsData || !tpmsData.data) return null

  // TODO 해당 trip 차량의 numTire는 일정할 것이라는 가정에 동작함

  return (
    <>
      <TPMSDataTable
        data={tpmsData.data}
        tireLocations={tireLocations}
        pressureUnit={pressureUnit}
        temperatureUnit={temperatureUnit}
        selectedTires={selectedTires}
        numTire={numTire}
      />
      <TripPagination
        currentPage={query.page ?? 1}
        totalPages={tpmsData.pagination!.totalPages}
        onPageChange={(page) => {
          setQuery({
            ...query,
            page,
          })
        }}
      />
    </>
  )
}
