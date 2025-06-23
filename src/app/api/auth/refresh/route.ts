import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
import type {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/api/auth.types'
import { AUTH_TOKEN_COOKIE_NAME } from '@/constants/auth'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const currentToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value

  if (!currentToken) {
    return NextResponse.json({ message: 'No token found' }, { status: 401 })
  }

  try {
    const apiUrl = buildURL(
      '/auth/refresh',
      process.env.NEXT_PUBLIC_API_BASE_URL,
    )

    // As per user's note: "refresh_token: API 구현 예정 현재는 빈 문자열 전달"
    const requestBody: RefreshTokenRequest = {
      token: currentToken,
      refresh_token: '',
    }

    const result = await fetchJson<RefreshTokenResponse>(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(requestBody),
      revalidate: false,
    })

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

    const { token: newToken, user } = result.data
    // Assuming the refresh response also includes a new `expires_in` or the same duration applies
    // For this example, let's assume a fixed duration, e.g., 1 hour, or get it from response if available.
    // If your /auth/refresh endpoint returns expires_in, use that.
    // For now, let's hardcode a typical new expiry, e.g. 1 day, or reuse previous logic if your API provides it.
    // The original login response had `expires_in`. If refresh provides it, use it.
    // Let's assume your RefreshTokenResponse includes expires_in or you have a standard duration.
    // For this example, I'll use a common value like 24 hours (86400 seconds) if not provided.
    // It's better if your API provides this.
    const newExpiresIn = (result.data as any).expires_in || 86400 // Example: 24 hours

    cookieStore.set(AUTH_TOKEN_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: newExpiresIn,
      sameSite: 'lax',
    })

    return NextResponse.json({ user, expiresIn: newExpiresIn })
  } catch (error) {
    console.error('Refresh route error:', error)
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME) // Clear cookie on unexpected error
    return NextResponse.json(
      { message: 'An unexpected error occurred during token refresh.' },
      { status: 500 },
    )
  }
}
