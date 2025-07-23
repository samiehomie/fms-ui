'use client'

import React from 'react'
import { Map } from '@vis.gl/react-google-maps'
import { mapId } from '@/constants/map'
import VehicleMarkers, { VehicleMapProps } from './vehicle-markers'

export default function VehicleMapWrapper(props: VehicleMapProps) {
  return (
    <Map
      defaultCenter={{ lat: 37.5665, lng: 126.978 }}
      defaultZoom={12}
      mapId={mapId}
      gestureHandling={'greedy'}
      disableDefaultUI={false}
      fullscreenControl={false}
      streetViewControl={false}
      mapTypeControl={false}
      controlSize={0}
      disableDoubleClickZoom={true}
      clickableIcons={false}
    >
      <VehicleMarkers {...props} />
    </Map>
  )
}
