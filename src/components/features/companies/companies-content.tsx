'use client'
import { DataTable } from './data-table'
import type { CompaniesPaginationParams } from '@/types/api/company.types'
import { useState } from 'react'
import { useCompaniesPaginated } from '@/lib/hooks/queries/useCompanies'
import { columns } from '@/components/features/companies/columns'
import { Skeleton } from '@/components/ui/skeleton'
import { logger } from '@/lib/utils'

const CompaniesContent = () => {
  const [pageParams, setPageParams] = useState<CompaniesPaginationParams>({
    page: 1,
    limit: 10,
    // verified: false,
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
    <DataTable
      columns={columns}
      data={data.data.companies}
      pagination={pageParams}
      setPagination={setPageParams}
      totalCount={data.data.pagination.total}
    />
  )
}

export default CompaniesContent
