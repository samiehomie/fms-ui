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
import type { LatLngLiteral } from 'leaflet'

interface VehicleMapProps {
  vehicles: Vehicle[]
  selectedVehicleId: string | null
  onVehicleClick: (vehicleId: string) => void
}

// 차량 타입별 마커 색상
const getMarkerColor = (type: Vehicle['type'], status: Vehicle['status']) => {
  if (status === 'maintenance') return '#666666' // gray

  const colors = {
    sedan: '#0078d3', // blue
    truck: '#dc2626', // red
    bus: '#16a34a', // green
    van: '#ca8a04', // yellow
  }
  return colors[type] || '#0078d3'
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
      const markerSize = isSelected ? 44 : 36
      const labelOffset = 25

      // 차량 이름의 텍스트 길이에 따른 라벨 너비 계산
      const textLength = vehicle.name.length
      const labelWidth = Math.max(60, textLength * 8 + 16)

      // 전체 컨테이너 생성
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.cursor = 'pointer'
      container.style.transform = 'translate(-50%, -100%)'
      container.style.zIndex = isSelected ? '1000' : '1'
      container.style.transition = 'all 0.2s ease-in-out'

      // SVG 마커와 라벨을 포함하는 전체 구조
      container.innerHTML = `
        <div style="position: relative; width: ${Math.max(
          markerSize,
          labelWidth,
        )}px; height: ${markerSize + labelOffset + 30}px;">
          <!-- 라벨 -->
          <div class="vehicle-label" style="
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(255, 255, 255, 0.95);
            color: #333;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(0, 0, 0, 0.1);
            min-width: 60px;
            text-align: center;
            transition: all 0.2s ease-in-out;
            z-index: 2;
          ">${vehicle.name}</div>
          
          <!-- 연결선 -->
          <div style="
            position: absolute;
            top: 22px;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: ${labelOffset}px;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 1;
          "></div>
          
          <!-- 마커 -->
          <div class="vehicle-marker" style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            transition: all 0.2s ease-in-out;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${markerSize}" height="${markerSize}">
              <!-- 외부 원 (파란색) -->
              <circle cx="20" cy="20" r="18" fill="#0078d3" stroke="white" stroke-width="2"/>
              
              <!-- 화살표 (회전 적용) -->
              <g transform="rotate(${vehicle.heading} 20 20)">
                <path d="M20 8 L26 28 L20 24 L14 28 Z" fill="white"/>
              </g>
              
              <!-- 선택 상태 표시 -->
              ${
                isSelected
                  ? '<circle cx="20" cy="20" r="22" fill="none" stroke="#FF6B6B" stroke-width="3"/>'
                  : ''
              }
            </svg>
          </div>
        </div>
      `

      // 호버 이벤트 처리
      const markerElement = container.querySelector(
        '.vehicle-marker',
      ) as HTMLElement
      const labelElement = container.querySelector(
        '.vehicle-label',
      ) as HTMLElement

      const handleMouseEnter = () => {
        container.style.zIndex = '999'
        if (markerElement) {
          markerElement.style.transform = 'translateX(-50%) scale(1.15)'
        }
        if (labelElement) {
          labelElement.style.backgroundColor = 'rgba(255, 255, 255, 1)'
          labelElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)'
        }
      }

      const handleMouseLeave = () => {
        container.style.zIndex = isSelected ? '1000' : '1'
        if (markerElement) {
          markerElement.style.transform = 'translateX(-50%) scale(1)'
        }
        if (labelElement) {
          labelElement.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
          labelElement.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)'
        }
      }

      const handleClick = () => onVehicleClick(vehicle.id)

      // 이벤트 리스너 추가
      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)
      container.addEventListener('click', handleClick)

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: vehicle.lat, lng: vehicle.lng },
        content: container,
        title: vehicle.name,
        zIndex: isSelected ? 1000 : 1,
      })

      // 클린업을 위해 참조 저장
      ;(marker as any)._cleanup = () => {
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseLeave)
        container.removeEventListener('click', handleClick)
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

      // 기존 마커가 있고 선택 상태나 위치가 변경되지 않았다면 위치만 업데이트
      if (existingMarker && existingMarker.zIndex === (isSelected ? 1000 : 1)) {
        const currentPos = existingMarker.position as LatLngLiteral
        if (
          currentPos &&
          Math.abs(currentPos.lat - vehicle.lat) < 0.0001 &&
          Math.abs(currentPos.lng - vehicle.lng) < 0.0001
        ) {
          return // 위치 변화가 미미하면 업데이트하지 않음
        }
        existingMarker.position = { lat: vehicle.lat, lng: vehicle.lng }
        return
      }

      // 기존 마커 제거 (선택 상태 변경이나 큰 위치 변경 시)
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
