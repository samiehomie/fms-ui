'use client'
import { DataTable } from '@/components/ui/data-table'
import type { UsersPaginationParams } from '@/types/api/user.types'
import { useState } from 'react'
import { useUsersPaginated } from '@/lib/queries/useUsers'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import DataTableHeader from './data-table-header'

const UsersContent = () => {
  const [pageParams, setPageParams] = useState<UsersPaginationParams>({
    page: 1,
    limit: 10,
    verified: true,
    search: '',
  })

  const { data: usersData, isLoading } = useUsersPaginated(pageParams)

  if (isLoading || !usersData) {
    return (
      <div className="col-span-3 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  return (
    <div className="col-span-3">
      <div className="mb-3">
        <DataTableHeader
          setPagination={setPageParams}
          pagination={pageParams}
        />
      </div>
      <DataTable
        columns={columns}
        data={usersData.data}
        pagination={pageParams}
        setPagination={setPageParams}
        totalCount={usersData.pagination.total}
      />
    </div>
  )
}

export default UsersContent
