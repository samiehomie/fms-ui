'use client'
import { DataTable } from './data-table'
import type { Company } from '@/types/api/company.types'
import { useState, useEffect } from 'react'
import { useCompaniesPaginated } from '@/lib/hooks/queries/useCompanies'
import { columns } from '@/components/features/companies/columns'
import { logger } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function CompaniesContent() {
  const [pageParams, setPageParams] = useState({
    page: 1,
    limit: 10,
    // sort: 'created_at',
    // order: 'desc' as const,
  })
  const [tableData, setTableData] = useState<Company[]>([])
  const { data, isLoading, error } = useCompaniesPaginated(pageParams)

  useEffect(() => {
    if (data) {
      setTableData(data.data.companies)
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="mt-10 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  return <DataTable columns={columns} data={tableData} />
}
