import { getCompanies } from '@/lib/api/admin'
import { columns } from '@/components/features/companies/columns'
import type { Company } from '@/types/api/admin.types'
import { DataTable } from '@/components/features/companies/data-table'

export default async function CompaniesPage() {
  const data = await getCompanies()

  return (
    <div>
      <h1 className="text-2xl font-bold">Companies</h1>
      <p>Companies management page. Content to be added.</p>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>

      <div className="whitespace-pre">{JSON.stringify(data, null, 2)}</div>
    </div>
  )
}
