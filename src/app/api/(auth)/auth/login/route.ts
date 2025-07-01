import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
import { ApiResponseType, ApiRequestType } from '@/types/api'
import {
  AUTH_TOKEN_COOKIE_NAME,
  AUTH_EXPIRE_COOKIE_NAME,
} from '@/constants/auth'
import { logger } from '@/lib/utils'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  try {
    const body = (await request.json()) as ApiRequestType<'POST /auth/login'>
    const apiUrl = buildURL('/auth/login')

    const result = await fetchJson<ApiResponseType<'POST /auth/login'>>(
      apiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        // For mutations, ensure no caching by Next.js fetch
        revalidate: false, // This sets cache: 'no-store' in our fetchJson
      },
    )

    if (!result.success) {
      const error = result.error
      // Ensure HttpError properties are accessed safely
      const status = 'status' in error ? error.status : 500
      const message =
        'serverMessage' in error && error.serverMessage
          ? error.serverMessage
          : error.message || 'Login failed'
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

    // TODO: 관련 로직 삭제 필요함 - 클라이언트 사이드에서 다루지 않음
    return NextResponse.json({ mesage: 'Login success', status: 200 })
  } catch (error) {
    // logger.error('Login route error:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 },
    )
  }
}
