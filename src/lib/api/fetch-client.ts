'use client'

export interface FetchError extends Error {
  status?: number
  info?: any
}

export class SessionExpiredError extends Error {
  constructor(message: string = 'Your session has expired') {
    super(message)
    this.name = 'SessionExpiredError'
  }
}

export async function fetchClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    credentials: 'include', // 쿠키 포함
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error: FetchError = new Error('An error occurred while fetching')
    error.status = response.status

    try {
      error.info = await response.json()
    } catch {
      error.info = { message: response.statusText }
    }

    // 401 에러는 특별히 표시
    if (response.status === 401) {
      throw new SessionExpiredError('Your session has been terminated.')
    }

    if (response.status === 409) {
      throw new SessionExpiredError(
        'Your session has been terminated due to a new login from another device',
      )
    }
  }

  return response.json()
}
