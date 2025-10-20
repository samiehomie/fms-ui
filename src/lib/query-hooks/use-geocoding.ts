import { useQuery, useQueries, skipToken } from '@tanstack/react-query'
import { reverseGeocode } from '@/lib/api/geocoding'

export function useReverseGeocode(
  latitude: string | number | null,
  longitude: string | number | null,
) {
  return useQuery({
    queryKey: ['reverse-geocode', latitude, longitude],
    queryFn:
      latitude && longitude
        ? async () => await reverseGeocode(latitude, longitude)
        : skipToken,
    staleTime: 8 * 60 * 60 * 1000, // 8 hours
    gcTime: 12 * 60 * 60 * 1000, // 12 hours
    retry: 3, // API 제한으로 인한 재시도 최소화
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
      queryFn: async () => await reverseGeocode(latitude, longitude),
      staleTime: 24 * 60 * 60 * 1000,
      gcTime: 7 * 24 * 60 * 60 * 1000,
      enabled: options?.enabled ?? true,
      retry: 3,
    })),
  })
}
