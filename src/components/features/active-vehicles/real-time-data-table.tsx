'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertTriangle,
  Thermometer,
  Gauge,
  Brain,
  MapPin,
  Clock,
  Truck,
} from 'lucide-react'
import type { Vehicle, CombinedTireData } from '@/types/api/vehicle.types'
interface RealTimeDataProps {
  selectedVehicle: Vehicle | null
  tireData: CombinedTireData[]
  isLoading: boolean
}

export function RealTimeDataTable({
  selectedVehicle,
  tireData,
  isLoading,
}: RealTimeDataProps) {
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const getAlertBadge = (slowleak?: boolean, blowout?: boolean) => {
    if (blowout) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Blowout
        </Badge>
      )
    }
    if (slowleak) {
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-yellow-100 text-yellow-800"
        >
          <AlertTriangle className="h-3 w-3" />
          Slow Leak
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="gap-1 bg-green-100 text-green-800">
        Normal
      </Badge>
    )
  }

  if (!selectedVehicle) {
    return (
      <Card className="shadow-none py-[31px]">
        <CardContent className="flex items-center justify-center">
          <div className="text-center space-y-4">
            <Truck className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground">
                No Vehicle Selected
              </h3>
              <p className="text-sm text-muted-foreground">
                Select a vehicle from the list to view real-time data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="shadow-none py-[31px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {selectedVehicle.plate_number} - Real-Time Data
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">
              Loading real-time data...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-none py-[31px] min-h-[525.5px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          {selectedVehicle.plate_number} - Real-Time Data
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {selectedVehicle.brand} {selectedVehicle.model} •{' '}
          {selectedVehicle.company_id.name}
        </div>
      </CardHeader>
      <CardContent>
        {tireData.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">
              No Data Available
            </h3>
            <p className="text-sm text-muted-foreground">
              No real-time tire data found for this vehicle
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {/* <Gauge className="h-4 w-4" /> */}
                    <div>
                      <p className="text-sm font-medium">Avg Pressure</p>
                      <p className="text-lg font-bold">
                        {tireData
                          .filter((t) => t.pressure)
                          .reduce(
                            (sum, t) =>
                              sum + Number.parseFloat(t.pressure || '0'),
                            0,
                          ) / tireData.filter((t) => t.pressure).length ||
                          0}{' '}
                        PSI
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {/* <Thermometer className="h-4 w-4" /> */}
                    <div>
                      <p className="text-sm font-medium">Avg Temperature</p>
                      <p className="text-lg font-bold">
                        {Math.round(
                          tireData
                            .filter((t) => t.temperature)
                            .reduce(
                              (sum, t) =>
                                sum + Number.parseFloat(t.temperature || '0'),
                              0,
                            ) / tireData.filter((t) => t.temperature).length ||
                            0,
                        )}
                        °C
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {/* <AlertTriangle className="h-4 w-4 text-yellow-500" /> */}
                    <div>
                      <p className="text-sm font-medium">Alerts</p>
                      <p className="text-lg font-bold">
                        {tireData.filter((t) => t.slowleak || t.blowout).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {/* <Brain className="h-4 w-4 text-purple-500" /> */}
                    <div>
                      <p className="text-sm font-medium">Avg Load</p>
                      <p className="text-lg font-bold">
                        {Math.round(
                          tireData
                            .filter((t) => t.model_result)
                            .reduce(
                              (sum, t) =>
                                sum + Number.parseFloat(t.model_result || '0'),
                              0,
                            ) / tireData.filter((t) => t.model_result).length ||
                            0,
                        )}{' '}
                        kg
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tire Location</TableHead>
                    <TableHead>Pressure (PSI)</TableHead>
                    <TableHead>Temperature (°C)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Load (kg)</TableHead>
                    {/* <TableHead>Location</TableHead> */}
                    <TableHead>Speed (km/h)</TableHead>
                    <TableHead>Last Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tireData.map((tire) => (
                    <TableRow key={tire.tire_location}>
                      <TableCell className="font-medium">
                        {tire.tire_location}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* <Gauge className="h-4 w-4 text-blue-500" /> */}
                          {tire.pressure || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* <Thermometer className="h-4 w-4 text-red-500" /> */}
                          {tire.temperature || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getAlertBadge(tire.slowleak, tire.blowout)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* <Brain className="h-4 w-4 text-purple-500" /> */}
                          {tire.model_result || 'N/A'}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-500" />
                          {tire.latitude && tire.longitude
                            ? `${Number.parseFloat(tire.latitude).toFixed(
                                4,
                              )}, ${Number.parseFloat(tire.longitude).toFixed(
                                4,
                              )}`
                            : 'N/A'}
                        </div>
                      </TableCell> */}
                      <TableCell>
                        {tire.speed ? `${tire.speed}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div className="text-xs">
                            <div>TPMS: {formatDateTime(tire.result_time)}</div>
                            <div>AI: {formatDateTime(tire.pred_time)}</div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
