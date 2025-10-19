'use server'

import { buildURL } from '../utils/build-url'
import { withAuthAction } from './auth.actions'
import { fetchServer } from '../api/fetch-server'
import type {
  CompaniesGetQuery,
  CompaniesGetResponse,
  CompanyCreateBody,
  CompanyCreateResponse,
  CompanyGetQuery,
  CompanyGetResponse,
  CompanyUpdateBody,
  CompanyDeleteQuery,
  CompanyDeleteResponse,
  CompanyRestoreQuery,
  CompanyRestoreResponse,
  CompanyUpdateQuery,
  CompanyUpdateResponse,
  CompanyVerifyBody,
  CompanyVerifyQuery,
  CompanyVerifyResponse,
  CompanyVehiclesQuery,
  CompanyVehiclesReponse,
} from '@/types/features/companies/company.types'

// TODO 반복되는 함수 헬퍼 함수로 만들기
export async function getAllCompanies(query: CompaniesGetQuery) {
  return await withAuthAction<CompaniesGetResponse>(async (accessToken) => {
    const apiUrl = buildURL(`/companies`, query)

    try {
      const response = await fetchServer<CompaniesGetResponse>(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response

      return { success: true, data, pagination }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}

export async function getCompany(query: CompanyGetQuery) {
  return await withAuthAction<CompanyGetResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/companies/${id}`)

    try {
      const response = await fetchServer<CompanyGetResponse>(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response

      return { success: true, data, pagination }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}

export async function createCompany(body: CompanyCreateBody) {
  return await withAuthAction<CompanyCreateResponse>(async (accessToken) => {
    const apiUrl = buildURL(`/companies`)

    try {
      const response = await fetchServer<CompanyCreateResponse>(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response
      return { success: true, data, pagination }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}

export async function updateCompany(
  query: CompanyUpdateQuery,
  body: CompanyUpdateBody,
) {
  return await withAuthAction<CompanyUpdateResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/companies/${id}`)

    try {
      const response = await fetchServer<CompanyUpdateResponse>(apiUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response
      return { success: true, data, pagination }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}

export async function deleteCompany(params: CompanyDeleteQuery) {
  return await withAuthAction<CompanyDeleteResponse>(async (accessToken) => {
    const { id } = params
    const apiUrl = buildURL(`/companies/${id}`)

    try {
      const response = await fetchServer<CompanyDeleteResponse>(apiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination, message } = response

      return { success: true, data, pagination, message }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}

export async function restoreCompany(query: CompanyRestoreQuery) {
  return await withAuthAction<CompanyRestoreResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/companies/${id}/restore`)

    try {
      const response = await fetchServer<CompanyRestoreResponse>(apiUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination, message } = response
      return { success: true, data, pagination, message }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}

export async function verifyCompany(
  query: CompanyVerifyQuery,
  body: CompanyVerifyBody,
) {
  return await withAuthAction<CompanyVerifyResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/companies/${id}/verify`)

    try {
      const response = await fetchServer<CompanyVerifyResponse>(apiUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response
      return { success: true, data, pagination }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}

export async function getCompanyVehicles(query: CompanyVehiclesQuery) {
  return await withAuthAction<CompanyVehiclesReponse>(async (accessToken) => {
    const { id, ...filter } = query
    const apiUrl = buildURL(`/companies/${id}/vehicles`, filter)

    try {
      const response = await fetchServer<CompanyVehiclesReponse>(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response

      return { success: true, data, pagination }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}
