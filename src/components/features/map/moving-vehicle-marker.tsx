'use client'

import { useEffect, useRef } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-rotatedmarker'

interface Vehicle {
  id: number
  plate_number: string
  lat: number
  lng: number
  heading: number
}

const vehicleIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-blue-600 drop-shadow-lg"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>`,
  className: 'bg-transparent border-0',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

export const MovingVehicleMarker = ({ vehicle }: { vehicle: Vehicle }) => {
  const markerRef = useRef<L.Marker | null>(null)
  const prevPos = useRef([vehicle.lat, vehicle.lng])

  useEffect(() => {
    const marker = markerRef.current
    if (marker) {
      const newLatLng = L.latLng(vehicle.lat, vehicle.lng)
      // Smooth animation using requestAnimationFrame
      const startPos = L.latLng(prevPos.current[0], prevPos.current[1])
      const start = performance.now()
      const duration = 1000 // Corresponds to server update interval

      const animate = (time: number) => {
        const progress = Math.min((time - start) / duration, 1)
        const lat = startPos.lat + (newLatLng.lat - startPos.lat) * progress
        const lng = startPos.lng + (newLatLng.lng - startPos.lng) * progress
        marker.setLatLng([lat, lng])

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          prevPos.current = [vehicle.lat, vehicle.lng]
        }
      }
      requestAnimationFrame(animate)
      // Update rotation
      if ((marker as any).setRotationAngle) {
        (marker as any).setRotationAngle(vehicle.heading)
      }
    }
  }, [vehicle.lat, vehicle.lng, vehicle.heading])

  return (
    <Marker
      ref={markerRef}
      position={[vehicle.lat, vehicle.lng]}
      icon={vehicleIcon}
    >
      <Popup>
        <b>{vehicle.plate_number}</b>
        <br />
        ID: {vehicle.id}
      </Popup>
    </Marker>
  )
}
