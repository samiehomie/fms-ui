"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { socketManager } from "../socket-manager"
import type {
  WebSocketEvent,
  SubscriptionOptions,
} from "@/types/features/trips/trip-live.types"

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

  // Initialize connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        if (!socketManager.isConnectedStatus()) {
          await socketManager.connect()
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
  }, [onError])

  // Handle subscription
  useEffect(() => {
    if (!socketManager.isConnectedStatus()) return

    const subscriptionOptions: SubscriptionOptions = {
      tripId,
      vehicleId,
    }

    socketManager.subscribe(subscriptionOptions)

    return () => {
      socketManager.unsubscribe(tripId)
    }
  }, [tripId, vehicleId])

  // Handle events
  useEffect(() => {
    const unsubscribe1 = socketManager.addEventListener(
      "trip:started",
      (event) => {
        logger.info("Received trip:started event", event)
        setEvents((prev) => [event, ...prev])
      },
    )

    const unsubscribe2 = socketManager.addEventListener(
      "trip:completed",
      (event) => {
        logger.info("Received trip:completed event", event)
        setEvents((prev) => [event, ...prev])
      },
    )

    const unsubscribe3 = socketManager.addEventListener(
      "gps:updated",
      (event) => {
        logger.info("Received gps:updated event", event)
        setEvents((prev) => [event, ...prev])
      },
    )

    const unsubscribe4 = socketManager.addEventListener(
      "tpms:updated",
      (event) => {
        logger.info("Received tpms:updated event", event)
        setEvents((prev) => [event, ...prev])
      },
    )

    const unsubscribe5 = socketManager.addEventListener(
      "ai:result:updated",
      (event) => {
        logger.info("Received ai:result:updated event", event)
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
  }, [onError])

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

  // Cleanup
  useEffect(() => {
    return () => {
      socketManager.disconnect()
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
