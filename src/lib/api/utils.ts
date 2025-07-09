import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInSeconds } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export const buildURL = (
  endpoint: string,
  params?: Record<string, any>,
): string => {
  const url = new URL(endpoint, process.env.NEXT_PUBLIC_API_BASE_URL!)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}
