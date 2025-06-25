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
