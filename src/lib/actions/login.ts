'use server'

import { redirect } from 'next/navigation'
import { fetchJson } from '../api/fetch'
import { buildURL } from '../api/utils'
import type { ApiRequestType, ApiResponseType } from '@/types/api'
import { setAuthCookies } from '../api/auth'

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

    if (!response.success) throw new Error('Authentication failed')

    const { token, expires_in: expiresIn } = await response.data
    await setAuthCookies(token, expiresIn)
  } catch (error) {
    return { error: (error as Error).message }
  }

  redirect('/')
}
