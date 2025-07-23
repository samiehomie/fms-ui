'use client'
import { DataTable } from '@/components/ui/data-table'
import { useState } from 'react'
import { useCompanyVehiclesPaginated } from '@/lib/queries/useCompanies'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiParamsType } from '@/types/api'

const CompanyVehiclesContent = ({ companyId }: { companyId: number }) => {
  const [pageParams, setPageParams] = useState<
    ApiParamsType<'GET /vehicles/company/{company_id}'>
  >({
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
    <div className="flex-1 flex flex-col gap-y-4">
      <div className="text-2xl tracking-[-0.01em] font-semibold">
        <h3>Vehicles</h3>
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

export default CompanyVehiclesContent
