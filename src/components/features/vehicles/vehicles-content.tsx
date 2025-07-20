'use client'
import { DataTable } from '@/components/ui/data-table'
import { useState } from 'react'
import { useVehiclesPaginated } from '@/lib/hooks/queries/useVehicles'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import DataTableHeader from './data-table-header'
import type { ApiParamsType } from '@/types/api'

const VehiclesContent = () => {
  const [pageParams, setPageParams] = useState<ApiParamsType<'GET /vehicles'>>({
    page: 1,
    limit: 10,
    include_deleted: true,
    search: '',
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
        hiddenColumns={{
          isDeleted: false,
        }}
      />
    </div>
  )
}

export default VehiclesContent
