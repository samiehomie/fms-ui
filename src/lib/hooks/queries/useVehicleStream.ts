// 테스트 위함 삭제 될 것

import { useEffect, useState, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export interface Vehicle {
  id: string
  name: string
  type: 'sedan' | 'truck' | 'bus' | 'van'
  status: 'active' | 'idle' | 'maintenance'
  speed: number
  fuel: number
  driver: string
  lat: number
  lng: number
  heading: number
  lastUpdate: string
}

interface StreamData {
  type: 'initial' | 'update' | 'heartbeat'
  vehicles?: Vehicle[]
  timestamp: string
}

export const useVehicleStream = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return
    }

    try {
      const eventSource = new EventSource('/api/vehicles/stream')
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
      }

      eventSource.onmessage = (event) => {
        try {
          const data: StreamData = JSON.parse(event.data)

          if (data.type === 'initial' || data.type === 'update') {
            if (data.vehicles) {
              setVehicles(data.vehicles)
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
        setError('연결이 끊어졌습니다. 재연결 중...')
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
      setError('SSE 연결을 생성할 수 없습니다.')
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
