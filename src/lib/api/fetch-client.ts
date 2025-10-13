'use client'

export interface FetchError extends Error {
  statusCode?: number
  statusText?: string
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
    console.log('fetch client', response)
    const error: FetchError = new Error(response.statusText)
    error.statusCode = response.status
    error.statusText = response.statusText
    if (response.status === 401) {
      error.statusText = 'Your session has been terminated.'
    }
    if (response.status === 409) {
      error.statusText =
        'Your session has been terminated due to a new login from another device.'
    }
    throw error
  }

  return response.json()
}
