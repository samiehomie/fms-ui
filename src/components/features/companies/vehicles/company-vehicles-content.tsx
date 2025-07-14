'use client'
import { DataTable } from '@/components/ui/data-table'
import type { VehiclesByCompanyIdPaginationParams } from '@/types/api/vehicle.types'
import { useState } from 'react'
import { useCompanyVehiclesPaginated } from '@/lib/hooks/queries/useCompanies'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { logger } from '@/lib/utils'

const CompanyVehiclesContent = ({ companyId }: { companyId: number }) => {
  const [pageParams, setPageParams] =
    useState<VehiclesByCompanyIdPaginationParams>({
      page: 1,
      limit: 10,
    })

  const { data, isLoading } = useCompanyVehiclesPaginated(companyId, pageParams)

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
    <div className="flex-1 flex flex-col">
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

export default CompanyVehiclesContent
