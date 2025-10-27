"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import type {
  TripTpmsDetailsResponse,
  TripTpmsDetailsQuery,
} from "@/types/features/trips/trip.types"
import {
  type PressureUnit,
  type TemperatureUnit,
  formatPressure,
  formatTemperature,
} from "@/lib/utils/unit-conversions"
import { useTripTpmsDetails } from "@/lib/query-hooks/use-vehicles"

const rows = 15

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
      timestamp: item.resultTime,
      pressure: item.pressure,
      temperature: item.temperature,
    })
  }

  return result
}

export default function TPMSCharts({
  selectedId,
  pressureUnit,
  temperatureUnit,
  numTire,
  selectedTires,
  tireLocations,
  tpmsQuery,
}: TPMSChartsProps) {
  const { data: tpmsData, isLoading } = useTripTpmsDetails({
    page: tpmsQuery.page,
    id: selectedId,
    limit: numTire * rows,
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

  return (
    <div className="space-y-3 mt-2.5">
      {filteredTirePositions.map((position, index) => (
        <Card
          key={`${position}-${index}`}
          className=" shadow-none rounded-xs py-3 gap-2"
        >
          <CardHeader className="px-4 gap-0">
            <CardTitle className="text-[.9375rem] tracking-tight">
              {position?.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pressure Chart */}
              <div>
                <h4 className="text-[.8125rem] mb-2">
                  Pressure ({pressureUnit})
                </h4>
                <ChartContainer
                  config={{
                    pressure: {
                      label: "Pressure",
                      // color: position.color,
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartDataSet[position]}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 11 }}
                        tickMargin={8}
                        interval="preserveStartEnd"
                        minTickGap={50}
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickMargin={8}
                        tickFormatter={(value) =>
                          formatPressure(value, pressureUnit)
                        }
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) =>
                              formatPressure(Number(value), pressureUnit)
                            }
                            labelFormatter={(label, payload) => {
                              if (payload && payload[0]) {
                                const date = payload[0].payload.fullTime as Date
                                return date.toLocaleString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: false,
                                })
                              }
                              return label
                            }}
                          />
                        }
                      />
                      {/* <Line
                        type="monotone"
                        dataKey={`${position.key}_pressure`}
                        stroke={position.color}
                        strokeWidth={2}
                        dot={false}
                        name="Pressure"
                      /> */}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
