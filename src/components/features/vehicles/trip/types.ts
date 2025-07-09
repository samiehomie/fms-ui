export interface TripSession {
  id: number
  startLocation: string
  endLocation: string
  driveTime: string // in minutes
  idleTime: string // in minutes
  distance: string // in km
  events: string[]
  path: [string, string][] // [lat, lng]
}
