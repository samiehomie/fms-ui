'use server'

import { buildURL } from '../utils/build-url'
import { withAuthAction } from './auth.actions'
import { fetchServer } from '../api/fetch-server'
import type { UsersGetQuery, UsersGetResponse } from '@/types/features/users/user.types'

// TODO 반복되는 함수 헬퍼 함수로 만들기
export async function getAllUsers(query: UsersGetQuery) {
  return await withAuthAction<UsersGetResponse>(async (accessToken) => {
    const apiUrl = buildURL(`/users`, query)

    try {
      const response = await fetchServer<UsersGetResponse>(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response

      return { success: true, data, pagination }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}
