interface GpsPoint {
  latitude: string
  longitude: string
}

/**
 * GPS 경로 배열의 실제 이동 거리 계산 (km)
 * 연속된 GPS 포인트 간 거리를 모두 합산
 */
export function calculateActualTripDistance(gpsPoints: GpsPoint[]): number {
  if (gpsPoints.length < 2) {
    return 0
  }

  let totalDistance = 0

  for (let i = 0; i < gpsPoints.length - 1; i++) {
    const distance = calculateHaversineDistance(gpsPoints[i], gpsPoints[i + 1])
    totalDistance += distance
  }

  return totalDistance
}

/**
 * Haversine 공식을 사용한 두 GPS 좌표 간 거리 계산 (km)
 */
function calculateHaversineDistance(
  point1: GpsPoint,
  point2: GpsPoint,
): number {
  const lat1 = parseFloat(point1.latitude)
  const lon1 = parseFloat(point1.longitude)
  const lat2 = parseFloat(point2.latitude)
  const lon2 = parseFloat(point2.longitude)

  const R = 6371 // 지구 반지름 (km)
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * 거리를 사람이 읽기 쉬운 형태로 포맷 (km 또는 m)
 */
export function formatDistance(distanceInKm: number): string {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`
  }
  return `${distanceInKm.toFixed(2)} km`
}

/**
 * 마일로 변환 (북미 시장용)
 */
export function kmToMiles(km: number): number {
  return km * 0.621371
}

export function formatDistanceInMiles(distanceInKm: number): string {
  const miles = kmToMiles(distanceInKm)
  if (miles < 1) {
    return `${Math.round(miles * 5280)} ft` // feet
  }
  return `${miles.toFixed(2)} mi`
}
