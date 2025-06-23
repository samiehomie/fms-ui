import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_TOKEN_COOKIE_NAME } from '@/constants/auth'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME)
    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred during logout.' },
      { status: 500 },
    )
  }
}
