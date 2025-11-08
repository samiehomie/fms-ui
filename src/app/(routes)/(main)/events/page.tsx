"use client"

import { useState } from "react"
import { TripMonitor } from "@/components/features/events/trip-monitor"
import { useAllTrips } from "@/lib/query-hooks/use-vehicles"
import { TripStatus } from "@/types/enums/trip.enum"
import { Loader2 } from "lucide-react"

export default function TripDetailPage() {
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null)

  // 활성화된 trip만 조회
  const { data, isLoading, isError, error } = useAllTrips({
    status: TripStatus.ACTIVE,
  })

  const trips = data?.success ? data.data : []

  // 첫 번째 trip이 있으면 자동으로 선택
  if (selectedTripId === null && trips && trips.length > 0) {
    setSelectedTripId(trips[0].id)
  }

  return (
    <main className="min-h-screen ">
      <div className="flex gap-4 h-[calc(100vh-120px)]">
        {/* 왼쪽: Trip 목록 */}
        <div className="w-64 flex flex-col bg-white rounded-lg border p-4 overflow-hidden">
          <h2 className="text-lg font-bold mb-4">Active Trips</h2>

          {isLoading ? (
            <div className="flex items-center justify-center flex-1">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : isError ? (
            <div className="text-sm text-red-600">
              Error:{" "}
              {error instanceof Error ? error.message : "Failed to load trips"}
            </div>
          ) : trips && trips.length > 0 ? (
            <div className="flex-1 overflow-y-auto space-y-2">
              {trips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => setSelectedTripId(trip.id)}
                  className={`w-full text-left px-4 py-3 rounded-md border transition-colors ${
                    selectedTripId === trip.id
                      ? "bg-blue-50 border-blue-300 text-blue-900 font-medium"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="text-sm">Trip #{trip.id}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1 text-center">
              <p className="text-gray-500 text-sm">No active trips</p>
            </div>
          )}
        </div>

        {/* 오른쪽: Trip Monitor */}
        <div className="flex-1">
          {selectedTripId !== null ? (
            <TripMonitor tripId={selectedTripId} vehicleId={1} />
          ) : (
            <div className="bg-white rounded-lg border p-8 h-full flex items-center justify-center">
              <p className="text-gray-500">Select a trip to monitor</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
