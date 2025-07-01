import { buildURL } from './utils'
import { fetchJson } from '@/lib/api/fetch'
import type { ApiRequestType, ApiResponseType } from '@/types/api'
import type {
  CompaniesPaginationParams,
  Company,
} from '@/types/api/company.types'
import { ApiSuccessResponse } from '@/types/api/route.types'

export const companiesApi = {
  // 페이지네이션된 회사 목록 조회
  getCompaniesPaginated: async (
    params?: CompaniesPaginationParams,
    id?: number,
  ): Promise<ApiSuccessResponse<ApiResponseType<'GET /companies'>>> => {
    const searchParams =
      params &&
      new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        ...(typeof params.verified === 'boolean' && {
          verified: `${params.verified}`,
        }),
        ...(params.type && { type: params.type }),
        ...(params.search && { search: params.search }),
      })

    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'GET /companies'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/companies?${
        typeof id === 'number' ? `id=${id}` : searchParams
      }`,
    )

    if (!response.success) {
      throw new Error('Failed to fetch companies')
    }

    return response.data
  },

  getCompanyById: async (
    id: number,
  ): Promise<ApiSuccessResponse<ApiResponseType<'GET /companies/id'>>> => {
    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'GET /companies/id'>>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/companies?id=${id}`)

    if (!response.success) {
      throw new Error('Failed to fetch companies')
    }

    return response.data
  },

  // 회사 배열만 추출하는 헬퍼 함수
  getCompaniesArray: async (
    params: CompaniesPaginationParams,
  ): Promise<Company[]> => {
    const response = await companiesApi.getCompaniesPaginated(params)
    return response.data.companies
  },

  // 새 회사 추가
  createCompany: async (
    company: ApiRequestType<'POST /companies'>,
  ): Promise<ApiSuccessResponse<ApiResponseType<'POST /companies'>>> => {
    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'POST /companies'>>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(company),
    })

    if (!response.success) {
      throw new Error('Failed to create company')
    }

    return response.data
  },

  // 회사 삭제
  deleteCompany: async (
    id: number,
  ): Promise<ApiSuccessResponse<ApiResponseType<'DELETE /companies'>>> => {
    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'DELETE /companies'>>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/companies`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: id.toString(),
    })

    if (!response.success) {
      throw new Error('Failed to delete company')
    }

    return response.data
  },

  modifyCompany: async (
    id: number,
    company: ApiRequestType<'PUT /companies'>,
  ) => {
    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'POST /companies'>>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/companies?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(company),
    })

    if (!response.success) {
      throw new Error('Failed to create company')
    }

    return response.data
  },
}
