"use client"
import { memo } from "react"
import type { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { TireMultiSelect } from "./tire-multi-select"
import DateRangePicker from "@/components/ui/data-range-picker"
import type {
  PressureUnit,
  TemperatureUnit,
} from "@/lib/utils/unit-conversions"
import dayjs from "dayjs"

interface TripTpmsHeaderProps {
  startDate?: string
  endDate?: string
  tireLocations: string[]
  selectedTires: string[]
  setSelectedTires: Dispatch<SetStateAction<string[]>>
  viewMode: "table" | "charts"
  setViewMode: (value: SetStateAction<"table" | "charts">) => void
  pressureUnit: PressureUnit
  temperatureUnit: TemperatureUnit
  setPressureUnit: (value: SetStateAction<PressureUnit>) => void
  setTemperatureUnit: (value: SetStateAction<TemperatureUnit>) => void
  handleDateRangeChange: (
    dateRange: {
      from: string
      to: string
    } | null,
  ) => void
}

const TripTpmsHeader = ({
  startDate,
  endDate,
  tireLocations,
  selectedTires,
  setSelectedTires,
  viewMode,
  setViewMode,
  pressureUnit,
  temperatureUnit,
  setTemperatureUnit,
  setPressureUnit,
  handleDateRangeChange,
}: TripTpmsHeaderProps) => {
  return (
    <div
      className="flex flex-wrap items-center gap-x-5 px-4 bg-muted/20  border-[1px_1px_1px_1px]
    rounded-[4px_4px_0px_0px] h-[44px]"
    >
      <div className="flex flex-col gap-x-2">
        <label className="text-[9.5px] font-[200] leading-none mb-[3.5px] tracking-wide">
          View Single Tyre
        </label>
        <TireMultiSelect
          tireLocations={tireLocations}
          selectedTires={selectedTires}
          onSelectionChange={setSelectedTires}
        />
      </div>
      <div className="flex flex-col gap-x-2">
        <label className="text-[9.5px] font-[200] leading-none mb-[3.5px] tracking-wide">
          View Types
        </label>
        <div className="flex border border-border rounded-xs bg-background">
          <Button
            variant={viewMode === "charts" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("charts")}
            className="h-4 text-[12px] rounded-none font-[300]"
          >
            Charts
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="h-4 text-[12px] rounded-none font-[300]"
          >
            Table
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-x-2 font-mono">
        <label className="text-[9.5px] font-[200] leading-none mb-[3.5px] tracking-wide">
          Pressure Units
        </label>
        <div className="flex border border-border rounded-xs bg-background">
          <Button
            variant={pressureUnit === "PSI" ? "secondary" : "ghost"}
            size="sm"
            className="h-4 text-[12px] rounded-none font-[300]"
            onClick={() => setPressureUnit("PSI")}
          >
            PSI
          </Button>
          <Button
            variant={pressureUnit === "BAR" ? "secondary" : "ghost"}
            size="sm"
            className="h-4 text-[12px] rounded-none font-[300]"
            onClick={() => setPressureUnit("BAR")}
          >
            BAR
          </Button>
          <Button
            variant={pressureUnit === "kPa" ? "secondary" : "ghost"}
            size="sm"
            className="h-4 text-[12px] rounded-none font-[300]"
            onClick={() => setPressureUnit("kPa")}
          >
            kPa
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-x-2 font-mono">
        <label className="text-[9.5px] font-[200] leading-none mb-[3.5px] tracking-wide">
          Temperature Units
        </label>
        <div className="flex border border-border rounded-xs bg-background">
          <Button
            variant={temperatureUnit === "°C" ? "secondary" : "ghost"}
            size="sm"
            className="h-4 text-[12px] rounded-none font-[300]"
            onClick={() => setTemperatureUnit("°C")}
          >
            °C
          </Button>
          <Button
            variant={temperatureUnit === "°F" ? "secondary" : "ghost"}
            size="sm"
            className="h-4 text-[12px] rounded-none font-[300]"
            onClick={() => setTemperatureUnit("°F")}
          >
            °F
          </Button>
          <Button
            variant={temperatureUnit === "cff" ? "secondary" : "ghost"}
            size="sm"
            className="h-4 text-[12px] rounded-none font-[300]"
            onClick={() => setTemperatureUnit("cff")}
          >
            cff
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-x-2 font-mono ml-auto">
        <DateRangePicker
          onDateChange={handleDateRangeChange}
          className="h-7 leading-none "
          minDate={startDate}
          maxDate={endDate}
        />
      </div>
    </div>
  )
}

export default memo(TripTpmsHeader)
