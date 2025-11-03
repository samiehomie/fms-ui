"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Filter, RefreshCw } from "lucide-react"
import DateRangePicker from "@/components/ui/data-range-picker"
import { VehicleType } from "@/types/enums/vehicle.enum"
import dayjs, { type Dayjs } from "dayjs"

interface DashboardFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export function DashboardFilters({ onFiltersChange }: DashboardFiltersProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [selectedVehicleType, setSelectedVehicleType] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null)

  // 선택된 period에 따라 DateRange 계산
  const getDateRangeByPeriod = (period: string): [Dayjs, Dayjs] => {
    const today = dayjs()
    let startDate: Dayjs

    switch (period) {
      case "1d":
        startDate = today.subtract(1, "day")
        break
      case "7d":
        startDate = today.subtract(7, "days")
        break
      case "30d":
        startDate = today.subtract(30, "days")
        break
      case "90d":
        startDate = today.subtract(90, "days")
        break
      default:
        startDate = today.subtract(7, "days")
    }

    return [startDate.startOf("day"), today.endOf("day")]
  }

  // 초기값 설정 (기본값: 7d)
  useEffect(() => {
    const initialDateRange = getDateRangeByPeriod("7d")
    setDateRange(initialDateRange)
  }, [])

  // selectedPeriod 변경 시 DateRange 업데이트
  useEffect(() => {
    const newDateRange = getDateRangeByPeriod(selectedPeriod)
    setDateRange(newDateRange)
  }, [selectedPeriod])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleDateChange = (formattedRange: { from: string; to: string } | null) => {
    // DateRangePicker에서 직접 수정된 경우 처리
    if (formattedRange) {
      // 필요하면 selectedPeriod를 "custom"으로 변경할 수도 있습니다
    }
  }

  return (
    <Card className=" border-none shadow-none py-0 mb-7 mt-2">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <DateRangePicker
              defaultDateRange={dateRange || undefined}
              onDateChange={handleDateChange}
            />
          </div>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedVehicleType}
            onValueChange={setSelectedVehicleType}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {Object.values(VehicleType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type
                    .split("_")
                    .map((t) => t.slice(0, 1).toUpperCase() + t.slice(1))
                    .join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          {/* <div className="text-xs self-end text-muted-foreground font-light pb-[.125rem]">
            Last updated:{" "}
            {new Date().toLocaleString("en-US", {
              timeZone: "America/New_York",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
