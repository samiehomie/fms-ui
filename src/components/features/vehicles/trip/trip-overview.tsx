'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import type { TripSession } from './types'
import { Car, Clock, Route, List, ParkingCircle } from 'lucide-react'

interface TripOverviewProps {
  sessions: TripSession[]
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
  sessions,
  vehicleName,
  onToggleSelectAll,
  areAllSelected,
}: TripOverviewProps) {
  const stats = React.useMemo(() => {
    const totalDriveTime = sessions.reduce((sum, s) => sum + s.driveTime, 0)
    const totalIdleTime = sessions.reduce((sum, s) => sum + s.idleTime, 0)
    const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0)
    const totalTrips = sessions.length

    const formatTime = (minutes: number) => {
      const h = Math.floor(minutes / 60)
      const m = minutes % 60
      return `${h}h ${m}m`
    }

    return {
      driveTime: formatTime(totalDriveTime),
      idleTime: formatTime(totalIdleTime),
      distance: `${totalDistance.toLocaleString()} km`,
      trips: totalTrips.toString(),
    }
  }, [sessions])

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 border-b bg-[#3c5063] rounded-[4px]">
      <div className="flex items-center gap-2">
        <Car className="h-5 w-5 text-primary" stroke="#fff" />
        <span className="font-semibold text-white text-sm ">{vehicleName}</span>
      </div>
      <div className="flex flex-wrap items-center justify-evenly flex-1 gap-y-2 text-white">
        <StatCard icon={List} label="Trips" value={stats.trips} />
        <StatCard icon={Clock} label="Driving" value={stats.driveTime} />
        <StatCard icon={ParkingCircle} label="Idle" value={stats.idleTime} />
        <StatCard icon={Route} label="Distance" value={stats.distance} />
      </div>
      <Button variant="outline" onClick={onToggleSelectAll} size={'sm'} className='text-sm'>
        {areAllSelected ? 'Hide All Trips' : 'Show All Trips'}
      </Button>
    </div>
  )
}
