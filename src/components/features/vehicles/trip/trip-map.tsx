'use client'

import { Fragment } from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'

import MarkerClusterGroup from 'react-leaflet-markercluster'
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
  Tooltip,
} from 'react-leaflet'
import type { LatLngExpression, Marker as LeafletMarker } from 'leaflet'
import L from 'leaflet'
import { useEffect, useRef } from 'react'
import type { TripSession } from './trip-content'
import { useVehicleTripDetailsBatch } from '@/lib/hooks/queries/useVehicles'
import { logger } from '@/lib/utils'
import type { VehicleTripsByTripIdResponse } from '@/types/api/vehicle.types'

interface TripMapProps {
  selectedIds: number[]
  hoveredId: number | null
}

const MapUpdater = ({
  sessionsToDisplay,
  trips,
}: {
  sessionsToDisplay: number[]
  trips: Record<number, VehicleTripsByTripIdResponse>
}) => {
  const map = useMap()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (sessionsToDisplay.length > 0) {
      const allPoints = sessionsToDisplay
        .map((id) => {
          const trip = trips[id]?.trip.gpss.map((gps) => ({
            lat: parseFloat(gps.latitude),
            lng: parseFloat(gps.longitude),
          }))
          return trip
        })
        .flat()
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints as LatLngExpression[])
        map.fitBounds(bounds, {
          padding: [50, 50],
          animate: !isInitialLoad.current,
        })
        if (isInitialLoad.current) {
          isInitialLoad.current = false
        }
      }
    }
  }, [sessionsToDisplay, map])

  return null
}

const createClusterCustomIcon = (cluster: any) => {
  const childMarkers = cluster.getAllChildMarkers() as LeafletMarker[]

  const tripNumbers = childMarkers
    .map((marker) => {
      try {
        const element = marker.getElement()
        const tripId = element?.getAttribute('data-trip-id')
        return tripId
      } catch (error) {
        console.warn('Error reading trip ID from marker:', error)
        return null
      }
    })
    .filter((id): id is string => id !== null && id !== undefined)

  if (tripNumbers.length === 0) {
    return L.divIcon({
      html: `<div class="trip-cluster-label">Trips</div>`,
      iconSize: [60, 30],
    })
  }

  let label = `Trips #${tripNumbers.slice(0, 2).join(', ')}`
  if (tripNumbers.length > 2) {
    label += `, ... (+${tripNumbers.length - 2})`
  }

  const size = Math.max(90, 30 + tripNumbers.length * 2) // 최소 크기 보장
  return L.divIcon({
    html: `<div class="trip-cluster-label">${label}</div>`,
    iconSize: [size, 30],
    iconAnchor: [size / 2, 15],
  })
}

const createCircleIcon = (color: string) => {
  return L.divIcon({
    html: `<span class="flex h-[1.125rem] w-[1.125rem] rounded-full border-2 border-white ${color} shadow-md"></span>`,
    className: 'bg-transparent border-transparent',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

export default function TripMap({ selectedIds, hoveredId }: TripMapProps) {
  const { data: tripDetailsMap, isLoading } =
    useVehicleTripDetailsBatch(selectedIds)

  const sessionsToDisplay = hoveredId
    ? selectedIds.filter((s) => s === hoveredId)
    : selectedIds

  const startIcon = createCircleIcon('bg-[#005EAE]')
  const endIcon = createCircleIcon('bg-[#a5abbd]')

  if (selectedIds.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p>Select a trip to display on the map.</p>
      </div>
    )
  }

  if (isLoading) return <div>loading..</div>
  if (!tripDetailsMap) return null

  logger.log(
    'map',
    tripDetailsMap,
    'selected Ids',
    sessionsToDisplay,
    selectedIds,
  )

  return (
    <MapContainer
      center={[37.5665, 126.978]} // Default center (Seoul)
      zoom={8}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {sessionsToDisplay.map((id) => {
        const path = tripDetailsMap[id].trip.gpss.map((gps) => ({
          lat: parseFloat(gps.latitude),
          lng: parseFloat(gps.longitude),
        }))
        return (
          <Fragment key={`path-and-end-${id}}`}>
            <Polyline
              positions={path as LatLngExpression[]}
              pathOptions={{
                color: '#005EAE',
                weight: 5,
              }}
            />
            <Marker
              position={path[path.length - 1] as LatLngExpression}
              icon={endIcon}
              eventHandlers={{
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
              }}
            >
              <Popup>
                <div className="font-semibold">End</div>
                {'end test'}
              </Popup>
            </Marker>
          </Fragment>
        )
      })}
      <MarkerClusterGroup
        iconCreateFunction={createClusterCustomIcon}
        showCoverageOnHover={false}
      >
        {sessionsToDisplay.map((id) => {
          const startPosition = {
            lat: parseFloat(tripDetailsMap[id].trip.gpss[0].latitude),
            lng: parseFloat(tripDetailsMap[id].trip.gpss[0].longitude),
          }
          return (
            <Marker
              key={`trip-${id}`}
              data-trip-id={id}
              position={startPosition}
              icon={startIcon}
              eventHandlers={{
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
              }}
            >
              <Popup>
                <div className="font-semibold">Start</div>
                {id}
              </Popup>
              <Tooltip
                permanent
                direction="right"
                offset={[12, -5]}
                className="trip-label"
              >
                {id}
              </Tooltip>
            </Marker>
          )
        })}
      </MarkerClusterGroup>
      <MapUpdater
        sessionsToDisplay={sessionsToDisplay}
        trips={tripDetailsMap}
      />
    </MapContainer>
  )
}
