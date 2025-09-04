"use client"

import type React from "react"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Route, Car, Fuel } from "lucide-react"
import type { ChartDataPoint } from "@/lib/data/dashboard"

interface FleetActivityChartProps {
  data: ChartDataPoint[]
}

interface ChartConfig {
  key: keyof ChartDataPoint
  label: string
  unit: string
  color: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const chartConfigs: ChartConfig[] = [
  {
    key: "distance",
    label: "Distance Traveled",
    unit: "km",
    color: "#8884d8",
    icon: Route,
    description: "Total distance covered by all vehicles",
  },
  {
    key: "vehicles",
    label: "Active Vehicles",
    unit: "vehicles",
    color: "#82ca9d",
    icon: Car,
    description: "Number of vehicles in operation",
  },
  {
    key: "fuelConsumption",
    label: "Fuel Consumption",
    unit: "L",
    color: "#ffc658",
    icon: Fuel,
    description: "Total fuel consumed by fleet",
  },
]

export function FleetActivityChart({ data }: FleetActivityChartProps) {
  const [activeTab, setActiveTab] = useState("distance")

  const formatTooltipValue = (value: any, name: string) => {
    const config = chartConfigs.find((c) => c.key === name)
    if (!config) return [value, name]

    const formattedValue =
      typeof value === "number" ? value.toLocaleString() : value
    return [`${formattedValue} ${config.unit}`, config.label]
  }

  const getCurrentConfig = () => {
    return (
      chartConfigs.find((config) => config.key === activeTab) || chartConfigs[0]
    )
  }

  const currentConfig = getCurrentConfig()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <currentConfig.icon className="h-5 w-5" />
          Fleet Activity Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            {chartConfigs.map((config) => (
              <TabsTrigger
                key={config.key}
                value={config.key}
                className="flex items-center gap-2 text-xs"
              >
                <config.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{config.label}</span>
                <span className="sm:hidden">{config.unit}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {chartConfigs.map((config) => (
            <TabsContent key={config.key} value={config.key} className="mt-0">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <h3 className="text-lg font-semibold">{config.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {config.description}
                </p>
              </div>

              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#e5e7eb" }}
                      label={{
                        value: config.unit,
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      formatter={formatTooltipValue}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={config.key}
                      stroke={config.color}
                      strokeWidth={3}
                      dot={{
                        fill: config.color,
                        strokeWidth: 2,
                        r: 4,
                        stroke: "white",
                      }}
                      activeDot={{
                        r: 6,
                        stroke: config.color,
                        strokeWidth: 2,
                        fill: "white",
                      }}
                      name={config.key}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Stats */}
              <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: config.color }}
                  >
                    {Math.max(
                      ...data.map((d) => Number(d[config.key])),
                    ).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Peak</p>
                </div>
                <div className="text-center">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: config.color }}
                  >
                    {Math.round(
                      data.reduce((sum, d) => sum + Number(d[config.key]), 0) /
                        data.length,
                    ).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Average</p>
                </div>
                <div className="text-center">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: config.color }}
                  >
                    {data
                      .reduce((sum, d) => sum + Number(d[config.key]), 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
