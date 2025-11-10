"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { socketManager } from "../socket-manager"
import type {
  WebSocketEvent,
  SubscriptionOptions,
} from "@/types/features/trips/trip-live.types"

// 전역 hook 사용 카운트 (disconnect 방지)
let socketHookCount = 0

interface UseTripWebSocketOptions {
  tripId: number
  vehicleId?: number
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
}

export function useTripWebSocket({
  tripId,
  vehicleId,
  onConnect,
  onDisconnect,
  onError,
}: UseTripWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [events, setEvents] = useState<WebSocketEvent[]>([])
  const [error, setError] = useState<Error | null>(null)
  const unsubscribersRef = useRef<Array<() => void>>([])

  // Initialize connection (한 번만 실행)
  useEffect(() => {
    socketHookCount++

    const initializeConnection = async () => {
      try {
        if (!socketManager.isConnectedStatus()) {
          await socketManager.connect(
            process.env.NEXT_PUBLIC_WS_URL ??
              process.env.NEXT_PUBLIC_API_BASE_URL,
          )
          logger.info("WebSocket connection established")
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        onError?.(error)
        logger.error("Failed to initialize WebSocket connection", error)
      }
    }

    initializeConnection()

    return () => {
      socketHookCount--
    }
  }, [])

  // Handle subscription
  useEffect(() => {
    if (!isConnected) return

    const subscriptionOptions: SubscriptionOptions = {
      tripId,
      vehicleId,
    }

    socketManager.subscribe(subscriptionOptions)

    return () => {
      socketManager.unsubscribe(tripId)
    }
  }, [tripId, vehicleId, isConnected])

  // Handle events (한 번만 등록)
  useEffect(() => {
    const unsubscribe1 = socketManager.addEventListener(
      "trip:started",
      (event) => {
        setEvents((prev) => [event, ...prev])
      },
    )

    const unsubscribe2 = socketManager.addEventListener(
      "trip:completed",
      (event) => {
        setEvents((prev) => [event, ...prev])
      },
    )

    const unsubscribe3 = socketManager.addEventListener(
      "gps:updated",
      (event) => {
        setEvents((prev) => [event, ...prev])
      },
    )

    const unsubscribe4 = socketManager.addEventListener(
      "tpms:updated",
      (event) => {
        setEvents((prev) => [event, ...prev])
      },
    )

    const unsubscribe5 = socketManager.addEventListener(
      "ai:result:updated",
      (event) => {
        setEvents((prev) => [event, ...prev])
      },
    )

    const unsubscribe6 = socketManager.addEventListener("error", (event) => {
      logger.error("Received error event", event)
      const error = new Error("Received error event")
      setError(error)
      onError?.(error)
    })

    unsubscribersRef.current = [
      unsubscribe1,
      unsubscribe2,
      unsubscribe3,
      unsubscribe4,
      unsubscribe5,
      unsubscribe6,
    ]

    return () => {
      unsubscribersRef.current.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  // Handle connection status
  useEffect(() => {
    const unsubscribe = socketManager.addConnectionListener((connected) => {
      setIsConnected(connected)
      if (connected) {
        onConnect?.()
      } else {
        onDisconnect?.()
      }
    })

    // Check current connection status
    setIsConnected(socketManager.isConnectedStatus())

    return unsubscribe
  }, [onConnect, onDisconnect])

  // Cleanup (마지막 hook이 언마운트될 때만 disconnect)
  useEffect(() => {
    return () => {
      socketHookCount--
      // 모든 hook이 언마운트되었을 때만 disconnect
      if (socketHookCount === 0) {
        socketManager.disconnect()
        logger.info("All WebSocket hooks unmounted, disconnecting")
      }
    }
  }, [])

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isConnected,
    events,
    error,
    clearEvents,
    clearError,
  }
}
