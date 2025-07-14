'use client'

import { useState, useCallback } from 'react'
import { DatePicker } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

import { logger, formatDateRangeForAPI } from '@/lib/utils'

const { RangePicker } = DatePicker

interface DateRangePickerProps {
  className?: string
  onDateChange?: (formattedRange: { from: string; to: string } | null) => void
}

export function DateRangePicker({
  className,
  onDateChange,
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([
    dayjs('2025-06-01'),
    dayjs('2025-06-30'),
  ])

  const handleDateChange = useCallback(
    (
      dates: [Dayjs | null, Dayjs | null] | null,
      dateStrings: [string, string],
    ) => {
      if (dates && dates[0] && dates[1]) {
        setDateRange([dates[0], dates[1]])
        // Convert to Date objects for formatDateRangeForAPI
        const dateRange = {
          from: dates[0].toDate(),
          to: dates[1].toDate(),
        }

        const formattedRange = formatDateRangeForAPI(dateRange)
        if (formattedRange) {
          logger.log('Formatted date range:', formattedRange)
          onDateChange?.(formattedRange)
        }
      } else {
        setDateRange(null)
        onDateChange?.(null)
      }
    },
    [onDateChange],
  )

  return (
    <div className={className}>
      <RangePicker
        value={dateRange}
        onChange={handleDateChange}
        format="YYYY-MM-DD"
        style={{ width: 260 }}
        placeholder={['Start date', 'End date']}
        allowClear={true}
      />
    </div>
  )
}
