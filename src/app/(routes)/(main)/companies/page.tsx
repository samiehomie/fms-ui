import CompaniesContent from '@/components/features/companies/companies-content'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { companiesApi } from '@/lib/api/company'

export default async function CompaniesPage() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['companies', { page: 1, limit: 10 }],
    queryFn: () => companiesApi.getCompaniesPaginated({ page: 1, limit: 10 }),
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container">
        <h1 className="text-4xl font-bold tracking-tight">Companies</h1>
        <p className=" tracking-tight text-[15px] font-[400] mt-2">
          Manage companies in your fleet management system
        </p>
        <div className="container mx-auto my-10 ">
          <CompaniesContent />
        </div>
      </div>
    </HydrationBoundary>
  )
}
