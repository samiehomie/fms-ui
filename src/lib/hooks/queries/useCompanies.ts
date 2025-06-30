import { useQuery } from '@tanstack/react-query'
import { companiesApi } from '@/lib/api/company'
import type { CompaniesPaginationParams } from '@/types/api/company.types'

export function useCompaniesPaginated(params: CompaniesPaginationParams) {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companiesApi.getCompaniesPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
