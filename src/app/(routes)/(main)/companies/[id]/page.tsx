import { FC } from 'react'
import CompanyDetails from '@/components/features/companies/company-details'
import { companiesApi } from '@/lib/api/company'

type CompanyIdParams = {
  params: Promise<{ id: string }>
}

const Page: FC<CompanyIdParams> = async ({ params }) => {
  const { id } = await params
  const response = await companiesApi.getCompanyById(parseInt(id))

  return <CompanyDetails detail={response.data} />
}

export default Page
