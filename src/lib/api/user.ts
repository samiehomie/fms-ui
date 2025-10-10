import { fetchServer } from '@/lib/api/fetch-server'
import type { ApiRequestType, ApiResponseType } from '@/types/api'
import { ApiSuccessResponse } from '@/types/api/route.types'
import type { UsersPaginationParams } from '@/types/api/user.types'

export const usersApi = {
  // 페이지네이션된 회사 목록 조회
  getUsersPaginated: async (
    params: UsersPaginationParams,
    cookie?: string,
  ): Promise<ApiSuccessResponse<ApiResponseType<'GET /users'>>> => {
    const searchParams =
      params &&
      new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
      })

    const response = await fetchServer<
      ApiSuccessResponse<ApiResponseType<'GET /users'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/users?${searchParams}`,
      cookie
        ? {
            headers: {
              Cookie: cookie,
            },
          }
        : { revalidate: false },
    )

    if (!response.success) {
      throw new Error('Failed to fetch vehicles')
    }

    return response.data
  },
  createUser: async (
    user: ApiRequestType<'POST /users'>,
  ): Promise<ApiSuccessResponse<ApiResponseType<'POST /users'>>> => {
    const response = await fetchServer<
      ApiSuccessResponse<ApiResponseType<'POST /users'>>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    if (!response.success) {
      throw new Error('Failed to create user')
    }

    return response.data
  },

  verifyUser: async (verified: ApiRequestType<'POST /users/verify'>) => {
    const response = await fetchServer<
      ApiSuccessResponse<ApiResponseType<'POST /users/verify'>>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/users/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verified),
    })

    if (!response.success) {
      throw new Error('Failed to verify user')
    }

    return response.data
  },
}
