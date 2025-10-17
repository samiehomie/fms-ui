'use client'
import { DataTable } from '../../ui/data-table'
import type { CompaniesPaginationParams } from '@/types/api/company.types'
import { useState } from 'react'
import { useCompaniesPaginated } from '@/lib/query-hooks/useCompanies'
import { columns } from '@/components/features/companies/columns'
import { Skeleton } from '@/components/ui/skeleton'
import DataTableHeader from './data-table-header'
import type { ApiParamsType } from '@/types/api'

const CompaniesContent = () => {
  const [pageParams, setPageParams] = useState<ApiParamsType<'GET /companies'>>(
    {
      page: 1,
      limit: 10,
      search: '',
      verified: true,
    },
  )

  const { data: companiesData, isLoading } = useCompaniesPaginated(pageParams)

  if (isLoading || !companiesData) {
    return (
      <div className="mt-10 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-3">
      <DataTableHeader setPagination={setPageParams} pagination={pageParams} />
      <DataTable
        columns={columns}
        data={companiesData.data}
        pagination={pageParams}
        setPagination={setPageParams}
        totalCount={companiesData.pagination.total}
      />
    </div>
  )
}

export default CompaniesContent
