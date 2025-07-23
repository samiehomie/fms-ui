'use client'
import { DataTable } from '../../ui/data-table'
import type { CompaniesPaginationParams } from '@/types/api/company.types'
import { useState } from 'react'
import { useCompaniesPaginated } from '@/lib/queries/useCompanies'
import { columns } from '@/components/features/companies/columns'
import { Skeleton } from '@/components/ui/skeleton'
import DataTableHeader from './data-table-header'

const CompaniesContent = () => {
  const [pageParams, setPageParams] = useState<CompaniesPaginationParams>({
    page: 1,
    limit: 10,
    search: '',
    verified: false,
    // sort: 'created_at',
    // order: 'desc' as const,
  })
  logger.log('page', pageParams)
  const { data, isLoading } = useCompaniesPaginated(pageParams)

  if (isLoading || !data) {
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
        data={data.data.companies}
        pagination={pageParams}
        setPagination={setPageParams}
        totalCount={data.data.pagination.total}
      />
    </div>
  )
}

export default CompaniesContent
