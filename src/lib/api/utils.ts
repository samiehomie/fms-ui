import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInSeconds } from 'date-fns'
import { decodeJwt } from 'jose'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 객체 배열에서 created_at과 updated_at 시간 차이의 총합을 "Xh Ym Zs" 형식으로 포맷합니다.
 * @param items - created_at과 updated_at 속성을 가진 객체들의 배열
 * @returns 총 기간의 포맷된 문자열
 */
export function formatTotalDuration(
  items: Array<{
    created_at: string | Date
    updated_at: string | Date
  }>,
): string {
  if (!items || items.length === 0) {
    return '0s'
  }

  let totalSeconds = 0

  for (const item of items) {
    const startDate = new Date(item.created_at)
    const endDate = new Date(item.updated_at)

    // 유효하지 않은 날짜는 건너뛰기
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      continue
    }

    const itemSeconds = differenceInSeconds(endDate, startDate)
    if (itemSeconds > 0) {
      totalSeconds += itemSeconds
    }
  }

  // formatDuration과 동일한 로직
  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)

  return parts.join(' ')
}

/**
 * 두 날짜 사이의 기간을 "Xh Ym Zs" 형식으로 포맷합니다.
 * @param start - 시작 시간 (ISO 문자열 또는 Date 객체)
 * @param end - 종료 시간 (ISO 문자열 또는 Date 객체)
 * @returns 포맷된 기간 문자열
 */
export function formatDuration(
  start: string | Date,
  end: string | Date,
): string {
  const startDate = new Date(start)
  const endDate = new Date(end)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 'N/A'
  }

  let totalSeconds = differenceInSeconds(endDate, startDate)
  if (totalSeconds < 0) totalSeconds = 0

  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)

  return parts.join(' ')
}

export function buildSearchParams(
  params: Record<string, any>,
): URLSearchParams {
  const filteredParams: Record<string, string> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'number') {
        filteredParams[key] = value.toString()
      } else if (typeof value === 'boolean') {
        filteredParams[key] = value.toString()
      } else if (typeof value === 'string') {
        filteredParams[key] = value
      }
    }
  })

  return new URLSearchParams(filteredParams)
}

export function isEmpty(obj: Object) {
  return Object.keys(obj).length === 0
}

export const buildURL = (
  endpoint: string,
  params?: Record<string, any>,
): string => {
  const url = new URL(endpoint, process.env.NEXT_PUBLIC_API_BASE_URL!)

  const filteredParams =
    params && !isEmpty(params) ? `?${buildSearchParams(params)}` : ''

  return `${url.toString()}${filteredParams}`
}

export async function parseJWT<T = any>(token: string): Promise<T | null> {
  try {
    const payload = decodeJwt(token) as T
    console.log('JWT payload: ', payload)
    return payload
  } catch (error) {
    console.error(error)
    return null
  }
}
