'use client'
import { DataTable } from '@/components/ui/data-table'
import { useState } from 'react'
import { useCompanyVehicles } from '@/lib/query-hooks/use-companies'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import type { CompanyVehiclesQuery } from '@/types/features/companies/company.types'

const CompanyVehiclesContent = ({ companyId }: { companyId: string }) => {
  const [query, setQuery] = useState<Omit<CompanyVehiclesQuery, 'id'>>({
    page: 1,
    limit: 10,
    includeDeleted: true,
    search: undefined,
  })

  const { data: vehiclesData, isLoading } = useCompanyVehicles({
    ...query,
    id: companyId,
  })

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
    <div className="flex-1 flex flex-col gap-y-4">
      <div className="text-2xl tracking-[-0.01em] font-semibold">
        <h3>Vehicles</h3>
      </div>
      <DataTable
        columns={columns}
        data={vehiclesData.data}
        pagination={query}
        setPagination={setQuery}
        totalCount={vehiclesData.pagination.total}
      />
    </div>
  )
}

export default CompanyVehiclesContent
