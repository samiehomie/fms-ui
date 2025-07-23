'use client'
import { DataTable } from '@/components/ui/data-table'
import type { DevicesPaginationParams, Device } from '@/types/api/device.types'
import { useState } from 'react'
import { useDevicesPaginated } from '@/lib/queries/useDevices'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import DataTableHeader from './data-table-header'

const DevicesContent = () => {
  const [pageParams, setPageParams] = useState<DevicesPaginationParams>({
    page: 1,
    limit: 10,
    verified: false,
    terminated: false,
    type: 'master',
  })

  const { data, isLoading } = useDevicesPaginated(pageParams)

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
      <DataTable<Device, any, DevicesPaginationParams>
        columns={columns}
        data={data.data.edge_devices}
        pagination={pageParams}
        setPagination={setPageParams}
        totalCount={data.data.pagination.total}
      />
    </div>
  )
}

export default DevicesContent
