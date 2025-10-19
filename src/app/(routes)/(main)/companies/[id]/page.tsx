import { FC } from 'react'
import CompanyDetails from '@/components/features/companies/company-details'

type CompanyIdParams = {
  params: Promise<{ id: string }>
}

const Page: FC<CompanyIdParams> = async ({ params }) => {
  const { id } = await params

  return (
    <div className="flex flex-col flex-1 -ml-6 -mt-6 -mb-6">
      <CompanyDetails companyId={id} />
    </div>
  )
}

export default Page
