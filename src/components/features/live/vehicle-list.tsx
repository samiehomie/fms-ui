'use client'

import { useMemo, useState, useRef, useCallback, useEffect } from 'react'
import { Vehicle } from '@/lib/queries/useVehicleStream'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Search, Truck, Car, Bus, ChevronLeft, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMap } from '@vis.gl/react-google-maps'

const Excavator = () => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 16 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>159</title>

      <defs></defs>
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="#434343">
          <path d="M14.858,12.071 L5.141,12.071 C4.531,12.071 4.039,12.652 4.039,13.371 L4.039,14.67 C4.039,15.388 4.53,15.969 5.141,15.969 L14.858,15.969 C15.466,15.969 15.959,15.388 15.959,14.67 L15.959,13.371 C15.959,12.652 15.467,12.071 14.858,12.071 L14.858,12.071 Z M6.979,15.105 C6.364,15.105 5.864,14.599 5.864,13.974 C5.864,13.347 6.364,12.842 6.979,12.842 C7.592,12.842 8.092,13.347 8.092,13.974 C8.092,14.6 7.592,15.105 6.979,15.105 L6.979,15.105 Z M9.986,15.094 C9.392,15.094 8.91,14.611 8.91,14.014 C8.91,13.417 9.392,12.933 9.986,12.933 C10.579,12.933 11.062,13.417 11.062,14.014 C11.062,14.611 10.579,15.094 9.986,15.094 L9.986,15.094 Z M13.031,15.126 C12.4,15.126 11.886,14.631 11.886,14.018 C11.886,13.403 12.4,12.907 13.031,12.907 C13.662,12.907 14.176,13.403 14.176,14.018 C14.176,14.631 13.662,15.126 13.031,15.126 L13.031,15.126 Z"></path>
          <path d="M11.978,8.021 L11.999,6.007 L7.417,6.007 L6.584,3.91 L6.58,3.898 L6.575,3.9 L3.989,1.204 L4.337,0.304 L3.473,-0.032 L1.215,6.251 C0.11,6.873 -0.31,8.272 0.279,9.402 C0.879,10.548 2.582,11.328 3.719,10.717 C4.6,10.245 3.199,7.312 2.13,6.448 L3.619,2.162 L5.781,4.417 L7.062,9.002 C7.062,9.002 7.062,8.391 7.062,9.998 C7.062,11.605 8.093,10.942 8.093,10.942 L14.124,10.942 C14.124,10.942 14.968,11.332 14.968,9.935 L14.968,8.716 C14.968,7.849 14.03,8.008 14.03,8.008 L11.978,8.021 L11.978,8.021 Z M11.031,10.062 L7.937,10.062 L7.937,6.937 L11.031,6.937 L11.031,10.062 L11.031,10.062 Z"></path>
        </g>
      </g>
    </svg>
  )
}

interface VehicleListProps {
  vehicles: Vehicle[]
  selectedVehicleId: string | null
  onVehicleSelect: (vehicleId: string) => void
}

const VehicleIcon = ({ type }: { type: Vehicle['type'] }) => {
  const icons = {
    sedan: Car,
    truck: Truck,
    bus: Bus,
    van: Car,
  }
  const Icon = icons[type] || Car
  return <Icon className="w-4 h-4" />
}

const StatusBadge = ({ status }: { status: Vehicle['status'] }) => {
  const variants = {
    active: 'bg-green-500',
    idle: 'bg-yellow-500',
    maintenance: 'bg-yellow-500',
  }

  const labels = {
    active: 'Active',
    idle: 'Idle',
    maintenance: 'idle',
  }

  return (
    <Badge
      className={cn(
        'text-white text-[11px] leading-3 rounded-[4px] font-[400]',
        variants[status],
      )}
    >
      {labels[status]}
    </Badge>
  )
}

