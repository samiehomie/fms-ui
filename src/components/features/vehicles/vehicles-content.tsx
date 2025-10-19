'use client'
import { DataTable } from '@/components/ui/data-table'
import { useState } from 'react'
import { useAllVehicles } from '@/lib/query-hooks/useVehicles'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import DataTableHeader from './data-table-header'
import type { VehiclesGetQuery } from '@/types/features/vehicle/vehicle.types'

const VehiclesContent = () => {
  const [pageParams, setPageParams] = useState<VehiclesGetQuery>({
    page: 1,
    limit: 10,
    includeDeleted: true,
    search: '',
  })

  const { data: vehiclesData, isLoading } = useAllVehicles(pageParams)

  if (isLoading || !vehiclesData) {
    return (
      <div className="col-span-3 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  if (!vehiclesData.pagination) return null

  return (
    <div className="col-span-3">
      <div className="mb-3">
        <DataTableHeader
          setPagination={setPageParams}
          pagination={pageParams}
        />
      </div>
      <DataTable
        columns={columns}
        data={vehiclesData.data}
        pagination={pageParams}
        setPagination={setPageParams}
        totalCount={vehiclesData.pagination.total}
        hiddenColumns={{
          isDeleted: false,
        }}
      />
    </div>
  )
}

export default VehiclesContent
