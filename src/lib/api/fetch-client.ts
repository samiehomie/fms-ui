'use client'

export interface FetchError extends Error {
  status?: number
  info?: any
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
      error.message = 'UNAUTHORIZED'
    }

    throw error
  }

  return response.json()
}
