import type { ApiRequestType, ApiResponseType } from "@/types/features"
import { ApiSuccessResponse } from "@/types/common/api.types"
import type { UsersPaginationParams } from "@/types/features/user.types"
import { buildURL } from "../utils/build-url"
import { fetchClient } from "./fetch-client"

export const usersApi = {
  // 페이지네이션된 회사 목록 조회
  getUsersPaginated: async (params: UsersPaginationParams) => {
    const apiUrl = buildURL(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/users`,
      params,
    )

    const response = await fetchClient<ApiResponseType<"GET /users">>(apiUrl)

    return response
  },
  createUser: async (user: ApiRequestType<"POST /users">) => {
    const response = await fetchClient<ApiResponseType<"POST /users">>(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      },
    )

    return response
  },

  verifyUser: async (verified: ApiRequestType<"POST /users/verify">) => {
    const response = await fetchClient<ApiResponseType<"POST /users/verify">>(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/users/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verified),
      },
    )

    return response
  },
}
