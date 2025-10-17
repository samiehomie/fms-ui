'use client'

import React from 'react'
import { Map } from '@vis.gl/react-google-maps'
import { mapId } from '@/lib/constants/map'
import VehicleMarkers, { VehicleMapProps } from './vehicle-markers'

export default function VehicleMapWrapper(props: VehicleMapProps) {
  return (
    <Map
      defaultCenter={{ lat: 35.59673, lng: 139.8169 }}
      defaultZoom={16}
      mapId={mapId}
      gestureHandling={'greedy'}
      disableDefaultUI={false}
      fullscreenControl={false}
      streetViewControl={false}
      mapTypeControl={false}
      controlSize={0}
      disableDoubleClickZoom={true}
      clickableIcons={false}
      mapTypeId={'satellite'}
    >
      <VehicleMarkers {...props} />
    </Map>
  )
}
