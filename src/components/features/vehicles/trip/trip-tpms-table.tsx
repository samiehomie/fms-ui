'use client'

import { useState } from 'react'
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

interface TripTpmsTableProps {
  selectedId: number
  numTire: number
}

const rows = 15

export default function TripTpmsTable({
  selectedId,
  numTire,
}: TripTpmsTableProps) {
  const [selectedTires, setSelectedTires] = useState<string[]>(['all'])
  const [pressureUnit, setPressureUnit] = useState<PressureUnit>('PSI')
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('°C')
  const [viewMode, setViewMode] = useState<'charts' | 'table'>('table')
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

  if (!tpmsData || !tpmsData.data) return null

  // TODO 해당 trip 차량의 numTire는 일정할 것이라는 가정에 동작함

  const tirePositions = tpmsData.data.slice(0, numTire)?.map((chunk) => ({
    value: chunk.tire.tireLocation,
    label: chunk.tire.tireLocation,
  }))
  return (
    <div className="ml-3 flex-1 flex flex-col ">
      <div
        className="flex flex-wrap items-center gap-x-5 px-4 bg-muted/20  border-[1px_1px_1px_1px]
    rounded-[4px_4px_0px_0px] h-[44px]"
      >
        <div className="flex flex-col gap-x-2">
          <label className="text-[9.5px] font-[200] leading-none mb-[3.5px] tracking-wide">
            View Single Tyre
          </label>
          <TireMultiSelect
            tireOptions={tirePositions}
            selectedTires={selectedTires}
            onSelectionChange={setSelectedTires}
          />
        </div>
        <div className="flex flex-col gap-x-2">
          <label className="text-[9.5px] font-[200] leading-none mb-[3.5px] tracking-wide">
            View Types
          </label>
          <div className="flex border border-border rounded-xs bg-background">
            <Button
              variant={viewMode === 'charts' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('charts')}
              className="h-4 text-[12px] rounded-none font-[300]"
            >
              Charts
            </Button>
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-4 text-[12px] rounded-none font-[300]"
            >
              Table
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-x-2 font-mono">
          <label className="text-[9.5px] font-[200] leading-none mb-[3.5px] tracking-wide">
            Pressure Units
          </label>
          <div className="flex border border-border rounded-xs bg-background">
            <Button
              variant={pressureUnit === 'PSI' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-4 text-[12px] rounded-none font-[300]"
              onClick={() => setPressureUnit('PSI')}
            >
              PSI
            </Button>
            <Button
              variant={pressureUnit === 'BAR' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-4 text-[12px] rounded-none font-[300]"
              onClick={() => setPressureUnit('BAR')}
            >
              BAR
            </Button>
            <Button
              variant={pressureUnit === 'kPa' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-4 text-[12px] rounded-none font-[300]"
              onClick={() => setPressureUnit('kPa')}
            >
              kPa
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-x-2 font-mono">
          <label className="text-[9.5px] font-[200] leading-none mb-[3.5px] tracking-wide">
            Temperature Units
          </label>
          <div className="flex border border-border rounded-xs bg-background">
            <Button
              variant={temperatureUnit === '°C' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-4 text-[12px] rounded-none font-[300]"
              onClick={() => setTemperatureUnit('°C')}
            >
              °C
            </Button>
            <Button
              variant={temperatureUnit === '°F' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-4 text-[12px] rounded-none font-[300]"
              onClick={() => setTemperatureUnit('°F')}
            >
              °F
            </Button>
            <Button
              variant={temperatureUnit === 'cff' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-4 text-[12px] rounded-none font-[300]"
              onClick={() => setTemperatureUnit('cff')}
            >
              cff
            </Button>
          </div>
        </div>
      </div>
      <TPMSDataTable
        data={tpmsData.data}
        tirePositions={tirePositions}
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
    </div>
  )
}
