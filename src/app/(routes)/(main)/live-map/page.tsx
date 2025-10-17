'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useVehicleStream } from '@/lib/query-hooks/useVehicleStream'
import VehicleList from '@/components/features/live/vehicle-list'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Loader2, WifiOff } from 'lucide-react'
import { APIProvider } from '@vis.gl/react-google-maps'
import { useClickOutside } from '@/hooks/use-clickoutside'

// 클라이언트 사이드에서만 렌더링
const VehicleMap = dynamic(
  () => import('@/components/features/live/vehicle-map'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    ),
  },
)

export default function VehicleTrackingContent() {
  const { vehicles, isConnected, error, reconnect } = useVehicleStream()
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  )

  // 마커 컨테이너 외부 클릭 시 선택 해제
  const mapContainerRef = useClickOutside<HTMLDivElement>(
    () => {
      setSelectedVehicleId(null)
    },
    selectedVehicleId !== null, // 마커가 선택된 상태에서만 활성화
  )

  return (
    <div className="flex-1 flex flex-col lg:-mx-6 -mt-5" ref={mapContainerRef}>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={['marker']}
      >
        <div className="flex-1 flex">
          {/* 좌측 차량 목록 (30%) */}

          <VehicleList
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onVehicleSelect={setSelectedVehicleId}
          />

          {/* 우측 지도 (70%) */}
          <div className="flex-1 relative">
            {/* 연결 상태 표시 */}
            {!isConnected && (
              <Alert className="m-4 border-orange-200 bg-orange-50 absolute w-1/3 z-30">
                <AlertDescription className="flex items-center justify-between">
                  <div className="flex items-center gap-x-3">
                    <WifiOff className="h-4 w-4" />
                    <span>{error || 'Connecting...'}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={reconnect}
                    className="ml-4"
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            <VehicleMap
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onVehicleClick={setSelectedVehicleId}
            />
          </div>
        </div>
      </APIProvider>
    </div>
  )
}
