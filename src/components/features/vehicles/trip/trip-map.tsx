"use client"

import { Fragment } from "react"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet-defaulticon-compatibility"

import MarkerClusterGroup from "react-leaflet-markercluster"
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
  Tooltip,
  ZoomControl,
} from "react-leaflet"
import type { LatLngExpression, Marker as LeafletMarker } from "leaflet"
import L from "leaflet"
import { useEffect, useRef, useState } from "react"
import { useTripGpsDetailsBatch } from "@/lib/query-hooks/use-vehicles"
import type { TripGpsDetailsResponse } from "@/types/features/trips/trip.types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TripMapProps {
  selectedIds: number[]
}

const MapUpdater = ({
  selectedIds,
  trips,
}: {
  selectedIds: number[]
  trips: Record<number, TripGpsDetailsResponse>
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

  let label = `${tripNumbers.slice(0, 3).join(", ")}`
  if (tripNumbers.length > 3) {
    label += ` (+${tripNumbers.length - 3})`
  }

  const size = 25 * Math.min(tripNumbers.length, 4)
  return L.divIcon({
    html: `<div>${label}</div>`,
    className: "trip-cluster-label",
    iconSize: [size, 25],
    iconAnchor: [-10, 10],
  })
}

const createCircleIcon = (color: string) => {
  return L.divIcon({
    html: `<span class="flex h-[1.125rem] w-[1.125rem] rounded-full border-2 border-white ${color} shadow-md"></span>`,
    className: "bg-transparent border-transparent",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

type MapStyle = "street" | "satellite"

const MAP_STYLES = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
}

export default function TripMap({ selectedIds }: TripMapProps) {
  const [mapStyle, setMapStyle] = useState<MapStyle>("satellite")
  const { data: tripDetailsMap, isLoading } =
    useTripGpsDetailsBatch(selectedIds)

  const startIcon = createCircleIcon("bg-[#005EAE]")
  const endIcon = createCircleIcon("bg-[#a5abbd]")

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
    <div className="relative flex flex-col flex-1 w-full">
      <div className="absolute right-4 top-4 z-[1000] flex gap-[6px] text-xs">
        <Button
          variant={"secondary"}
          size="sm"
          className={cn(
            "text-xs leading-none h-[23px] border-none rounded-sm hover:bg-[#424656]/80 hover:text-white font-light w-14",
            mapStyle === "satellite" && "bg-[#424656] border-none text-white",
          )}
          onClick={() => setMapStyle("satellite")}
        >
          Satellite
        </Button>
        <Button
          variant={"secondary"}
          size="sm"
          className={cn(
            "text-xs border-none leading-none h-[23px] rounded-sm hover:bg-[#424656]/80 hover:text-white font-light w-14",
            mapStyle === "street" && "bg-[#424656] border-none text-white",
          )}
          onClick={() => setMapStyle("street")}
        >
          Street
        </Button>
      </div>
      <MapContainer
        center={[37.5665, 126.978]} // Default center (Seoul)
        zoom={8}
        scrollWheelZoom={true}
        className="h-full w-full flex-1"
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution={MAP_STYLES[mapStyle].attribution}
          url={MAP_STYLES[mapStyle].url}
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
                    color: "#005EAE",
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
                    {"end test"}
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
    </div>
  )
}
