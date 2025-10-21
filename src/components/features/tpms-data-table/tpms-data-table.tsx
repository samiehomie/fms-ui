'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  type PressureUnit,
  type TemperatureUnit,
  formatPressure,
  formatTemperature,
} from '@/lib/utils/unit-conversions'
import type { TripTpmsDetailsResponse } from '@/types/features/trips/trip.types'
import { chunkArray } from '@/lib/utils/utils'

interface TPMSDataTableProps {
  data: TripTpmsDetailsResponse
  pressureUnit: PressureUnit
  temperatureUnit: TemperatureUnit
  numTire: number
}

export default function TPMSDataTable({
  data,
  pressureUnit,
  temperatureUnit,
  numTire,
}: TPMSDataTableProps) {
  const tireChunks = chunkArray(data, numTire)
  return (
    <div className="overflow-auto border border-border rounded-[0px_0px_4px_4px]">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left font-medium border-r border-border bg-muted/80 sticky left-0 z-20 w-[70px] min-w-[70px] max-w-[70px] ">
              TIME
            </th>
            {tireChunks[0].map((data, index) => {
              const tireLocation = data.tire.tireLocation
              return (
                <th
                  key={`${tireLocation}-${index}`}
                  colSpan={3}
                  className="px-4 py-2 text-center font-medium border-r border-b border-border "
                >
                  {tireLocation}
                </th>
              )
            })}
          </tr>
          <tr className="bg-muted/30">
            <th className="px-4 py-2 text-left font-medium border-r border-border bg-muted/60 sticky left-0 z-20 w-[180px] min-w-[180px] max-w-[180px]"></th>
            {tireChunks[0].map((data, index) => {
              const tireLocation = data.tire.tireLocation
              const key = `${tireLocation}-${index}`
              return (
                <React.Fragment key={key}>
                  <th className="px-2 py-2 text-center font-medium border-r border-border/50 w-16">
                    {temperatureUnit}
                  </th>
                  <th className="px-2 py-2 text-center font-medium border-r border-border/50 w-16">
                    {pressureUnit}
                  </th>
                  <th className="px-2 py-2 text-center font-medium border-r border-border w-12">
                    <AlertTriangle className="w-4 h-4 mx-auto text-muted-foreground" />
                  </th>
                </React.Fragment>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {tireChunks.map((tireChunk, chunkIndex) => {
            return (
              <tr
                key={chunkIndex}
                className="border-t border-border hover:bg-muted/20"
              >
                {tireChunk.map((tireData, index) => {
                  return (
                    <React.Fragment
                      key={`${tireData.id}-${index}-${chunkIndex}`}
                    >
                      {index === 0 && (
                        <td className="px-4 py-3 font-mono text-xs border-r border-border bg-muted/10 sticky left-0 z-10 whitespace-nowrap w-[180px] min-w-[180px] max-w-[180px]">
                          {new Date(tireData.resultTime).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: '2-digit',
                            },
                          )}{' '}
                          {new Date(tireData.resultTime).toLocaleTimeString(
                            'en-US',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false,
                            },
                          )}
                        </td>
                      )}

                      <td className="px-2 py-3 text-center border-r border-border/50 font-mono text-xs">
                        {formatTemperature(
                          tireData.temperature,
                          temperatureUnit,
                        )}
                      </td>
                      <td className="px-2 py-3 text-center border-r border-border/50 font-mono text-xs">
                        {formatPressure(tireData.pressure, pressureUnit)}
                      </td>
                      <td className="px-2 py-3 text-center border-r border-border">
                        {tireData.slowleak && (
                          <AlertTriangle className="w-4 h-4 mx-auto text-destructive fill-destructive/20" />
                        )}
                      </td>
                    </React.Fragment>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
