import { haversineDistance } from '@/lib/api/geocoding'

// Mock vehicle data type
interface Vehicle {
  id: number
  plate_number: string
  lat: number
  lng: number
  heading: number // direction in degrees
}

// Mock database/cache for vehicle positions
const vehicleStore = new Map<number, Vehicle>()

// Initialize mock vehicles
function initializeVehicles() {
  if (vehicleStore.size > 0) return
  const initialVehicles: Vehicle[] = [
    { id: 1, plate_number: '12가 3456', lat: 37.505, lng: 127.05, heading: 45 },
    {
      id: 2,
      plate_number: '34나 5678',
      lat: 37.506,
      lng: 127.051,
      heading: 120,
    },
    {
      id: 3,
      plate_number: '56다 7890',
      lat: 37.504,
      lng: 127.049,
      heading: 270,
    },
    {
      id: 4,
      plate_number: '78라 1234',
      lat: 37.5055,
      lng: 127.052,
      heading: 310,
    },
    {
      id: 5,
      plate_number: '90마 5678',
      lat: 37.5045,
      lng: 127.0495,
      heading: 180,
    },
  ]
  initialVehicles.forEach((v) => vehicleStore.set(v.id, v))
}

// Simulate fetching data and vehicle movement
function simulateVehicleUpdates(): Vehicle[] {
  const updatedVehicles: Vehicle[] = []
  vehicleStore.forEach((vehicle) => {
    const newHeading = (vehicle.heading + (Math.random() - 0.5) * 10) % 360
    const speed = 0.0001 // simulation speed
    const newLat = vehicle.lat + speed * Math.cos((newHeading * Math.PI) / 180)
    const newLng = vehicle.lng + speed * Math.sin((newHeading * Math.PI) / 180)

    const updatedVehicle = {
      ...vehicle,
      lat: newLat,
      lng: newLng,
      heading: newHeading,
    }
    vehicleStore.set(vehicle.id, updatedVehicle)
    updatedVehicles.push(updatedVehicle)
  })
  return updatedVehicles
}

export async function GET(request: Request) {
  initializeVehicles()
  const lastPositions = new Map<number, { lat: number; lng: number }>()

  const stream = new ReadableStream({
    start(controller) {
      const intervalId = setInterval(() => {
        // 1. Simulate fetching from external API
        const allVehicles = simulateVehicleUpdates()

        // 2. Filter vehicles that moved more than 5 meters (Distance-based filtering)
        const significantUpdates = allVehicles.filter((vehicle) => {
          const lastPos = lastPositions.get(vehicle.id)
          if (!lastPos) {
            return true // Always send first update
          }
          const distance = haversineDistance(
            lastPos.lat,
            lastPos.lng,
            vehicle.lat,
            vehicle.lng,
          )
          return distance > 5
        })

        // 3. If there are significant updates, batch them and send
        if (significantUpdates.length > 0) {
          significantUpdates.forEach((v) =>
            lastPositions.set(v.id, { lat: v.lat, lng: v.lng }),
          )
          const data = `data: ${JSON.stringify(significantUpdates)}\n\n`
          controller.enqueue(new TextEncoder().encode(data))
        }
      }, 1000) // Data batching every 1 second

      // Cleanup on client disconnect
      if (request.signal) {
        request.signal.addEventListener('abort', () => {
          clearInterval(intervalId)
          controller.close()
        })
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
