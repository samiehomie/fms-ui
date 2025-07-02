import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
import type { ApiRequestType, ApiResponseType } from '@/types/api'
import {
  AUTH_TOKEN_COOKIE_NAME,
  AUTH_EXPIRE_COOKIE_NAME,
} from '@/constants/auth'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const currentToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value

  if (!currentToken) {
    return NextResponse.json({ message: 'No token found' }, { status: 401 })
  }

  try {
    const apiUrl = buildURL('/auth/refresh')

    // As per user's note: "refresh_token: API 구현 예정 현재는 빈 문자열 전달"
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
      cookieStore.delete(AUTH_TOKEN_COOKIE_NAME)
      const status = 'status' in error ? error.status : 500
      const message =
        'serverMessage' in error && error.serverMessage
          ? error.serverMessage
          : error.message || 'Token refresh failed'
      return NextResponse.json({ message }, { status })
    }

    const { token, expires_in: expiresIn } = result.data
    const expiryTime = Date.now() + expiresIn * 1000

    cookieStore.set(AUTH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    })
    cookieStore.set(AUTH_EXPIRE_COOKIE_NAME, expiryTime.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    })

    return NextResponse.json({ mesage: 'refresh success', status: 200 })
  } catch (error) {
    console.error('Refresh route error:', error)
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME) // Clear cookie on unexpected error
    return NextResponse.json(
      { message: 'An unexpected error occurred during token refresh.' },
      { status: 500 },
    )
  }
}
