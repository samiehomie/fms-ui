'use client'
import { DataTable } from '@/components/ui/data-table'
import type { UsersPaginationParams } from '@/types/api/user.types'
import { useState } from 'react'
import { useUsersPaginated } from '@/lib/hooks/queries/useUsers'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { logger } from '@/lib/utils'

const UsersContent = () => {
  const [pageParams, setPageParams] =
    useState<UsersPaginationParams>({
      page: 1,
      limit: 10,
    })

  const { data, isLoading } = useUsersPaginated(pageParams)

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
    <div className="col-span-3">
      <DataTable
        columns={columns}
        data={data.data.users}
        pagination={pageParams}
        setPagination={setPageParams}
        totalCount={data.data.pagination.total}
      />
    </div>
  )
}

export default UsersContent
