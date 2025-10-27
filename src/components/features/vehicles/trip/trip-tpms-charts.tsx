"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import type {
  TripTpmsDetailsResponse,
  TripTpmsDetailsQuery,
} from "@/types/features/trips/trip.types"
import {
  type PressureUnit,
  type TemperatureUnit,
  // formatPressure,
  // formatTemperature,
} from "@/lib/utils/unit-conversions"
import { useTripTpmsDetails } from "@/lib/query-hooks/use-vehicles"
import { Skeleton } from "@/components/ui/skeleton"
import dayjs from "dayjs"
// import { ScrollArea } from "@/components/ui/scroll-area"

// const rows = 15

interface TPMSChartsProps {
  selectedId: number
  pressureUnit: PressureUnit
  temperatureUnit: TemperatureUnit
  numTire: number
  selectedTires: string[]
  tireLocations: string[]
  tpmsQuery: Omit<TripTpmsDetailsQuery, "id" | "limit">
}

type ChartData = Record<
  string,
  {
    timestamp: string
    pressure: number
    temperature: number
  }[]
>

function transformTireData(data?: TripTpmsDetailsResponse): ChartData {
  if (!data) {
    return {}
  }
  const result: ChartData = {}

  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const tireLocation = item.tire.tireLocation

    if (!result[tireLocation]) {
      result[tireLocation] = []
    }

    result[tireLocation].push({
      timestamp: dayjs(item.resultTime).format("MM/DD HH:mm:ss"),
      pressure: Number(item.pressure),
      temperature: Number(item.temperature),
    })
  }

  return result
}

const chartConfig = {
  pressure: {
    label: "Pressure",
    color: "#0155a3",
  },
  temperature: {
    label: "Temperature",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function TPMSCharts({
  selectedId,
  // pressureUnit,
  // temperatureUnit,
  // numTire,
  selectedTires,
  tireLocations,
  tpmsQuery,
}: TPMSChartsProps) {
  const { data: tpmsData, isLoading } = useTripTpmsDetails({
    page: tpmsQuery.page,
    id: selectedId,
    limit: 1000,
    endDate: tpmsQuery.endDate,
    startDate: tpmsQuery.startDate,
  })
  const filteredTirePositions = selectedTires.includes("all")
    ? tireLocations.map((tp) => tp)
    : tireLocations.filter((tp) => selectedTires.includes(tp)).map((tp) => tp)

  const chartDataSet: ChartData = useMemo(
    () => transformTireData(tpmsData?.data),
    [tpmsData],
  )

  if (isLoading) {
    return (
      <div className="space-y-3 mt-2.5">
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[200px]" />
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-2.5">
      {filteredTirePositions.map((position, index) => {
        console.log(chartDataSet[position])
        return (
          <Card
            key={`${position}-${index}`}
            className=" shadow-none rounded-xs py-3 gap-2 w-full"
          >
            <CardHeader className="px-4 gap-0">
              <CardTitle className="text-[.9375rem] tracking-tight">
                {position?.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 w-full">
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <LineChart
                  accessibilityLayer
                  data={chartDataSet[position]}
                  margin={{
                    left: 10,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fontSize: 10 }}
                    tickMargin={8}
                    interval="preserveStartEnd"
                    minTickGap={13}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />

                  <Line
                    dataKey="pressure"
                    type="monotone"
                    stroke="var(--color-pressure)"
                    strokeWidth={1}
                    dot={false}
                  />
                  <Line
                    dataKey="temperature"
                    type="monotone"
                    stroke="var(--color-temperature)"
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
