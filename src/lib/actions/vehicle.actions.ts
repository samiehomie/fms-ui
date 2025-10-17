'use server'

import { buildURL } from '../utils/build-url'
import type {
  ApiParamsType,
  ApiRequestType,
  ApiResponseType,
} from '@/types/api'
import { withAuthAction } from './auth.actions'
import { fetchServer } from '../api/fetch-server'

export async function getAllVehicles(params: ApiParamsType<'GET /vehicles'>) {
  return await withAuthAction<ApiResponseType<'GET /vehicles'>>(
    async (accessToken) => {
      const { id } = params
      const apiUrl =
        typeof id === 'string'
          ? buildURL(`/vehicles/${id}`)
          : buildURL(`/vehicles`, {
              page: params.page,
              limit: params.limit,
              search: params.search,
              includeDeleted: params.include_deleted,
            })

      try {
        const response = await fetchServer<ApiResponseType<'GET /vehicles'>>(
          apiUrl,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          },
        )

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
    },
  )
}

export async function getVehicle(params: ApiParamsType<'GET /vehicles/{id}'>) {
  return await withAuthAction<ApiResponseType<'GET /vehicles/{id}'>>(
    async (accessToken) => {
      const { id } = params
      const apiUrl = buildURL(`/vehicles/${id}`)

      try {
        const response = await fetchServer<
          ApiResponseType<'GET /vehicles/{id}'>
        >(apiUrl, {
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
    },
  )
}

export async function createVehicle(body: ApiRequestType<'POST /vehicles'>) {
  return await withAuthAction<ApiResponseType<'POST /vehicles'>>(
    async (accessToken) => {
      const apiUrl = buildURL(`/vehicles`)

      try {
        const response = await fetchServer<ApiResponseType<'POST /vehicles'>>(
          apiUrl,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            cache: 'no-store',
          },
        )

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
    },
  )
}

export async function updateVehicle(
  params: ApiParamsType<'PATCH /vehicles/{id}'>,
  body: ApiRequestType<'PATCH /vehicles/{id}'>,
) {
  return await withAuthAction<ApiResponseType<'PATCH /vehicles/{id}'>>(
    async (accessToken) => {
      const { id } = params
      const apiUrl = buildURL(`/vehicles/${id}`)

      try {
        const response = await fetchServer<
          ApiResponseType<'PATCH /vehicles/{id}'>
        >(apiUrl, {
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
    },
  )
}

export async function deleteVehicle(
  params: ApiParamsType<'DELETE /vehicles/{id}'>,
) {
  return await withAuthAction<ApiResponseType<'DELETE /vehicles/{id}'>>(
    async (accessToken) => {
      const { id } = params
      const apiUrl = buildURL(`/vehicles/${id}`)

      try {
        const response = await fetchServer<
          ApiResponseType<'DELETE /vehicles/{id}'>
        >(apiUrl, {
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
    },
  )
}

export async function restoreVehicle(
  params: ApiParamsType<'PATCH /vehicles/{id}/restore'>,
) {
  return await withAuthAction<ApiResponseType<'PATCH /vehicles/{id}/restore'>>(
    async (accessToken) => {
      const { id } = params
      const apiUrl = buildURL(`/vehicles/${id}`)

      try {
        const response = await fetchServer<
          ApiResponseType<'PATCH /vehicles/{id}/restore'>
        >(apiUrl, {
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
    },
  )
}
