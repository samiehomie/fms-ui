'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Tractor, Clock, Route, List, ListCheck } from 'lucide-react'
import { formatSeconds } from '@/lib/utils/date-formatter'

interface TripOverviewProps {
  totalDriveTime: number
  activeTrips: number
  totalDistance: number
  totalTrips: number
  vehicleName: string
  onToggleSelectAll: () => void
  areAllSelected: boolean
}

const StatCard = ({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType
  value: string | number
  label?: string
}) => (
  <div className="flex items-center gap-2 text-xs">
    <Icon className="h-4 w-4 text-slate-300" />
    <div>
      <span className="font-medium">{value}</span>
      {label && <span className="text-slate-300 ml-1">{label}</span>}
    </div>
  </div>
)

export function TripOverview({
  totalDriveTime,
  activeTrips,
  totalDistance,
  totalTrips,
  vehicleName,
  onToggleSelectAll,
  areAllSelected,
}: TripOverviewProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 bg-[#424656] 
    rounded-[4px_4px_0px_0px]"
    >
      <div className="flex items-center gap-2">
        <Tractor className="h-5 w-5 text-primary" stroke="#fff" />
        <span className="font-semibold text-white text-sm ">{vehicleName}</span>
      </div>
      <div className="flex flex-wrap items-center justify-evenly flex-1 gap-y-2 text-white">
        <StatCard icon={List} label="Trips" value={totalTrips} />
        <StatCard icon={ListCheck} label="Active" value={activeTrips} />
        <StatCard
          icon={Clock}
          label="Driving"
          value={formatSeconds(totalDriveTime)}
        />
        <StatCard icon={Route} label="km" value={totalDistance} />
      </div>
      <Button
        variant="secondary"
        onClick={onToggleSelectAll}
        size={'sm'}
        className="tracking-[-0.018em] px-3 h-7 rounded-[4px] text-xs"
      >
        {areAllSelected ? 'Hide All Trips' : 'Show All Trips'}
      </Button>
    </div>
  )
}
