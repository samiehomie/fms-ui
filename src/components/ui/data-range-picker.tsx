'use client'

import { useState, useCallback, useEffect } from 'react'
import { DatePicker } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import {
  formatDateRangeForAPI,
  getDefaultDateRange,
} from '@/lib/utils/date-formatter'

const { RangePicker } = DatePicker

interface DateRangePickerProps {
  className?: string
  onDateChange?: (formattedRange: { from: string; to: string } | null) => void
}

export function DateRangePicker({
  className,
  onDateChange,
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(() =>
    getDefaultDateRange(),
  )

  const handleDateChange = useCallback(
    (dates: [Dayjs | null, Dayjs | null] | null) => {
      if (dates && dates[0] && dates[1]) {
        setDateRange([dates[0], dates[1]])
        // Convert to Date objects for formatDateRangeForAPI
        const dateRange = {
          from: dates[0].toDate(),
          to: dates[1].toDate(),
        }

        const formattedRange = formatDateRangeForAPI(dateRange)
        if (formattedRange) {
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
        showTime={{
          hideDisabledOptions: true,
          defaultValue: [
            dayjs('00:00:00', 'HH:mm:ss'),
            dayjs('23:59:59', 'HH:mm:ss'),
          ],
          format: 'HH:mm:ss',
          showHour: false,
          showMinute: false,
          showSecond: false,
        }}
      />
    </div>
  )
}
