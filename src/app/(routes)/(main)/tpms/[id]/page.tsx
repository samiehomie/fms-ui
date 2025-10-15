import { FC } from 'react'
import TpmsContainer from '@/components/features/tpms/tpms-container'

type CompanyIdParams = {
  params: Promise<{ id: string }>
}

const Page: FC<CompanyIdParams> = async ({ params }) => {
  const { id } = await params

  return <TpmsContainer vehicleId={parseInt(id)} />
}

export default Page
