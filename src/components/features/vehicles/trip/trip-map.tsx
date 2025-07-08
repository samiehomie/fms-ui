'use client'

import { Fragment} from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import { useEffect, useRef } from 'react'
import type { TripSession } from './types'

interface TripMapProps {
  sessions: TripSession[]
  hoveredId: string | null
}

const MapUpdater = ({
  sessionsToDisplay,
}: {
  sessionsToDisplay: TripSession[]
}) => {
  const map = useMap()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (sessionsToDisplay.length > 0) {
      const allPoints = sessionsToDisplay.flatMap((s) => s.path)
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

export default function TripMap({ sessions, hoveredId }: TripMapProps) {
  const sessionsToDisplay = hoveredId
    ? sessions.filter((s) => s.id === hoveredId)
    : sessions

  if (sessions.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p>Select a trip to display on the map.</p>
      </div>
    )
  }

  return (
    <MapContainer
      center={[37.5665, 126.978]} // Default center (Seoul)
      zoom={10}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {sessionsToDisplay.map((session, index) => (
        <Polyline
          key={session.id}
          positions={session.path as LatLngExpression[]}
          pathOptions={{
            color: 'blue',
            weight: 5,
          }}
        />
      ))}

      {sessionsToDisplay.map((session, index) => (
        <Fragment key={index}>
          <Marker
            key={`start-${session.id}`}
            position={session.path[0] as LatLngExpression}
          >
            <Popup>Start: {session.startLocation}</Popup>
          </Marker>
          <Marker
            key={`end-${session.id}`}
            position={session.path[session.path.length - 1] as LatLngExpression}
          >
            <Popup>End: {session.endLocation}</Popup>
          </Marker>
        </Fragment>
      ))}

      <MapUpdater sessionsToDisplay={sessionsToDisplay} />
    </MapContainer>
  )
}
