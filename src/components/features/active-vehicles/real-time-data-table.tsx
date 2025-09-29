'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { useAIResults, useTPMSResults } from '@/lib/queries/useActiveVehicles'
import type { VehicleDataParams } from '@/types/api/vehicle.types'

interface RealTimeDataTableProps {
  vehicleId: number
}

export default function RealTimeDataTable({
  vehicleId,
}: RealTimeDataTableProps) {
  const params: VehicleDataParams = {
    page: 1,
    limit: 1,
    start_date: '2025-06-01T00:00:00Z',
    end_date: '2025-12-30T23:59:59Z',
  }

  const {
    data: aiData,
    isLoading: aiLoading,
    error: aiError,
  } = useAIResults(vehicleId.toString(), params)
  const {
    data: tpmsData,
    isLoading: tpmsLoading,
    error: tpmsError,
  } = useTPMSResults(vehicleId.toString(), {
    ...params,
    limit: 4,
  })

  const aiResult = aiData?.data.ai_results?.[0]
  const tpmsResult = tpmsData?.data.tpms_results

  if (aiLoading || tpmsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading real-time data...</span>
      </div>
    )
  }

  if (aiError || tpmsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-destructive">Failed to load data</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Load Detection</CardTitle>
        </CardHeader>
        <CardContent>
          {aiResult ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Model:</span> {aiResult.model}
              </div>
              <div>
                <span className="font-medium">Result:</span>{' '}
                {aiResult.model_result}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Prediction Time:</span>{' '}
                {aiResult.pred_time}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No AI data available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>TPMS Data</CardTitle>
        </CardHeader>
        <CardContent>
          {tpmsResult && tpmsResult.length > 0 ? (
            tpmsResult.map((tpms, index) => (
              <div
                className="grid grid-cols-2 gap-4 border-b"
                key={tpms.tire_id.tire_location}
              >
                <div>
                  <span className="font-medium">Pressure:</span> {tpms.pressure}
                </div>
                <div>
                  <span className="font-medium">Temperature:</span>{' '}
                  {tpms.temperature}°C
                </div>
                <div>
                  <span className="font-medium">Slow Leak:</span>{' '}
                  <Badge variant={tpms.slowleak ? 'destructive' : 'default'}>
                    {tpms.slowleak ? 'Detected' : 'Normal'}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Blowout:</span>{' '}
                  <Badge variant={tpms.blowout ? 'destructive' : 'default'}>
                    {tpms.blowout ? 'Detected' : 'Normal'}
                  </Badge>
                </div>
                <div>
                  {tpms.tire_id.tire_location}
                </div>
                {index === 3 && (
                  <div className="col-span-2">
                    <span className="font-medium">Result Time:</span>{' '}
                    {new Date(tpms.result_time)
                      .toISOString()
                      .replace('T', ' ')
                      .slice(0, 19)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No TPMS data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
