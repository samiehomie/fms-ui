// 테스트 위함 삭제 될 것

import { useEffect, useState, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ApiResponseType, ApiRequestType, ApiParamsType } from '@/types/api'
import { buildURL } from '../api/utils'

// export interface Vehicle {
//   id: string
//   name: string
//   type: 'sedan' | 'truck' | 'bus' | 'van'
//   status: 'active' | 'idle'
//   speed: number
//   fuel: number
//   driver: string
//   lat: number
//   lng: number
//   heading: number
//   lastUpdate: string
// }

// interface StreamData {
//   type: 'initial' | 'update' | 'heartbeat'
//   vehicles?: Vehicle[]
//   timestamp: string
// }

export interface Vehicle {
  id: string
  name: string
  type: 'sedan' | 'truck' | 'bus' | 'van'
  status: 'active' | 'idle'
  speed: number
  fuel: number
  driver: string
  lat: number
  lng: number
  heading: number
  lastUpdate: string
}

// type Vehicles = NonNullable<
//   ApiResponseType<`GET /sse/vehicles/live-stream/{company_id}`>['data']['vehicles']
// >

type StreamData = ApiResponseType<`GET /sse/vehicles/live-stream/{company_id}`>

export const useVehicleLiveStream = (
  params: ApiParamsType<`GET /sse/vehicles/live-stream/{company_id}`>,
) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const { companyId, ...queryString } = params
  const apiUrl = buildURL(
    `/sse/vehicles/live-stream/${params.companyId}`,
    queryString,
  )

  logger.info('Live Stream Endpoint : ', apiUrl)

  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return
    }

    try {
      const eventSource = new EventSource(apiUrl)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
      }

      eventSource.onmessage = (event) => {
        try {
          const data: StreamData = JSON.parse(event.data)

          if (data.type === 'vehicle-update') {
            if (data.data.vehicles) {
              const vehicles = data.data.vehicles.map((v) => ({
                id: v.id.toString(),
                name: v.vehicle_name,
                // todo: type, status, speed, fuel API 추가
                type: 'truck' as const,
                status: 'active' as const,
                speed: 50,
                fuel: v.trips[v.trips.length].fuel_consumed,
                driver: v.users[0].name,
                // todo: trip에서 lat, lng, heading 필요
                lat: 0,
                lng: 0,
                heading: 0,
                lastUpdate: data.timestamp,
              }))
              setVehicles(vehicles)
              // 쿼리 캐시에도 업데이트
              // queryClient.setQueryData(['vehicles'], data.vehicles)
            }
          }
        } catch (err) {
          logger.error('Failed to parse SSE data:', err)
        }
      }

      eventSource.onerror = () => {
        setIsConnected(false)
        setError('Connection lost. Reconnecting...')
        eventSource.close()

        // 지수 백오프로 재연결
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttemptsRef.current),
          30000,
        )
        reconnectAttemptsRef.current++

        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, delay)
      }
    } catch (err) {
      setError('SSE connection error')
      logger.error('SSE connection error:', err)
    }
  }, [queryClient])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    setIsConnected(false)
  }, [])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    vehicles,
    isConnected,
    error,
    reconnect: connect,
  }
}
