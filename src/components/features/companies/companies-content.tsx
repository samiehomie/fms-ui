"use client"
import { DataTable } from "../../ui/data-table"
import { useState } from "react"
import { useAllCompanies } from "@/lib/query-hooks/use-companies"
import { columns } from "@/components/features/companies/columns"
import { Skeleton } from "@/components/ui/skeleton"
import DataTableHeader from "./data-table-header"
import type { CompaniesGetQuery } from "@/types/features/companies/company.types"

const CompaniesContent = () => {
  const [query, setQuery] = useState<CompaniesGetQuery>({
    page: 1,
    limit: 20,
    verified: true,
    includeDeleted: true,
    search: undefined,
    type: undefined,
  })

  const {
    data: companiesData,
    isPending,
    isError,
    error,
  } = useAllCompanies(query)

  if (isPending) {
    return (
      <div className="mt-10 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  if (!companiesData.pagination) return null

  return (
    <div className="flex flex-col gap-y-3">
      <DataTableHeader setQuery={setQuery} query={query} />
      <DataTable
        columns={columns}
        data={companiesData.data}
        pagination={query}
        setPagination={setQuery}
        totalCount={companiesData.pagination.total}
      />
    </div>
  )
}

export default CompaniesContent
