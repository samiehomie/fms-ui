export interface TripSession {
  id: string
  startLocation: string
  endLocation: string
  driveTime: number // in minutes
  idleTime: number // in minutes
  distance: number // in km
  events: string[]
  path: [number, number][] // [lat, lng]
}
