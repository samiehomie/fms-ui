import { getCompanies } from '@/lib/api/admin'
import { columns } from '@/components/features/companies/columns'
import { DataTable } from '@/components/features/companies/data-table'

export default async function CompaniesPage() {
  const data = await getCompanies()

  return (
    <div className="">
      <h1 className="text-4xl font-bold tracking-tight">Companies</h1>
      <p className=" tracking-tight text-[15px] font-[400] mt-2">
        Manage companies in your fleet management system
      </p>
      <div className="container mx-auto my-10 ">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
