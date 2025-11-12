"use client"

import { useMemo, useState, useRef, useCallback, useEffect } from "react"
import { Vehicle } from "@/lib/query-hooks/use-vehicle-stream"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Truck, Car, Bus, ChevronLeft, MapPin } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import { useMap } from "@vis.gl/react-google-maps"

interface VehicleListProps {
  vehicles: Vehicle[]
  selectedVehicleId: string | null
  onVehicleSelect: (vehicleId: string) => void
}

const VehicleIcon = ({ type }: { type: Vehicle["type"] }) => {
  const icons = {
    sedan: Car,
    truck: Truck,
    bus: Bus,
    van: Car,
  }
  const Icon = icons[type] || Car
  return <Icon className="w-4 h-4" />
}

const StatusBadge = ({ status }: { status: Vehicle["status"] }) => {
  const variants = {
    active: "bg-green-500",
    idle: "bg-yellow-500",
    maintenance: "bg-yellow-500",
  }

  const labels = {
    active: "Active",
    idle: "Idle",
    maintenance: "idle",
  }

  return (
    <Badge
      className={cn(
        "text-white text-[11px] leading-3 rounded-[4px] font-[400]",
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
  const [searchTerm, setSearchTerm] = useState("")
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
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [calculateHeight])

  return (
    <div
      className={cn(
        "w-[25%] border-r bg-white h-full transition-all duration-300",
        isCollapsed && "w-0",
      )}
    >
      <div ref={containerRef} className={"h-full relative"}>
        <div
          onClick={() => {
            setIsCollapsed((old) => !old)
          }}
          className="hover:bg-[#f5f9fd] absolute w-5 h-8 top-1/2 right-0 translate-x-5 z-50 -translate-y-5 bg-white border-[1px_1px_1px_0px] cursor-pointer"
        >
          <ChevronLeft
            className={cn(
              "absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-all duration-300 text-gray-500/90",
              isCollapsed && "rotate-180",
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
            height: scrollAreaHeight > 0 ? `${scrollAreaHeight - 10}px` : "0px",
          }}
        >
          <div className="p-4 space-y-4">
            {filteredVehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className={cn(
                  "px-4 py-3 cursor-pointer transition-all hover:shadow-md gap-y-0",
                  selectedVehicleId === vehicle.id &&
                    "ring-2 ring-blue-500 bg-blue-50",
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
                    {`Driver: ${vehicle.driver}`}
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
                    {/* <MapPin size={14} /> */}
                    <div>
                      <div>{`Location: ${vehicle.address}`}</div>
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
                  Last updated:{" "}
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
