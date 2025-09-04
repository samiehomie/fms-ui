"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartDataPoint } from "@/constants/mock_data/dashboard"

interface FleetActivityChartProps {
  data: ChartDataPoint[]
}

export function FleetActivityChart({ data }: FleetActivityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Activity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="distance"
                stroke="#8884d8"
                strokeWidth={2}
                name="Distance (km)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="vehicles"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Active Vehicles"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="fuelConsumption"
                stroke="#ffc658"
                strokeWidth={2}
                name="Fuel (L)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
