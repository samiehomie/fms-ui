import type {
  ApiRequestType,
  ApiResponseType,
  ApiParamsType,
} from '@/types/features'
import { ApiSuccessResponse } from '@/types/features/route.types'
import { fetchClient } from './fetch-client'
import { buildURL } from '../utils/build-url'

export const companiesApi = {
  // 페이지네이션된 회사 목록 조회
  getCompaniesPaginated: async (
    params: ApiParamsType<'GET /companies'>,
  ): Promise<ApiResponseType<'GET /companies'>> => {
    const apiUrl = buildURL(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/companies`,
      params,
    )

    const response = await fetchClient<ApiResponseType<'GET /companies'>>(
      apiUrl,
    )
    return response
  },

  getCompanyById: async (
    id: number,
    cookie?: string,
  ): Promise<ApiSuccessResponse<ApiResponseType<'GET /companies/{id}'>>> => {
    const response = await fetchClient<
      ApiSuccessResponse<ApiResponseType<'GET /companies/{id}'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/companies?id=${id}`,
      cookie
        ? {
            headers: {
              Cookie: cookie,
            },
          }
        : undefined,
    )

    if (!response.success) {
      throw new Error('Failed to fetch companies')
    }

    return response
  },

  // 회사 배열만 추출하는 헬퍼 함수
  // getCompaniesArray: async (
  //   params: CompaniesPaginationParams,
  // ): Promise<Company[]> => {
  //   const response = await companiesApi.getCompaniesPaginated(params)
  //   return response.data.companies
  // },

  // 새 회사 추가
  createCompany: async (
    company: ApiRequestType<'POST /companies'>,
  ): Promise<ApiSuccessResponse<ApiResponseType<'POST /companies'>>> => {
    const response = await fetchClient<
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

    return response
  },

  // 회사 삭제
  deleteCompany: async (
    id: number,
  ): Promise<ApiSuccessResponse<ApiResponseType<'DELETE /companies'>>> => {
    const response = await fetchClient<
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

    return response
  },

  modifyCompany: async (
    id: number,
    company: ApiRequestType<'PUT /companies'>,
  ) => {
    const response = await fetchClient<
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

  verifyCompany: async (
    id: number,
    verified: ApiRequestType<'PATCH /companies/{id}/verify'>,
  ) => {
    const response = await fetchClient<
      ApiSuccessResponse<ApiResponseType<'PATCH /companies/{id}/verify'>>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/companies?id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verified),
    })

    if (!response.success) {
      throw new Error('Failed to create company')
    }

    return response.data
  },
}
