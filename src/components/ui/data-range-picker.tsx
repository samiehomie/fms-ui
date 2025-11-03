"use client"

import { useState, useCallback, useEffect, memo, useMemo } from "react"
import { DatePicker } from "antd"
import dayjs, { type Dayjs } from "dayjs"
import {
  formatDateRangeForAPI,
  getDefaultDateRange,
} from "@/lib/utils/date-formatter"

const { RangePicker } = DatePicker

interface DateRangePickerProps {
  className?: string
  onDateChange?: (formattedRange: { from: string; to: string } | null) => void
  minDate?: string | Date | Dayjs
  maxDate?: string | Date | Dayjs
  isLimited?: boolean
}

const DateRangePicker = ({
  className,
  onDateChange,
  minDate,
  maxDate,
  isLimited,
}: DateRangePickerProps) => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(() =>
    getDefaultDateRange(),
  )

  // Convert minDate and maxDate to Dayjs objects
  const minDayjs = useMemo(() => (minDate ? dayjs(minDate) : null), [minDate])
  const maxDayjs = useMemo(() => (maxDate ? dayjs(maxDate) : null), [maxDate])

  useEffect(() => {
    if (minDayjs && maxDayjs) {
      setDateRange([minDayjs, maxDayjs])
    }
  }, [minDayjs, maxDayjs])

  // Define disabledDate function
  const disabledDate = useCallback(
    (current: Dayjs) => {
      if (!current) return false
      if (minDayjs && current.isBefore(minDayjs, "day")) {
        return true
      }
      if (maxDayjs && current.isAfter(maxDayjs, "day")) {
        return true
      }
      return false
    },
    [minDayjs, maxDayjs],
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
        className="h-full rounded-[10px] "
        value={dateRange}
        onChange={handleDateChange}
        format="YYYY-MM-DD"
        style={{ width: 260 }}
        placeholder={["Start date", "End date"]}
        allowClear={true}
        disabledDate={isLimited ? disabledDate : undefined}
        showTime={{
          hideDisabledOptions: true,
          defaultValue: [
            dayjs("00:00:00", "HH:mm:ss"),
            dayjs("23:59:59", "HH:mm:ss"),
          ],
          format: "HH:mm:ss",
          showHour: false,
          showMinute: false,
          showSecond: false,
        }}
      />
    </div>
  )
}

export default memo(DateRangePicker)
