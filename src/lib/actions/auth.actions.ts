"use server"

import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  AUTH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  AUTH_REFRESH_THRESHOLD,
} from "@/lib/constants/auth"
import { buildURL } from "@/lib/utils/build-url"
import type { ApiResponseType, ApiRequestType } from "@/types/features"
import { fetchServer } from "../api/fetch-server"
import type { JWTAuthPayload } from "@/types/features"
import { parseJWT } from "@/lib/utils/build-url"
import type { ServerActionResult } from "@/types/common/common.types"
import type { SignupFormData } from "@/types/features/auth/signup.schema"
import type { SignupResponse } from "@/types/features/auth/signup.types"
import type {
  UserLoginBody,
  UserLoginResponse,
} from "@/types/features/auth/signin.types"
import type { LogoutResponse } from "@/types/features/auth/auth.types"

export async function signupAction(
  formData: Omit<SignupFormData, "confirmPassword">,
): Promise<ServerActionResult<SignupResponse>> {
  try {
    const apiUrl = buildURL("/auth/register")
    const response = await fetchServer<SignupResponse>(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      cache: "no-store",
    })

    if (!response.success) {
      return {
        success: false,
        error: {
          message: response.error.message || "Unknown server error",
          status: response.error.status,
        },
      }
    }

    const { data, message } = response
    return { success: true, data, message }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Unexpected server error",
        status: 500,
      },
    }
  }
}

export async function verifyEmailAction(
  token: string,
): Promise<ServerActionResult<null>> {
  try {
    const apiUrl = buildURL(`/auth/verify-email?token=${token}`)
    const response = await fetchServer<null>(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!response.success) {
      return {
        success: false,
        error: {
          message: response.error.message || "Unknown server error",
          status: response.error.status,
        },
      }
    }

    return { success: true, data: null, message: response.message }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Unexpected server error",
        status: 500,
      },
    }
  }
}

export async function signinAction(
  loginData: UserLoginBody,
): Promise<ServerActionResult<null>> {
  try {
    const apiUrl = buildURL("/auth/login")
    const response = await fetchServer<UserLoginResponse>(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    })

    if (!response.success) {
      return {
        success: false,
        error: {
          message: response.error.message || "Unknown server error",
          status: response.error.status,
        },
      }
    }

    const { accessToken, refreshToken } = response.data
    await setAuthCookies(accessToken, refreshToken)
    return { success: true, data: null, message: response.message }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Unexpected server error",
        status: 500,
      },
    }
  }
}

export async function logOutAction(): Promise<
  ServerActionResult<LogoutResponse>
> {
  try {
    const apiUrl = buildURL("/auth/logout")
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value

    const response = await fetchServer<LogoutResponse>(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME)
    cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME)
    if (!response.success) {
      return {
        success: false,
        error: {
          message: response.error.message || "Unknown server error",
          status: response.error.status,
        },
      }
    }
    const { data, message } = response
    return { success: true, data, message }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Unexpected server error",
        status: 500,
      },
    }
  }
}

export async function refreshTokenIfNeeded(
  accessToken?: string,
  refreshToken?: string,
): Promise<{
  newAccessToken: string
  newRefreshToken: string
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
    const apiUrl = buildURL("/auth/refresh")
    const requestBody: ApiRequestType<"POST /auth/refresh"> = {
      refreshToken,
    }

    const result = await fetchServer<ApiResponseType<"POST /auth/refresh">>(
      apiUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
        revalidate: false,
      },
    )

    if (!result.success) {
      const error = result.error
      // If refresh fails (e.g. token expired or invalid), clear the cookie
      const status = "status" in error ? error.status : 500
      const message =
        "serverMessage" in error && error.serverMessage
          ? error.serverMessage
          : error.message || "Token refresh failed"

      console.log(`인증 토큰 갱신실패: ${status} - ${message}`)
      return null
    }
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      result.data

    console.log("인증 토큰 갱신성공")
    return { newAccessToken, newRefreshToken }
  }

  return {
    newAccessToken: accessToken,
    newRefreshToken: refreshToken,
  }
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies()
  const { exp } = await parseJWT(accessToken)
  cookieStore.set(AUTH_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(exp * 1000),
  })

  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
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
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // TODO: 쿠키 설정이
  const response = await handler(refreshTokenData.newAccessToken)
  const { exp } = await parseJWT(refreshTokenData.newAccessToken)
  cookieStore.set(AUTH_TOKEN_COOKIE_NAME, refreshTokenData.newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires: new Date(exp * 1000),
  })
  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshTokenData.newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
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
    return { success: false, error: { message: "Unauthorized", status: 401 } }
  }

  const response = await handler(refreshTokenData.newAccessToken)
  const { exp } = await parseJWT(refreshTokenData.newAccessToken)
  cookieStore.set(AUTH_TOKEN_COOKIE_NAME, refreshTokenData.newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires: new Date(exp * 1000),
  })
  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshTokenData.newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires: new Date(exp * 1000),
  })

  return response
}
