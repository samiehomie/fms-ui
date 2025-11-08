'use client'

import { useTripWebSocket } from '@/lib/hooks/use-trip-websocket'
import type { WebSocketEvent } from '@/types/features/trips/trip-live.types'

interface TripMonitorProps {
  tripId: number
  vehicleId?: number
}

export function TripMonitor({ tripId, vehicleId }: TripMonitorProps) {
  const { isConnected, events, error, clearEvents, clearError } = useTripWebSocket({
    tripId,
    vehicleId,
    onConnect: () => {
      logger.info('Connected to trip monitor')
    },
    onDisconnect: () => {
      logger.warn('Disconnected from trip monitor')
    },
    onError: (error) => {
      logger.error('Trip monitor error', error)
    },
  })

  const getEventTypeLabel = (event: WebSocketEvent): string => {
    switch (event.type) {
      case 'trip:started':
        return 'Trip Started'
      case 'trip:completed':
        return 'Trip Completed'
      case 'gps:updated':
        return 'GPS Updated'
      case 'tpms:updated':
        return 'TPMS Updated'
      case 'ai:result:updated':
        return 'AI Result'
      default:
        return 'Event'
    }
  }

  const getEventDescription = (event: WebSocketEvent): string => {
    switch (event.type) {
      case 'trip:started':
        return `Trip started at ${new Date(event.data.startTime).toLocaleTimeString()}`
      case 'trip:completed':
        return `Trip completed. Distance: ${event.data.stats.distance}km, Duration: ${Math.round(event.data.stats.duration / 60)}min, Fuel: ${event.data.stats.fuelConsumed}L`
      case 'gps:updated':
        return `Lat: ${event.data.latitude.toFixed(4)}, Lon: ${event.data.longitude.toFixed(4)}, Speed: ${event.data.speedOverGrd}km/h`
      case 'tpms:updated':
        return `Tire ${event.data.tireId}: Pressure ${event.data.pressure}psi, Temp ${event.data.temperature}°C`
      case 'ai:result:updated':
        return `Model: ${event.data.model}, Result: ${event.data.modelResult}${event.data.modelResultUnit ? ` ${event.data.modelResultUnit}` : ''}`
      default:
        return JSON.stringify(event.data)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 ">
      <div className="bg-white border shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Trip Monitor</h2>
              <p className="text-sm text-gray-600">Trip ID: {tripId} | Vehicle ID: {vehicleId || 'N/A'}</p>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-gray-700">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error.message}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Events Display */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Real-time Events ({events.length})
            </h3>
            {events.length > 0 && (
              <button
                onClick={clearEvents}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Waiting for events...</p>
              {!isConnected && <p className="text-sm text-gray-400 mt-2">Reconnecting...</p>}
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded p-3 hover:bg-gray-100 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {getEventTypeLabel(event)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {getEventDescription(event)}
                      </p>
                      {/* <p className="text-xs text-gray-400 mt-2">
                        {new Date(event.data.timestamp).toLocaleTimeString()}
                      </p> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connection Info */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
          <p>
            Status: {isConnected ? '✓ Connected' : '✕ Disconnected'} | Events: {events.length}
          </p>
        </div>
      </div>
    </div>
  )
}
