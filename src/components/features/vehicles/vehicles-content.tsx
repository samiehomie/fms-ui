'use client'
import { DataTable } from '@/components/ui/data-table'
import type { VehiclesPaginationParams } from '@/types/api/vehicle.types'
import { useState } from 'react'
import { useVehiclesPaginated } from '@/lib/hooks/queries/useVehicles'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import DataTableHeader from './data-table-header'

const VehiclesContent = () => {
  const [pageParams, setPageParams] = useState<VehiclesPaginationParams>({
    page: 1,
    limit: 10,
    include_deleted: false,
  })

  const { data, isLoading } = useVehiclesPaginated(pageParams)

  if (isLoading || !data) {
    return (
      <div className="col-span-3 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

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
        data={data.data.vehicles}
        pagination={pageParams}
        setPagination={setPageParams}
        totalCount={data.data.pagination.total}
      />
    </div>
  )
}

export default VehiclesContent
