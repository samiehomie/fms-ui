"use client"

import { useState } from "react"
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

interface DashboardFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export function DashboardFilters({ onFiltersChange }: DashboardFiltersProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [selectedVehicleType, setSelectedVehicleType] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <Card className=" border-none shadow-none py-0 mb-7 mt-2">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <DateRangePicker />
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
              <SelectItem value="truck">Trucks</SelectItem>
              <SelectItem value="van">Vans</SelectItem>
              <SelectItem value="car">Cars</SelectItem>
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
