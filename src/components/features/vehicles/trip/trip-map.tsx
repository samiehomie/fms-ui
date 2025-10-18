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
import { useVehicleTripDetailsBatch } from '@/lib/query-hooks/useVehicles'
import type { TripDetailsResponse } from '@/types/features/trip/trip.types'

interface TripMapProps {
  selectedIds: number[]
}

const MapUpdater = ({
  selectedIds,
  trips,
}: {
  selectedIds: number[]
  trips: Record<number, TripDetailsResponse>
}) => {
  const map = useMap()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (selectedIds.length > 0) {
      const allPoints = selectedIds
        .map((id) => {
          const trip = trips[id]?.gpss.map((gps) => ({
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
  }, [selectedIds, map])

  return null
}

const createClusterCustomIcon = (cluster: any) => {
  const childMarkers = cluster.getAllChildMarkers() as (LeafletMarker & {
    options: { tripId: number }
  })[]
  const tripNumbers = childMarkers.map((marker) =>
    String(marker.options.tripId),
  )

  let label = `${tripNumbers.slice(0, 3).join(', ')}`
  if (tripNumbers.length > 3) {
    label += ` (+${tripNumbers.length - 3})`
  }

  const size = 25 * Math.min(tripNumbers.length, 4)
  return L.divIcon({
    html: `<div>${label}</div>`,
    className: 'trip-cluster-label',
    iconSize: [size, 25],
    iconAnchor: [-10, 10],
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

export default function TripMap({ selectedIds }: TripMapProps) {
  const { data: tripDetailsMap, isLoading } =
    useVehicleTripDetailsBatch(selectedIds)

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

      {selectedIds.map((id) => {
        const gpsData = tripDetailsMap[id].gpss
        if (gpsData.length === 0) {
          return <Fragment key={`trip-${id}`}></Fragment>
        } else {
          const path = gpsData.map((gps) => ({
            lat: parseFloat(gps.latitude),
            lng: parseFloat(gps.longitude),
          }))

          return (
            <Fragment key={`path-and-end-${id}}`}>
              <Polyline
                positions={path as LatLngExpression[]}
                pathOptions={{
                  color: '#005EAE',
                  weight: 3.5,
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
        }
      })}
      <MarkerClusterGroup
        iconCreateFunction={createClusterCustomIcon}
        showCoverageOnHover={false}
      >
        {selectedIds.map((id) => {
          const gpsData = tripDetailsMap[id].gpss
          if (gpsData.length === 0) {
            return <Fragment key={`trip-${id}`}></Fragment>
          } else {
            const startPosition = {
              lat: parseFloat(gpsData[0].latitude),
              lng: parseFloat(gpsData[0].longitude),
            }
            return (
              <Marker
                key={`trip-${id}`}
                // @ts-expect-error: 추가 속성
                tripId={id}
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
          }
        })}
      </MarkerClusterGroup>
      <MapUpdater selectedIds={selectedIds} trips={tripDetailsMap} />
    </MapContainer>
  )
}
