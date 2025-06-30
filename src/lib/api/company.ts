import { buildURL } from './utils'
import { fetchJson } from '@/lib/api/fetch'
import { getAuthData } from '@/lib/api/auth'
import type { ApiResponseType } from '@/types/api'
import type {
  CompaniesPaginationParams,
  Company,
} from '@/types/api/company.types'
import { ApiSuccessResponse } from '@/types/api/route.types'

export const companiesApi = {
  // 페이지네이션된 회사 목록 조회
  getCompaniesPaginated: async (
    params: CompaniesPaginationParams,
  ): Promise<ApiSuccessResponse<ApiResponseType<'GET /companies'>>> => {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(typeof params.verified === 'boolean' && {
        verified: `${params.verified}`,
      }),
      ...(params.type && { type: params.type }),
      ...(params.search && { search: params.search }),
    })

    const response = await fetch(`/api/companies?${searchParams}`)

    if (!response.ok) {
      throw new Error('Failed to fetch companies')
    }

    return response.json()
  },

  // 회사 배열만 추출하는 헬퍼 함수
  getCompaniesArray: async (
    params: CompaniesPaginationParams,
  ): Promise<Company[]> => {
    const response = await companiesApi.getCompaniesPaginated(params)
    return response.data.companies
  },
}
