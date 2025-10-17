'use client'
import { DataTable } from '@/components/ui/data-table'
import type { DevicesPaginationParams, Device } from '@/types/api/device.types'
import { useState } from 'react'
import { useDevicesPaginated } from '@/lib/query-hooks/useDevices'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import DataTableHeader from './data-table-header'

const DevicesContent = () => {
  const [pageParams, setPageParams] = useState<DevicesPaginationParams>({
    page: 1,
    limit: 10,
    verified: true,
    terminated: false,
    type: undefined,
  })

  const { data: edgeDeviceData, isLoading } = useDevicesPaginated(pageParams)

  if (isLoading || !edgeDeviceData) {
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
      <DataTable<Device, any, DevicesPaginationParams>
        columns={columns}
        data={edgeDeviceData.data}
        pagination={pageParams}
        setPagination={setPageParams}
        totalCount={edgeDeviceData.pagination.total}
      />
    </div>
  )
}

export default DevicesContent