export default function VehicleList({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
}: VehicleListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(null)
  const map = useMap()

  const moveToVehicle = (lat: number, lng: number) => {
    if (map) {
      map.panTo({ lat, lng })
      map.setZoom(17)
    }
  }

  const calculateHeight = useCallback(() => {
    if (!containerRef.current) return

    // 이전 RAF 취소
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    // RAF로 다음 프레임에 실행
    rafRef.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight
        const availableHeight = containerHeight - 101

        // 최소값 체크
        const newHeight = Math.max(0, availableHeight)

        // 실제 변화가 있을 때만 업데이트
        setScrollAreaHeight((prev) => (prev !== newHeight ? newHeight : prev))
      }
    })
  }, [])

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return vehicles

    const term = searchTerm.toLowerCase()
    return vehicles.filter(
      (vehicle) =>
        vehicle.name.toLowerCase().includes(term) ||
        vehicle.driver.toLowerCase().includes(term) ||
        vehicle.type.toLowerCase().includes(term),
    )
  }, [vehicles, searchTerm])

  // 1. ResizeObserver로 크기 변화 감지 (가장 정확)
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      calculateHeight()
    })

    // 두 요소 모두 관찰
    resizeObserver.observe(containerRef.current)

    // 초기 계산
    calculateHeight()

    return () => {
      resizeObserver.disconnect()
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [calculateHeight])

  // 2. 윈도우 리사이즈 처리
  useEffect(() => {
    const handleResize = () => calculateHeight()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateHeight])

  return (
    <div
      className={cn(
        'w-[25%] border-r bg-white h-full transition-all duration-300',
        isCollapsed && 'w-0',
      )}
    >
      <div ref={containerRef} className={'h-full relative'}>
        <div
          onClick={() => {
            setIsCollapsed((old) => !old)
          }}
          className="hover:bg-[#f5f9fd] absolute w-5 h-8 top-1/2 right-0 translate-x-5 z-50 -translate-y-5 bg-white border-[1px_1px_1px_0px] cursor-pointer"
        >
          <ChevronLeft
            className={cn(
              'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-all duration-300 text-gray-500/90',
              isCollapsed && 'rotate-180',
            )}
          />
        </div>
        <div className="px-5 pt-6 pb-[1.25rem] h-[101px] border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search vehicle name, driver..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-xs mt-2 text-gray-600 ml-1 leading-none flex justify-end">
            {filteredVehicles.length} / {vehicles.length} vehicles
          </div>
        </div>

        <ScrollArea
          // className="h-[calc(100%-129px)] overflow-hidden"
          style={{
            height: scrollAreaHeight > 0 ? `${scrollAreaHeight - 10}px` : '0px',
          }}
        >
          <div className="p-4 space-y-4">
            {filteredVehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className={cn(
                  'px-4 py-3 cursor-pointer transition-all hover:shadow-md gap-y-0',
                  selectedVehicleId === vehicle.id &&
                    'ring-2 ring-blue-500 bg-blue-50',
                )}
                onClick={() => {
                  moveToVehicle(vehicle.lat, vehicle.lng)
                  onVehicleSelect(vehicle.id)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="font-medium text-sm">{vehicle.name}</div>
                  <StatusBadge status={vehicle.status} />
                </div>

                <div className="flex items-center justify-between gap-2 text-sm mt-3">
                  <div className="text-gray-500/90 text-xs flex items-center gap-x-2">
                    <Car size={16} />
                    {`${vehicle.driver}`}
                  </div>

                  {/* <div>
                    <span className="text-gray-500">speed:</span>
                    <span className="ml-1 font-medium">
                      {vehicle.speed}km/h
                    </span>
                  </div> */}
                </div>
                <div className="flex items-center justify-between gap-2 text-sm mt-[6px]">
                  <div className="text-gray-500/90 text-xs flex items-start gap-x-2">
                    <MapPin size={14} />
                    <div>
                      <div>{vehicle.address}</div>
                      {/* <div>{`(35.840305, -115.270782)`}</div> */}
                    </div>
                  </div>

                  {/* <div>
                    <span className="text-gray-500">speed:</span>
                    <span className="ml-1 font-medium">
                      {vehicle.speed}km/h
                    </span>
                  </div> */}
                </div>

                <div className="text-[11.5px] text-gray-400/90  mt-4 flex justify-end">
                  Last updated:{' '}
                  {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
