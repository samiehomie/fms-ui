import { getCompanies } from '@/lib/api/admin'

export default async function CompaniesPage() {
  const data = await getCompanies()

  return (
    <div>
      <h1 className="text-2xl font-bold">Companies</h1>
      <p>Companies management page. Content to be added.</p>
      <div className="whitespace-pre">{JSON.stringify(data, null, 2)}</div>
    </div>
  )
}
