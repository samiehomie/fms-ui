import { NextRequest, NextResponse } from 'next/server'
import { getAuthData } from './lib/actions/auth'

const PUBLIC_ROUTES = ['/login', '/signup']
const PROTECTED_ROUTES = ['/companies', '/vehicles', '/users', '/devices']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const auth = await getAuthData()

  if (pathname === '/api/health') {
    return NextResponse.next()
  }

  // 공개 경로 접근 시 로그인 사용자 리다이렉트
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (auth) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FRONT_URL}/`)
    }
    return NextResponse.next()
  }

  if (pathname === '/') {
    if (!auth) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FRONT_URL}/login`)
    }
  }

  // 보호된 경로 접근 시 미인증 사용자 리다이렉트
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!auth) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FRONT_URL}/login`)
    }

    // TODO: API 요청 CSRF 검증 추가하기
    // if (pathname.startsWith('/api')) {
    //   const csrfHeader = request.headers.get('x-csrf-token')
    //     if (csrfHeader !== auth.csrfToken) {
    //       return new NextResponse('Invalid CSRF token', { status: 403 });
    //     }
    // }
  }

  return NextResponse.next()
}
