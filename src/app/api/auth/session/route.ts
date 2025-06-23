import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_TOKEN_COOKIE_NAME } from '@/constants/auth'
import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
// Assuming you have a /auth/me or similar endpoint that returns user info based on token
// For this example, let's assume it's /users/me
// And its response type is similar to LoginResponse.user
interface MeResponse {
  id: number
  name: string
  username: string
  email: string
  role: {
    id: number
    name: string
    description: string
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.json(
      { user: null, isAuthenticated: false },
      { status: 200 },
    )
  }

  // Here, you would typically call your backend's "get current user" endpoint
  // For demonstration, let's assume an endpoint `/api/v1/users/me`
  // This endpoint should validate the token and return user details.
  // The actual implementation depends on your backend API.
  // For now, we'll simulate this. If you have a real endpoint, use it.
  // This example simulates a call to an external /users/me endpoint
  const apiUrl = buildURL('/users/me', process.env.NEXT_PUBLIC_API_BASE_URL) // Adjust endpoint as needed

  const result = await fetchJson<MeResponse>(apiUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    revalidate: false, // Don't cache user session data like this
  })

  if (result.success) {
    // To calculate remaining expiry, you'd need the cookie's expiry time.
    // This is hard to get reliably from an HttpOnly cookie on the server for this specific request.
    // The client will receive `expiresIn` upon login/refresh and manage its own timer.
    // This session endpoint primarily confirms authentication and returns user data.
    return NextResponse.json({ user: result.data, isAuthenticated: true })
  } else {
    // Token might be invalid or expired, clear it
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME)
    return NextResponse.json(
      { user: null, isAuthenticated: false },
      { status: 200 },
    )
  }
}
