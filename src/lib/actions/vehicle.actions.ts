'use server'

import { buildURL } from '../utils/build-url'
import type {
  ApiParamsType,
  ApiRequestType,
  ApiResponseType,
} from '@/types/api'
import { withAuthAction } from './auth.actions'
import type { ServerActionResult } from '@/types/api'
import { fetchServer } from '../api/fetch-server'

export async function getVehicles<T = unknown>(
  params: ApiParamsType<'GET /vehicles'>,
) {
  return await withAuthAction<ApiResponseType<'GET /vehicles'>>(
    async (accessToken) => {
      const { id } = params
      const apiUrl =
        typeof id === 'string'
          ? buildURL(`/vehicles/${id}`)
          : buildURL(`/vehicles`, {
              page: params.page,
              limit: params.limit,
              search: params.search,
              includeDeleted: params.include_deleted,
            })

      try {
        const response = await fetchServer<ApiResponseType<'GET /vehicles'>>(
          apiUrl,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          },
        )

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
    },
  )
}

export async function createVehicles<T = unknown>(
  body: ApiRequestType<'POST /vehicles'>,
): Promise<ServerActionResult<T>> {
  return await withAuthAction<T>(async (accessToken) => {
    const apiUrl = buildURL(`/vehicles`)

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      })

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: response.statusText || 'Unknown server error',
            status: response.status,
          },
        }
      }
      const data = await response.json()
      return { success: true, data }
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
