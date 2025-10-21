'use client'

import { useState, useEffect, FC } from 'react'
import { useTripGpsDetailsBatch } from '@/lib/query-hooks/use-vehicles'
import { useReverseGeocode } from '@/lib/query-hooks/use-geocoding'

interface TripAddressCellProps {
  visibleIds: number[]
}

interface Postion {
  start: { lat: string | null; lng: string | null }
  end: { lat: string | null; lng: string | null }
}

const TripAddressCell: FC<TripAddressCellProps> = ({ visibleIds }) => {
  const [position, setPosition] = useState<Postion>({
    start: { lat: null, lng: null },
    end: { lat: null, lng: null },
  })
  const { data: tripDetailsMap, isLoading: tripLoading } =
    useTripGpsDetailsBatch(visibleIds)

  const { data: startAddress, isError } = useReverseGeocode(
    position.start.lat,
    position.start.lng,
  )

  useEffect(() => {
    if (tripDetailsMap) {
      const start = tripDetailsMap
    }
  }, [tripDetailsMap])

  return (
    <div className="flex items-center pl-4 text-xs">
      <div>
        {startAddress && <div>{startAddress}</div>}
        {/* <div className="text-muted-foreground flex gap-x-1 items-center">
          <MoveRight className="leading-none" size={15} />
          {session.endLocation}
        </div> */}
      </div>
    </div>
  )
}
