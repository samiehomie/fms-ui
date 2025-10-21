'use client'

import { useState } from 'react'
import { useTripTpmsDetails } from '@/lib/query-hooks/use-vehicles'
import type { TripTpmsDetailsQuery } from '@/types/features/trips/trip.types'
import { Skeleton } from '@/components/ui/skeleton'
import TPMSDataTable from '../../tpms-data-table/tpms-data-table'
import { TripPagination } from './trip-pagination'

interface TripTpmsTableProps {
  selectedId: number
  numTire: number
}

const rows = 13

export default function TripTpmsTable({
  selectedId,
  numTire,
}: TripTpmsTableProps) {
  const [query, setQuery] = useState<
    Omit<TripTpmsDetailsQuery, 'id' | 'limit'>
  >({
    page: 1,
  })

  const { data: tpmsData, isLoading } = useTripTpmsDetails({
    page: query.page,
    id: selectedId,
    limit: numTire * rows,
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

  if (!tpmsData) return null

  console.log(tpmsData.data)
  return (
    <div className="ml-3 flex-1 flex flex-col ">
      <div
        className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 bg-[#424656] border-[1px_1px_0px_1px] border-[#424656]
    rounded-[4px_4px_0px_0px] h-[44px]"
      >
        <div className="text-white">TEST</div>
      </div>
      <TPMSDataTable
        data={tpmsData.data}
        pressureUnit="PSI"
        temperatureUnit="°C"
        numTire={4}
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
    </div>
  )
}
