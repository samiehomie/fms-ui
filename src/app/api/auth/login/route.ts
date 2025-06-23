import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
import type { LoginRequest, LoginResponse } from '@/types/api/auth.types'
import { AUTH_TOKEN_COOKIE_NAME } from '@/constants/auth'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  try {
    const body = (await request.json()) as LoginRequest
    const apiUrl = buildURL('/auth/login', process.env.NEXT_PUBLIC_API_BASE_URL)

    const result = await fetchJson<LoginResponse>(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // For mutations, ensure no caching by Next.js fetch
      revalidate: false, // This sets cache: 'no-store' in our fetchJson
    })

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

    const { token, expires_in, user } = result.data

    cookieStore.set(AUTH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expires_in, // `expires_in` is in seconds
      sameSite: 'lax',
    })

    return NextResponse.json({ user, expiresIn: expires_in })
  } catch (error) {
    console.error('Login route error:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 },
    )
  }
}
