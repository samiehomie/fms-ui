import VehiclesContent from '@/components/features/vehicles/vehicles-content'
// import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
// import { vehiclesApi } from '@/lib/api/vehicle'
// import { getAuthData } from '@/lib/api/auth'
// import { getQueryClient } from '@/lib/api/get-query-client'

export default async function UsersPage() {
  // const authData = await getAuthData()
  // const queryClient = getQueryClient()
  // await queryClient.prefetchQuery({
  //   queryKey: ['vehicles', { page: 1, limit: 10 }],
  //   queryFn: () =>
  //     vehiclesApi.getVehiclesPaginated(
  //       { page: 1, limit: 10 },
  //       authData?.cookie,
  //     ),
  // })
  return (
    <div className="container">
      <h1 className="text-4xl font-bold tracking-tight">Vehicles</h1>
      <p className=" tracking-tight text-[15px] font-[400] mt-2">
        Vehicles management page. Content to be added.
      </p>
      <div className="container mx-auto my-10 ">
        <VehiclesContent />
      </div>
      {/* <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="container mx-auto my-10 ">
          <VehiclesContent />
        </div>
      </HydrationBoundary> */}
    </div>
  )
}

// export default function VehiclesPage() {
//   return (
//     <div>
//       <h1 className="text-2xl font-bold">Vehicles</h1>
//       <p>Vehicles management page. Content to be added.</p>
//     </div>
//   )
// }
