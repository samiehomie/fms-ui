'use client'

import { useState, useCallback } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { logger, formatDateRangeForAPI } from '@/lib/utils'

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (formattedRange: { from: string; to: string } | null) => void
}

export function DateRangePicker({
  className,
  onDateChange,
}: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 1),
    to: new Date(2025, 5, 30),
  })

  const handleDateChange = useCallback(
    (newDate: DateRange | undefined) => {
      setDate(newDate)

      // 변환된 날짜를 부모 컴포넌트로 전달
      const formattedRange = formatDateRangeForAPI(newDate)
      if (formattedRange) {
        logger.log('Formatted date range:', formattedRange)
        onDateChange?.(formattedRange)
      }
    },
    [onDateChange],
  )

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[999]" align="end">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
