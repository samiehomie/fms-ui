'use client'

import React, { useEffect } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps'
import { Vehicle } from '@/lib/hooks/queries/useVehicleStream'

interface VehicleMapProps {
  vehicles: Vehicle[]
  selectedVehicleId: string | null
  onVehicleClick: (vehicleId: string) => void
}

// 차량 타입별 마커 색상
const getMarkerColor = (type: Vehicle['type'], status: Vehicle['status']) => {
  if (status === 'maintenance') return '#6B7280' // gray

  const colors = {
    sedan: '#3B82F6', // blue
    truck: '#EF4444', // red
    bus: '#10B981', // green
    van: '#F59E0B', // yellow
  }
  return colors[type] || '#3B82F6'
}

const VehicleMarker: React.FC<{
  vehicle: Vehicle
  isSelected: boolean
  onVehicleClick: (vehicleId: string) => void
}> = ({ vehicle, isSelected, onVehicleClick }) => {
  const color = getMarkerColor(vehicle.type, vehicle.status)

  const markerContent = (
    <div
      style={{
        width: isSelected ? 50 : 40,
        height: isSelected ? 50 : 40,
        cursor: 'pointer',
        transform: `rotate(${vehicle.heading}deg)`,
      }}
      onClick={() => onVehicleClick(vehicle.id)}
    >
      <svg
        viewBox="0 0 40 40"
        width={isSelected ? 50 : 40}
        height={isSelected ? 50 : 40}
      >
        <path
          d="M20 5 L30 30 L20 25 L10 30 Z"
          fill={color}
          stroke="white"
          strokeWidth="2"
        />
        {isSelected && (
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="#FF6B6B"
            strokeWidth="3"
          />
        )}
      </svg>
    </div>
  )

  return (
    <AdvancedMarker
      position={{ lat: vehicle.lat, lng: vehicle.lng }}
      title={vehicle.name}
      zIndex={isSelected ? 1000 : 1}
    >
      {markerContent}
    </AdvancedMarker>
  )
}

const VehicleMap: React.FC<VehicleMapProps> = ({
  vehicles,
  selectedVehicleId,
  onVehicleClick,
}) => {
  const map = useMap()

  // 선택된 차량으로 맵 이동
  useEffect(() => {
    if (!map || !selectedVehicleId) return

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)
    if (selectedVehicle) {
      map.panTo({ lat: selectedVehicle.lat, lng: selectedVehicle.lng })
      map.setZoom(16)
    }
  }, [map, selectedVehicleId, vehicles])

  return (
    <>
      {vehicles.map((vehicle) => (
        <VehicleMarker
          key={vehicle.id}
          vehicle={vehicle}
          isSelected={vehicle.id === selectedVehicleId}
          onVehicleClick={onVehicleClick}
        />
      ))}
    </>
  )
}

export default function VehicleMapWrapper(props: VehicleMapProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        defaultCenter={{ lat: 37.5665, lng: 126.978 }}
        defaultZoom={12}
        mapId="VEHICLE_TRACKING_MAP"
        gestureHandling="greedy"
        disableDefaultUI={false}
        clickableIcons={false}
      >
        <VehicleMap {...props} />
      </Map>
    </APIProvider>
  )
}
