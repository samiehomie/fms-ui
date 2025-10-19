'use client'
import { DataTable } from '@/components/ui/data-table'
import type {
  DevicesPaginationParams,
  Device,
} from '@/types/features/device.types'
import { useState } from 'react'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import DataTableHeader from './data-table-header'
import type { DevicesGetQuery } from '@/types/features/device/device.types'
import { EdgeDeviceType } from '@/types/enums/edge-device.enum'
import { useAllDevices } from '@/lib/query-hooks/useDevices'

const DevicesContent = () => {
  const [query, setQuery] = useState<DevicesGetQuery>({
    page: 1,
    limit: 10,
    verified: true,
    type: undefined,
    includeTerminated: true,
  })

  const { data: edgeDeviceData, isLoading } = useAllDevices(query)

  if (isLoading || !edgeDeviceData) {
    return (
      <div className="col-span-3 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  if (!edgeDeviceData.pagination) return null

  return (
    <div className="col-span-3">
      <div className="mb-3">
        <DataTableHeader setQuery={setQuery} query={query} />
      </div>
      <DataTable
        columns={columns}
        data={edgeDeviceData.data}
        pagination={query}
        setPagination={setQuery}
        totalCount={edgeDeviceData.pagination.total}
      />
    </div>
  )
}

export default DevicesContent
