'use client'

import { useState } from 'react'
import { useTripTpmsDetails } from '@/lib/query-hooks/use-vehicles'
import type { TripTpmsDetailsQuery } from '@/types/features/trips/trip.types'
import { Skeleton } from '@/components/ui/skeleton'

interface TripTpmsTableProps {
  selectedId: number
}

export default function TripTpmsTable({ selectedId }: TripTpmsTableProps) {
  const [query, setQuery] = useState<Omit<TripTpmsDetailsQuery, 'id'>>({
    page: 1,
    limit: 10,
  })

  const { data: tpmsData, isLoading } = useTripTpmsDetails({
    ...query,
    id: selectedId,
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
