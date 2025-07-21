// 테스트 목적으로 삭제 예정임
import { NextResponse } from 'next/server'

// 더미 차량 데이터 생성
const generateVehicles = (count: number) => {
  const vehicles = []
  const centerLat = 37.5665
  const centerLng = 126.978

  for (let i = 0; i < count; i++) {
    vehicles.push({
      id: `vehicle-${i + 1}`,
      name: `차량 ${i + 1}`,
      type: ['sedan', 'truck', 'bus', 'van'][Math.floor(Math.random() * 4)],
      status: ['active', 'idle', 'maintenance'][Math.floor(Math.random() * 3)],
      speed: Math.floor(Math.random() * 80),
      fuel: Math.floor(Math.random() * 100),
      driver: `운전자 ${i + 1}`,
      lat: centerLat + (Math.random() - 0.5) * 0.2,
      lng: centerLng + (Math.random() - 0.5) * 0.2,
      heading: Math.floor(Math.random() * 360),
      lastUpdate: new Date().toISOString(),
    })
  }
  return vehicles
}

export async function GET() {
  const encoder = new TextEncoder()
  let vehicles = generateVehicles(50)

  const stream = new ReadableStream({
    async start(controller) {
      const abortController = new AbortController()
      const { signal } = abortController

      const safeEnqueue = (data: Uint8Array): boolean => {
        // 연결 상태 확인
        if (signal.aborted) {
          return false
        }

        if (controller.desiredSize === null) {
          return false
        }

        try {
          if (controller.desiredSize === null) {
            return false
          }
          controller.enqueue(data)
          return true
        } catch (err) {
          logger.error('Enqueue failed: ', err)
          abortController.abort()
          return false
        }
      }
      // 초기 데이터 전송
      const initialData = `data: ${JSON.stringify({
        type: 'initial',
        vehicles: vehicles,
        timestamp: new Date().toISOString(),
      })}\n\n`

      if (!safeEnqueue(encoder.encode(initialData))) {
        return
      }

      // 2초마다 차량 위치 업데이트
      const interval = setInterval(() => {
        if (signal.aborted) {
          clearInterval(interval)
          return
        }

        // 차량 위치 업데이트
        vehicles = vehicles.map((vehicle) => {
          const deltaLat = (Math.random() - 0.5) * 0.001
          const deltaLng = (Math.random() - 0.5) * 0.001
          const newHeading = vehicle.heading + (Math.random() - 0.5) * 20
          const newSpeed = Math.max(
            0,
            Math.min(120, vehicle.speed + (Math.random() - 0.5) * 10),
          )

          return {
            ...vehicle,
            lat: vehicle.lat + deltaLat,
            lng: vehicle.lng + deltaLng,
            heading: newHeading % 360,
            speed: Math.floor(newSpeed),
            fuel: Math.max(0, vehicle.fuel - Math.random() * 0.1),
            lastUpdate: new Date().toISOString(),
          }
        })

        const updateData = `data: ${JSON.stringify({
          type: 'update',
          vehicles: vehicles,
          timestamp: new Date().toISOString(),
        })}\n\n`

        if (!safeEnqueue(encoder.encode(updateData))) {
          clearInterval(interval)
        }
      }, 2000)

      // 30초마다 heartbeat
      const heartbeatInterval = setInterval(() => {
        if (signal.aborted) {
          clearInterval(heartbeatInterval)
          return
        }

        if (!safeEnqueue(encoder.encode('data: {"type":"heartbeat"}\n\n'))) {
          clearInterval(heartbeatInterval)
        }
      }, 30000)

      // Handle client disconnect
      return () => {
        abortController.abort()
        clearInterval(interval)
        clearInterval(heartbeatInterval)
        logger.log('SSE connection cleaned up')
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
