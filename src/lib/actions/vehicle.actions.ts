'use server'

import { getAuthData, refreshTokenIfNeeded } from './auth'
import {
  AUTH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@/constants/auth'
import { buildURL } from '../api/utils'
import type { PaginationMeta } from '@/types/api/common.types'
import { cookies } from 'next/headers'
import { parseJWT } from '@/lib/api/utils'
import type { ApiParamsType } from '@/types/api'

export type ServerActionError = {
  message: string
  status?: number
  details?: unknown
}

export type ServerActionResult<T = any> =
  | { success: true; data: T; pagination?: PaginationMeta; message?: string }
  | { success: false; error: ServerActionError }

export async function withAuthAction<T = unknown>(
  handler: (accessToken: string) => Promise<ServerActionResult<T>>,
): Promise<ServerActionResult<T>> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value

  const refreshTokenData = await refreshTokenIfNeeded(accessToken, refreshToken)

  if (!refreshTokenData) {
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME)
    cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME)
    return { success: false, error: { message: 'Unauthorized', status: 401 } }
  }

  const response = await handler(refreshTokenData.newAccessToken)
  const { exp } = await parseJWT(refreshTokenData.newAccessToken)
  cookieStore.set(AUTH_TOKEN_COOKIE_NAME, refreshTokenData.newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    expires: new Date(exp * 1000),
  })
  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshTokenData.newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    expires: new Date(exp * 1000),
  })

  return response
}

export async function getVehicles<T = unknown>(
  params: ApiParamsType<'GET /vehicles'>,
): Promise<ServerActionResult<T>> {
  return await withAuthAction<T>(async (accessToken) => {
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
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
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
