'use client'

import { useState } from 'react'
import { useTripTpmsDetails } from '@/lib/query-hooks/use-vehicles'
import type { TripTpmsDetailsQuery } from '@/types/features/trips/trip.types'
import { Skeleton } from '@/components/ui/skeleton'

interface TripTpmsTableProps {
  selectedId: number
  numTire: number
}

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
    ...query,
    id: selectedId,
    limit: numTire,
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

  return <pre>{JSON.stringify(tpmsData?.data, null, 2)}</pre>
}
