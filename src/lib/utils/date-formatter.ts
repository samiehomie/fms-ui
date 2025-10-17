import type { DateRange } from 'react-day-picker'

export interface DateRangeFormatted {
  from: string
  to: string
}

export function formatDateRangeForAPI(
  dateRange: DateRange | undefined,
): DateRangeFormatted | null {
  if (!dateRange?.from) {
    return null
  }

  // from 날짜: 해당 날짜의 시작 시간 (00:00:00)
  const fromDate = new Date(dateRange.from)
  fromDate.setHours(0, 0, 0, 0)

  // to 날짜: 해당 날짜의 끝 시간 (23:59:59) 또는 from과 동일한 날짜
  const toDate = new Date(dateRange.to || dateRange.from)
  toDate.setHours(23, 59, 59, 999)

  return {
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
  }
}

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
    logger.error('날짜 포맷팅 오류:', error)
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
    // logger.error('날짜 포맷팅 오류:', error)
    return '날짜 오류'
  }
}
