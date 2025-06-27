import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const logger = {
  log: (...args: unknown[]) => {
    if (
      process.env.NODE_ENV !== 'production' ||
      typeof window === 'undefined'
    ) {
      console.log('[LOG]:', ...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (
      process.env.NODE_ENV !== 'production' ||
      typeof window === 'undefined'
    ) {
      console.warn('[WARN]:', ...args)
    }
  },
  error: (...args: unknown[]) => {
    if (
      process.env.NODE_ENV !== 'production' ||
      typeof window === 'undefined'
    ) {
      console.error('[ERROR]:', ...args)
    }
  },
  info: (...args: unknown[]) => {
    if (
      process.env.NODE_ENV !== 'production' ||
      typeof window === 'undefined'
    ) {
      console.info('[INFO]:', ...args)
    }
  },
}

// src/lib/utils/date.ts
export function formatDateToKorean(dateString: string): string {
  try {
    const date = new Date(dateString)

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return '잘못된 날짜'
    }

    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 0부터 시작하므로 +1
    const day = date.getDate()

    return `${year}. ${month}. ${day}`
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error)
    return '날짜 오류'
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return '잘못된 날짜'
    }

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${year}. ${month}. ${day} ${hours}:${minutes}`
  } catch (error) {
    logger.error('날짜 포맷팅 오류:', error)
    return '날짜 오류'
  }
}

export function getCompanyTypeColor(type: string): string {
  switch (type.toUpperCase()) {
    case 'OWNER':
      return 'text-blue-500'
    case 'GUEST':
      return 'text-green-500'
    default:
      return 'text-inherit'
  }
}

export const getInitials = (name?: string, username?: string) => {
  if (name) {
    const parts = name.split(' ')
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }
  if (username) {
    return username.substring(0, 2).toUpperCase()
  }
  return 'CN'
}
