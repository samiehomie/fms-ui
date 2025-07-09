import { FC } from 'react'
import TripContent from '@/components/features/vehicles/trip/trip-content'

type CompanyIdParams = {
  params: Promise<{ id: string }>
}

const Page: FC<CompanyIdParams> = async ({ params }) => {
  const { id } = await params

  return <TripContent vehicleId={parseInt(id)} />
}

export default Page
