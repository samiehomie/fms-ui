"use client"

import { io, Socket } from "socket.io-client"
import type {
  WebSocketEvent,
  SubscriptionOptions,
} from "@/types/features/trips/trip-live.types"

export class SocketManager {
  private static instance: SocketManager
  private socket: Socket | null = null
  private isConnected = false
  private isConnecting = false // 연결 중인 상태 추적
  private connectPromise: Promise<void> | null = null // 중복 연결 방지용 Promise 캐시
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  private eventListeners: Map<string, Set<(event: WebSocketEvent) => void>> =
    new Map()

  private connectionListeners: Set<(connected: boolean) => void> = new Set()

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager()
    }
    return SocketManager.instance
  }

  private normalizeSocketUrl(url: string): string {
    // URL이 이미 프로토콜을 포함하는 경우
    if (url.startsWith("http://") || url.startsWith("https://")) {
      // https -> wss, http -> ws로 변환
      return url.replace(/^https:/, "wss:").replace(/^http:/, "ws:")
    }

    // 상대 경로인 경우, 현재 페이지의 프로토콜을 사용
    if (typeof window !== "undefined") {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
      // URL이 /로 시작하면 도메인 추가
      if (url.startsWith("/")) {
        return `${protocol}//${window.location.host}${url}`
      }
      // 도메인만 있으면 프로토콜 추가
      return `${protocol}//${url}`
    }

    return url
  }

  connect(url: string = process.env.NEXT_PUBLIC_API_BASE_URL!): Promise<void> {
    // 이미 연결된 경우
    if (this.socket?.connected) {
      logger.info("Socket already connected")
      return Promise.resolve()
    }

    // 연결 중인 경우, 기존 Promise 반환 (중복 연결 방지)
    if (this.isConnecting && this.connectPromise) {
      logger.info("Socket connection already in progress, reusing existing promise")
      return this.connectPromise
    }

    this.isConnecting = true

    this.connectPromise = new Promise((resolve, reject) => {
      try {
        logger.info("Connecting to WebSocket", { url })

        // URL이 프로토콜 없이 전달된 경우, https에서 온 요청이면 wss로 설정
        const socketUrl = this.normalizeSocketUrl(url)
        logger.info("Normalized WebSocket URL", { socketUrl })

        this.socket = io(socketUrl, {
          path: "/v1/socket.io/",
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionDelay: this.reconnectDelay,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: this.maxReconnectAttempts,
          autoConnect: false,
          secure: true,
          rejectUnauthorized: false, // 자체 서명된 인증서 허용
        })

        this.setupEventListeners()

        this.socket.connect()

        this.socket.on("connect", () => {
          logger.info("Socket connected successfully")
          this.isConnected = true
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.notifyConnectionListeners(true)
          resolve()
        })

        this.socket.on("connect_error", (error: Error) => {
          logger.error("Socket connection error", error)
          this.reconnectAttempts++
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.isConnecting = false
            this.connectPromise = null
            reject(new Error("Failed to connect after maximum attempts"))
          }
        })

        this.socket.on("disconnect", (reason: string) => {
          logger.warn("Socket disconnected", { reason })
          this.isConnected = false
          this.isConnecting = false
          this.connectPromise = null
          this.notifyConnectionListeners(false)
        })
      } catch (error) {
        logger.error("Error connecting socket", error)
        this.isConnecting = false
        this.connectPromise = null
        reject(error)
      }
    })

    return this.connectPromise
  }

  private setupEventListeners(): void {
    if (!this.socket) return

    // Trip events
    this.socket.on("trip:started", (data) => {
      this.notifyListeners("trip:started", { type: "trip:started", data })
    })

    this.socket.on("trip:completed", (data) => {
      this.notifyListeners("trip:completed", { type: "trip:completed", data })
    })

    // GPS events
    this.socket.on("gps:updated", (data) => {
      this.notifyListeners("gps:updated", { type: "gps:updated", data })
    })

    // TPMS events
    this.socket.on("tpms:updated", (data) => {
      this.notifyListeners("tpms:updated", { type: "tpms:updated", data })
    })

    // AI result events
    this.socket.on("ai:result:updated", (data) => {
      this.notifyListeners("ai:result:updated", {
        type: "ai:result:updated",
        data,
      })
    })

    // Subscription events
    this.socket.on("subscribed", (data) => {
      logger.info("Subscribed to trip updates", data)
      this.notifyListeners("subscribed", { type: "subscribed", data })
    })

    this.socket.on("unsubscribed", (data) => {
      logger.info("Unsubscribed from trip updates", data)
      this.notifyListeners("unsubscribed", { type: "unsubscribed", data })
    })

    // Error handling
    this.socket.on("error", (error: unknown) => {
      logger.error("Socket error", error)
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.notifyListeners("error", {
        type: "error",
        data: { message: errorMessage },
      })
    })
  }

  subscribe(options: SubscriptionOptions): void {
    if (!this.socket?.connected) {
      logger.error("Socket not connected, cannot subscribe")
      return
    }

    try {
      logger.info("Subscribing to trip", options)
      this.socket.emit("subscribe-trip", options)
    } catch (error) {
      logger.error("Error subscribing to trip", error)
    }
  }

  unsubscribe(tripId: number): void {
    if (!this.socket?.connected) {
      logger.error("Socket not connected, cannot unsubscribe")
      return
    }

    try {
      logger.info("Unsubscribing from trip", { tripId })
      this.socket.emit("unsubscribe-trip", { tripId })
    } catch (error) {
      logger.error("Error unsubscribing from trip", error)
    }
  }

  addEventListener(
    eventType: string,
    listener: (event: WebSocketEvent) => void,
  ): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set())
    }

    this.eventListeners.get(eventType)!.add(listener)

    // Return unsubscribe function
    return () => {
      this.eventListeners.get(eventType)?.delete(listener)
    }
  }

  addConnectionListener(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.add(listener)

    // Return unsubscribe function
    return () => {
      this.connectionListeners.delete(listener)
    }
  }

  private notifyListeners(eventType: string, event: WebSocketEvent): void {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event)
        } catch (error) {
          logger.error("Error in event listener", error)
        }
      })
    }
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(connected)
      } catch (error) {
        logger.error("Error in connection listener", error)
      }
    })
  }

  isConnectedStatus(): boolean {
    return !!(this.isConnected && this.socket?.connected)
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.isConnected = false
      this.isConnecting = false
      this.connectPromise = null
      logger.info("Socket disconnected")
    }
  }
}

export const socketManager = SocketManager.getInstance()
