'use client'
import { DataTable } from '@/components/ui/data-table'
import { useState } from 'react'
import { useAllUsers } from '@/lib/query-hooks/useUsers'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import DataTableHeader from './data-table-header'
import type { UsersGetQuery } from '@/types/features/users/user.types'

const UsersContent = () => {
  const [query, setQuery] = useState<UsersGetQuery>({
    page: 1,
    limit: 10,
    includeDeleted: true,
    verified: true,
    search: undefined,
  })

  const { data: usersData, isLoading } = useAllUsers(query)

  if (isLoading || !usersData) {
    return (
      <div className="col-span-3 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  if (!usersData.pagination) return null

  return (
    <div className="col-span-3">
      <div className="mb-3">
        <DataTableHeader setQuery={setQuery} query={query} />
      </div>
      <DataTable
        columns={columns}
        data={usersData.data}
        pagination={query}
        setPagination={setQuery}
        totalCount={usersData.pagination.total}
      />
    </div>
  )
}

export default UsersContent
