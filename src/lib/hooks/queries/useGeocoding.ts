import { useQuery, useQueries } from '@tanstack/react-query'
import { reverseGeocode } from '@/lib/api/geocoding'

export function useReverseGeocode(
  latitude: string | number,
  longitude: string | number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['reverse-geocode', latitude, longitude],
    queryFn: () => reverseGeocode(latitude, longitude),
    staleTime: 24 * 60 * 60 * 1000, // 24시간 캐싱
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7일간 캐시 유지
    enabled: options?.enabled ?? true,
    retry: 1, // API 제한으로 인한 재시도 최소화
  })
}

// 배치 역지오코딩을 위한 Hook
export function useReverseGeocodeBatch(
  coordinates: Array<{ latitude: string; longitude: string }>,
  options?: { enabled?: boolean },
) {
  return useQueries({
    queries: coordinates.map(({ latitude, longitude }) => ({
      queryKey: ['reverse-geocode', latitude, longitude],
      queryFn: () => reverseGeocode(latitude, longitude),
      staleTime: 24 * 60 * 60 * 1000,
      gcTime: 7 * 24 * 60 * 60 * 1000,
      enabled: options?.enabled ?? true,
      retry: 1,
    })),
  })
}
