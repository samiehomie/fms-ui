import { FC } from 'react'
import TripContainer from '@/components/features/vehicles/trip/trip-container'

type CompanyIdParams = {
  params: Promise<{ id: string }>
}

const Page: FC<CompanyIdParams> = async ({ params }) => {
  const { id } = await params

  return <TripContainer vehicleId={parseInt(id)} />
}

export default Page
