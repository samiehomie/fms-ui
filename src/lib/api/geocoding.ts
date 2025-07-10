import { logger } from '../utils'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export interface GeocodeResponse {
  results: Array<{
    formatted_address: string
    address_components: Array<{
      long_name: string
      short_name: string
      types: string[]
    }>
  }>
  status: string
}

export async function reverseGeocode(
  latitude: string | number,
  longitude: string | number,
): Promise<string> {
  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&language=en`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch address')
  }

  const data: GeocodeResponse = await response.json()
  logger.log('geocoding', data)
  if (data.status === 'OK' && data.results.length > 3) {
    return data.results[3].formatted_address
  }

  return `${lat}, ${lng}` // 실패시 좌표 반환
}
