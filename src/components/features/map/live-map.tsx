'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
// import 'react-leaflet-markercluster/dist/styles.min.css'

import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import L from 'leaflet'
import { useEffect } from 'react'
import { MovingVehicleMarker } from './moving-vehicle-marker'

interface Vehicle {
  id: number
  plate_number: string
  lat: number
  lng: number
  heading: number
}

interface LiveMapProps {
  vehicles: Vehicle[]
  selectedVehicleId: number | null
}

const MapController = ({
  selectedVehicle,
}: {
  selectedVehicle: Vehicle | null
}) => {
  const map = useMap()
  useEffect(() => {
    if (selectedVehicle) {
      map.flyTo([selectedVehicle.lat, selectedVehicle.lng], 16, {
        animate: true,
        duration: 1,
      })
    }
  }, [selectedVehicle, map])
  return null
}

export function LiveMap({ vehicles, selectedVehicleId }: LiveMapProps) {
  const selectedVehicle =
    vehicles.find((v) => v.id === selectedVehicleId) || null

  const createClusterIcon = (cluster: any) => {
    return L.divIcon({
      html: `<span>${cluster.getChildCount()}</span>`,
      className:
        'bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm border-2 border-white shadow-lg',
      iconSize: L.point(32, 32, true),
    })
  }

  return (
    <MapContainer center={[37.505, 127.05]} zoom={14} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        iconCreateFunction={createClusterIcon}
        spiderfyOnMaxZoom={true}
      >
        {vehicles.map((vehicle) => (
          <MovingVehicleMarker key={vehicle.id} vehicle={vehicle} />
        ))}
      </MarkerClusterGroup>
      <MapController selectedVehicle={selectedVehicle} />
    </MapContainer>
  )
}
