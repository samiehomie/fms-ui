import { FC } from 'react'
import CompanyDetails from '@/components/features/companies/company-details'
import { companiesApi } from '@/lib/api/company'
import { getAuthData } from '@/lib/actions/auth'

type CompanyIdParams = {
  params: Promise<{ id: string }>
}

const Page: FC<CompanyIdParams> = async ({ params }) => {
  const { id } = await params
  const authData = await getAuthData()
  const response = await companiesApi.getCompanyById(
    parseInt(id),
    authData?.cookie,
  )

  return (
    <div className="flex flex-col flex-1 -ml-6 -mt-6 -mb-6">
      <CompanyDetails detail={response.data} companyId={parseInt(id)} />
    </div>
  )
}

export default Page
