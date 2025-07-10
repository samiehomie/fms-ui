'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import type { TripSession } from './trip-content'
import { Car, Clock, Route, List, ParkingCircle } from 'lucide-react'
import { formatTotalDuration } from '@/lib/api/utils'

interface TripOverviewProps {
  totalDriveTime: string
  totalIdleTime: string
  totalDistance: string
  totalTrips: number
  vehicleName: string
  onToggleSelectAll: () => void
  areAllSelected: boolean
}

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) => (
  <div className="flex items-center gap-2 text-xs">
    <Icon className="h-4 w-4 text-slate-300" />
    <div>
      <span className="font-medium">{value}</span>
      <span className="text-slate-300 ml-1">{label}</span>
    </div>
  </div>
)

export function TripOverview({
  totalDriveTime,
  totalIdleTime,
  totalDistance,
  totalTrips,
  vehicleName,
  onToggleSelectAll,
  areAllSelected,
}: TripOverviewProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 border-b bg-[#414656] 
    rounded-[4px_4px_0px_0px]"
    >
      <div className="flex items-center gap-2">
        <Car className="h-5 w-5 text-primary" stroke="#fff" />
        <span className="font-semibold text-white text-sm ">{vehicleName}</span>
      </div>
      <div className="flex flex-wrap items-center justify-evenly flex-1 gap-y-2 text-white">
        <StatCard icon={List} label="Trips" value={totalTrips.toString()} />
        <StatCard icon={Clock} label="Driving" value={totalDriveTime} />
        <StatCard icon={ParkingCircle} label="Idle" value={totalIdleTime} />
        <StatCard icon={Route} label="Distance" value={totalDistance} />
      </div>
      <Button
        variant="outline"
        onClick={onToggleSelectAll}
        size={'sm'}
        className="text-sm tracking-[-0.018em] px-3"
      >
        {areAllSelected ? 'Hide All Trips' : 'Show All Trips'}
      </Button>
    </div>
  )
}
