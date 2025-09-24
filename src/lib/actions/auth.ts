'use server'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  AUTH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  AUTH_REFRESH_THRESHOLD,
} from '@/constants/auth'
import { buildURL } from '@/lib/api/utils'
import type { ApiResponseType, ApiRequestType } from '@/types/api'
import { fetchJson } from '../api/fetch'
import type { JWTAuthPayload } from '@/types/api'
import { redirect } from 'next/navigation'
import { parseJWT } from '@/lib/api/utils'

export async function loginAction(
  loginData: ApiRequestType<'POST /auth/login'>,
) {
  const credentials: ApiRequestType<'POST /auth/login'> = {
    username: loginData.username,
    password: loginData.password,
  }

  const apiUrl = buildURL('/auth/login')

  try {
    const response = await fetchJson<ApiResponseType<'POST /auth/login'>>(
      apiUrl,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      },
    )

    console.log('loginAction', response)

    if (!response.success) throw new Error('Authentication failed')

    const { token, expires_in: expiresIn, refreshToken } = await response.data
    await setAuthCookies(token, refreshToken, expiresIn)
  } catch (error) {
    return { error: (error as Error).message }
  }

  redirect('/')
}

export async function logOutAction() {
  // const apiUrl = buildURL('/auth/logout')

  try {
    const cookieStore = await cookies()
    // const accessToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value

    // TODO: API - 세션 하이브리드 방식이라 토큰 무효화 시키려면 로그아웃 동작 구현해야함 현재 없음
    // const response = await fetchJson<ApiResponseType<'POST /auth/logout'>>(
    //   apiUrl,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   },
    // )

    // if (!response.success) throw new Error('Authentication failed')

    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME)
    cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME)

    // logger.log('login action', response)
  } catch (error) {
    console.error('Logout error:', error)
  }
  redirect('/login')
}

export async function refreshTokenIfNeeded(
  accessToken?: string,
  refreshToken?: string,
): Promise<{
  newAccessToken: string
  newRefreshToken: string
  newExpiresIn: number
} | null> {
  if (!accessToken || !refreshToken) {
    console.log(
      `인증 토큰 갱신실패: ${AUTH_TOKEN_COOKIE_NAME}: ${accessToken} ${REFRESH_TOKEN_COOKIE_NAME}: ${refreshToken}`,
    )
    return null
  }

  const refreshThreshold = AUTH_REFRESH_THRESHOLD // 30 minutes
  const jwtPayload = await parseJWT<JWTAuthPayload>(accessToken)

  if (!jwtPayload) return null

  const { exp } = jwtPayload

  const timeUntilExpiry = exp * 1000 - Date.now()

  if (timeUntilExpiry < refreshThreshold) {
    const apiUrl = buildURL('/auth/refresh')
    const requestBody: ApiRequestType<'POST /auth/refresh'> = {
      accessToken,
      refreshToken,
    }

    const result = await fetchJson<ApiResponseType<'POST /auth/refresh'>>(
      apiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
        revalidate: false,
      },
    )

    console.log(result)
    if (!result.success) {
      const error = result.error
      // If refresh fails (e.g. token expired or invalid), clear the cookie
      const status = 'status' in error ? error.status : 500
      const message =
        'serverMessage' in error && error.serverMessage
          ? error.serverMessage
          : error.message || 'Token refresh failed'

      console.error(`인증 토큰 갱신실패: ${status} - ${message}`)
      return null
    }
    const {
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expires_in: expiresIn,
    } = result.data

    console.info('인증 토큰 갱신성공')
    return { newAccessToken, newRefreshToken, newExpiresIn: expiresIn }
  }
  console.info('인증 토큰 갱신 필요없음. 기존 토큰 사용 유지.')
  return {
    newAccessToken: accessToken,
    newRefreshToken: refreshToken,
    newExpiresIn: Math.round(timeUntilExpiry / 1000),
  }
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
) {
  const cookieStore = await cookies()
  const { exp } = await parseJWT(accessToken)
  cookieStore.set(AUTH_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(exp * 1000),
  })

  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(exp * 1000),
  })
}

export async function withAuth(
  handler: (accessToken: string) => Promise<NextResponse>,
): Promise<NextResponse> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value

  const refreshTokenData = await refreshTokenIfNeeded(accessToken, refreshToken)

  if (!refreshTokenData) {
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME)
    cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // TODO: 쿠키 설정이
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

export const getAuthData = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value

  const refreshTokenData = await refreshTokenIfNeeded(accessToken, refreshToken)
  if (!refreshTokenData) {
    return null
  }

  const user = await parseJWT<JWTAuthPayload>(refreshTokenData.newAccessToken)
  if (!user) return null

  const cookie = `${AUTH_TOKEN_COOKIE_NAME}=${refreshTokenData.newAccessToken}; ${REFRESH_TOKEN_COOKIE_NAME}=${refreshTokenData.newRefreshToken};`

  return { token: refreshTokenData.newAccessToken, user, cookie }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_TOKEN_COOKIE_NAME)
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME)
}
