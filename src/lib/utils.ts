import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function capitalizeFirstLetter(segment: string) {
  const segmentSplited = segment.split('-')
  const sementJoined = segmentSplited
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(' ')
  return sementJoined
}

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}
