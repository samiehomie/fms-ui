import { fetchJson } from '@/lib/api/fetch'
import type { ApiRequestType, ApiResponseType } from '@/types/api'
import { ApiSuccessResponse } from '@/types/api/route.types'
import type { UsersPaginationParams } from '@/types/api/user.types'
import { logger } from '../utils'

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

    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'GET /users'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/users?${searchParams}`,
      cookie
        ? {
            headers: {
              Cookie: cookie,
            },
          }
        : undefined,
    )

    if (!response.success) {
      throw new Error('Failed to fetch vehicles')
    }

    return response.data
  },
}
