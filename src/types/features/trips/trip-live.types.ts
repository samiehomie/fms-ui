export interface TripEvent {
  tripId: number
  vehicleId: number
  timestamp: string
}

export interface TripStartedEvent extends TripEvent {
  startTime: string
}

export interface TripCompletedEvent extends TripEvent {
  endTime: string
  stats: {
    distance: number
    duration: number
    fuelConsumed: number
  }
}

export interface GpsUpdatedEvent extends TripEvent {
  latitude: number
  longitude: number
  speedOverGrd: number
}

export interface TpmsUpdatedEvent extends TripEvent {
  gpsId: number
  tireId?: number
  pressure: number
  temperature: number
  status?: number
}

export interface AiResultUpdatedEvent extends TripEvent {
  gpsId: number
  tireId?: number
  model: string
  modelResult: string
  modelResultUnit?: string
  predTime: string
}

export type WebSocketEvent =
  | { type: "trip:started"; data: TripStartedEvent }
  | { type: "trip:completed"; data: TripCompletedEvent }
  | { type: "gps:updated"; data: GpsUpdatedEvent }
  | { type: "tpms:updated"; data: TpmsUpdatedEvent }
  | { type: "ai:result:updated"; data: AiResultUpdatedEvent }
  | { type: "subscribed"; data: { tripId: number; message: string } }
  | { type: "unsubscribed"; data: { tripId: number; message: string } }
  | { type: "error"; data: { message: string } }

export interface SubscriptionOptions {
  tripId: number
  vehicleId?: number
}
