import UsersContent from '@/components/features/users/users-content'
// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from '@tanstack/react-query'
// import { usersApi } from '@/lib/api/user'
// import { getAuthData } from '@/lib/api/auth'
// import { getQueryClient } from '@/lib/api/get-query-client'

export default async function UsersPage() {
  // const authData = await getAuthData()
  // const queryClient = getQueryClient()
  // await queryClient.prefetchQuery({
  //   queryKey: ['users', { page: 1, limit: 10 }],
  //   queryFn: () =>
  //     usersApi.getUsersPaginated({ page: 1, limit: 10 }, authData?.cookie),
  // })
  return (
    <div className="container">
      <h1 className="text-4xl font-bold tracking-tight">Users</h1>
      <p className=" tracking-tight text-[15px] font-[400] mt-2">
        Users management page. Content to be added.
      </p>
      <div className="container mx-auto my-10 ">
        <UsersContent />
      </div>
    </div>
    // <HydrationBoundary state={dehydrate(queryClient)}>
    //   <div className="container">
    //     <h1 className="text-4xl font-bold tracking-tight">Users</h1>
    //     <p className=" tracking-tight text-[15px] font-[400] mt-2">
    //       Users management page. Content to be added.
    //     </p>
    //     <div className="container mx-auto my-10 ">
    //       <UsersContent />
    //     </div>
    //   </div>
    // </HydrationBoundary>
  )
}
