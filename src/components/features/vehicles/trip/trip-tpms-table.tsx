"use client"

import { Dispatch, SetStateAction } from "react"
import { useTripTpmsDetails } from "@/lib/query-hooks/use-vehicles"
import type { TripTpmsDetailsQuery } from "@/types/features/trips/trip.types"
import { Skeleton } from "@/components/ui/skeleton"
import TPMSDataTable from "../../tpms-data-table/tpms-data-table"
import { TripPagination } from "./trip-pagination"
import type {
  PressureUnit,
  TemperatureUnit,
} from "@/lib/utils/unit-conversions"

interface TripTpmsTableProps {
  selectedId: number
  numTire: number
  pressureUnit: PressureUnit
  temperatureUnit: TemperatureUnit
  tireLocations: string[]
  selectedTires: string[]
  tpmsQuery: Omit<TripTpmsDetailsQuery, "id" | "limit">
  setTpmsQuery: Dispatch<
    SetStateAction<Omit<TripTpmsDetailsQuery, "id" | "limit">>
  >
}

const rows = 15

export default function TripTpmsTable({
  selectedId,
  numTire,
  pressureUnit,
  temperatureUnit,
  selectedTires,
  tireLocations,
  tpmsQuery,
  setTpmsQuery,
}: TripTpmsTableProps) {
  const { data: tpmsData, isLoading } = useTripTpmsDetails({
    page: tpmsQuery.page,
    id: selectedId,
    limit: numTire * rows,
    endDate: tpmsQuery.endDate,
    startDate: tpmsQuery.startDate,
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
        currentPage={tpmsQuery.page ?? 1}
        totalPages={tpmsData.pagination!.totalPages}
        onPageChange={(page) => {
          setTpmsQuery({
            ...tpmsQuery,
            page,
          })
        }}
      />
    </>
  )
}
