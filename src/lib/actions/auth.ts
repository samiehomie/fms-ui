'use server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { logger } from '../utils'
import {
  AUTH_TOKEN_COOKIE_NAME,
  AUTH_EXPIRE_COOKIE_NAME,
} from '@/constants/auth'
import { buildURL } from '@/lib/api/utils'
import type { ApiResponseType, ApiRequestType } from '@/types/api'
import { fetchJson } from '../api/fetch'
import { parseJWT } from '@/lib/api/utils'

type User = ApiResponseType<'POST /auth/login'>['user']
/**
 * TITLE: RefreshToken 호출 위한 헬퍼 함수
 * - acessToken(JWT) 만료 임박시 refreshToken API 호출하여 토큰 갱신
 * - 갱신 실패시 null 반환하여 재로그인 필요 알림
 */
export async function refreshTokenIfNeeded(
  currentToken?: string,
  currentExpire?: string,
): Promise<{
  token: string
  expire: string
} | null> {
  if (!currentToken || !currentExpire) {
    logger.error(
      `인증 토큰 갱신실패: ${AUTH_TOKEN_COOKIE_NAME} 또는 ${AUTH_EXPIRE_COOKIE_NAME} 쿠키 없음.`,
    )
    return null
  }

  const expireDate = new Date(Date.now() + Number(currentExpire) * 1000) // expire 쿠키 단위 : 초 -> 밀리초 변환
  const now = new Date()
  const threshold = 60 * 60 * 1000 // 임계치 60분

  if (expireDate.getTime() - now.getTime() < threshold) {
    const apiUrl = buildURL(
      '/auth/refresh',
      process.env.NEXT_PUBLIC_API_BASE_URL,
    )
    const requestBody: ApiRequestType<'POST /auth/refresh'> = {
      token: currentToken,
      refresh_token: '',
    }

    const result = await fetchJson<ApiResponseType<'POST /auth/refresh'>>(
      apiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(requestBody),
        revalidate: false,
      },
    )
    if (!result.success) {
      const error = result.error
      // If refresh fails (e.g. token expired or invalid), clear the cookie
      const status = 'status' in error ? error.status : 500
      const message =
        'serverMessage' in error && error.serverMessage
          ? error.serverMessage
          : error.message || 'Token refresh failed'

      logger.error(`인증 토큰 갱신실패: ${status} - ${message}`)
      return null
    }
    const { token: newToken, expires_in: newExpiresIn } = result.data

    logger.info('인증 토큰 갱신성공')
    return { token: newToken, expire: `${newExpiresIn * 1000}` }
  }
  logger.info('인증 토큰 갱신 필요없음. 기존 토큰 사용 유지.')
  return { token: currentToken, expire: currentExpire }
}

export async function withAuth(
  handler: (tokenData: {
    token: string
    expire: string
  }) => Promise<NextResponse>,
): Promise<NextResponse> {
  const cookieStore = await cookies()
  const currentToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value
  const currentExpire = cookieStore.get(AUTH_EXPIRE_COOKIE_NAME)?.value
  const refreshTokenData = await refreshTokenIfNeeded(
    currentToken,
    currentExpire,
  )

  if (!refreshTokenData) {
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME)
    cookieStore.delete(AUTH_EXPIRE_COOKIE_NAME)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const response = await handler(refreshTokenData)
  cookieStore.set(AUTH_TOKEN_COOKIE_NAME, refreshTokenData.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  })
  cookieStore.set(AUTH_TOKEN_COOKIE_NAME, refreshTokenData.expire, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  })

  return response
}

export const getAuthData = async () => {
  const cookieStore = await cookies()
  const authToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value
  const expire = cookieStore.get(AUTH_EXPIRE_COOKIE_NAME)?.value

  const refreshTokenData = await refreshTokenIfNeeded(authToken, expire)
  if (!refreshTokenData) {
    return null
  }

  const user = parseJWT(refreshTokenData.token) as User | null
  if (!user) return null

  return { token: refreshTokenData.token, user }
}
