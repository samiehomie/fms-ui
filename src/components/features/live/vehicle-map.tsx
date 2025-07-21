'use client'

import React, { useEffect, useRef } from 'react'
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps'
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from '@googlemaps/markerclusterer'
import { Vehicle } from '@/lib/hooks/queries/useVehicleStream'
import { mapId } from '@/constants/map'

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

// 클러스터 렌더러
class ClusterRenderer {
  render({ count, position }: { count: number; position: google.maps.LatLng }) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
        <circle cx="30" cy="30" r="25" fill="#4285F4" opacity="0.9"/>
        <circle cx="30" cy="30" r="20" fill="#FFFFFF" opacity="0.3"/>
        <text x="30" y="35" text-anchor="middle" fill="white" font-size="16" font-weight="bold">${count}</text>
      </svg>
    `

    const div = document.createElement('div')
    div.innerHTML = svg
    div.style.position = 'absolute'
    div.style.transform = 'translate(-50%, -50%)'
    div.style.cursor = 'pointer'

    return new google.maps.marker.AdvancedMarkerElement({
      position,
      content: div,
      zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
    })
  }
}

// 차량 마커들을 관리하는 컴포넌트
const VehicleMarkers: React.FC<VehicleMapProps> = ({
  vehicles,
  selectedVehicleId,
  onVehicleClick,
}) => {
  const map = useMap()
  const markerLibrary = useMapsLibrary('marker')
  const clustererRef = useRef<MarkerClusterer | null>(null)
  const markersRef = useRef<{
    [key: string]: google.maps.marker.AdvancedMarkerElement
  }>({})

  // 마커 생성 함수 (메모이제이션으로 최적화)
  const createMarker = React.useCallback(
    (vehicle: Vehicle): google.maps.marker.AdvancedMarkerElement | null => {
      if (!markerLibrary) return null

      const isSelected = vehicle.id === selectedVehicleId
      const color = getMarkerColor(vehicle.type, vehicle.status)

      const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${
        isSelected ? 50 : 40
      }" height="${isSelected ? 50 : 40}">
        <g transform="rotate(${vehicle.heading} 20 20)">
          <path d="M20 5 L30 30 L20 25 L10 30 Z" fill="${color}" stroke="white" stroke-width="2"/>
        </g>
        ${
          isSelected
            ? '<circle cx="20" cy="20" r="18" fill="none" stroke="#FF6B6B" stroke-width="3"/>'
            : ''
        }
      </svg>
    `

      const div = document.createElement('div')
      div.innerHTML = svg
      div.style.cursor = 'pointer'
      div.style.position = 'absolute'
      div.style.transform = 'translate(-50%, -50%)'

      // 이벤트 리스너는 한 번만 추가
      const handleClick = () => onVehicleClick(vehicle.id)
      div.addEventListener('click', handleClick)

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: vehicle.lat, lng: vehicle.lng },
        content: div,
        title: vehicle.name,
        zIndex: isSelected ? 1000 : 1,
      })

      // 클린업을 위해 참조 저장
      ;(marker as any)._cleanup = () => {
        div.removeEventListener('click', handleClick)
      }

      return marker
    },
    [markerLibrary, selectedVehicleId, onVehicleClick],
  )

  // 클러스터러 초기화
  useEffect(() => {
    if (!map || !markerLibrary) return

    // 클러스터러가 없으면 생성
    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({
        map,
        markers: [],
        renderer: new ClusterRenderer(),
        algorithm: new SuperClusterAlgorithm({
          radius: 80, // 클러스터 반경 (픽셀)
          maxZoom: 15, // 이 줌 레벨 이상에서는 클러스터링 안함
          minPoints: 3, // 최소 3개 이상 모여야 클러스터 생성
        }),
        onClusterClick: (event, cluster, map) => {
          if (cluster.bounds) {
            map.fitBounds(cluster.bounds)
          }
        },
      })
    }

    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers()
        clustererRef.current.setMap(null)
        clustererRef.current = null
      }

      // 모든 마커 클린업
      Object.values(markersRef.current).forEach((marker) => {
        if ((marker as any)._cleanup) {
          ;(marker as any)._cleanup()
        }
        marker.map = null
      })
      markersRef.current = {}
    }
  }, [map, markerLibrary])

  // 차량 데이터가 변경될 때 마커 업데이트 (최적화)
  useEffect(() => {
    if (!map || !markerLibrary || !clustererRef.current) return

    // 기존 마커들과 새 차량 데이터 비교
    const currentMarkerIds = new Set(Object.keys(markersRef.current))
    const newVehicleIds = new Set(vehicles.map((v) => v.id))

    // 제거된 차량의 마커 삭제
    currentMarkerIds.forEach((id) => {
      if (!newVehicleIds.has(id)) {
        const marker = markersRef.current[id]
        if (marker) {
          if ((marker as any)._cleanup) {
            ;(marker as any)._cleanup()
          }
          marker.map = null
          delete markersRef.current[id]
        }
      }
    })

    // 새 차량이나 업데이트된 차량의 마커 생성/업데이트
    const markersToAdd: google.maps.marker.AdvancedMarkerElement[] = []

    vehicles.forEach((vehicle) => {
      const existingMarker = markersRef.current[vehicle.id]
      const isSelected = vehicle.id === selectedVehicleId

      // 기존 마커가 있고 선택 상태가 변경되지 않았다면 위치만 업데이트
      if (existingMarker && existingMarker.zIndex === (isSelected ? 1000 : 1)) {
        existingMarker.position = { lat: vehicle.lat, lng: vehicle.lng }
        return
      }

      // 기존 마커 제거 (선택 상태 변경 시)
      if (existingMarker) {
        if ((existingMarker as any)._cleanup) {
          ;(existingMarker as any)._cleanup()
        }
        existingMarker.map = null
        delete markersRef.current[vehicle.id]
      }

      // 새 마커 생성
      const marker = createMarker(vehicle)
      if (marker) {
        markersRef.current[vehicle.id] = marker
        markersToAdd.push(marker)
      }
    })

    // 변경된 마커들만 클러스터러에 추가
    if (markersToAdd.length > 0) {
      clustererRef.current.clearMarkers()
      clustererRef.current.addMarkers(Object.values(markersRef.current))
    }
  }, [vehicles, selectedVehicleId, map, markerLibrary, onVehicleClick])

  // 선택된 차량으로 한 번만 이동 (추적하지 않음)
  useEffect(() => {
    if (!map || !selectedVehicleId) return

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)
    if (selectedVehicle) {
      // 한 번만 이동하고 추적하지 않음
      map.panTo({ lat: selectedVehicle.lat, lng: selectedVehicle.lng })
      map.setZoom(16)
    }
  }, [map, selectedVehicleId]) // vehicles 의존성 제거로 추적 방지

  return null
}

export default function VehicleMapWrapper(props: VehicleMapProps) {
  logger.log('test')
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={['marker']}
    >
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
    </APIProvider>
  )
}
