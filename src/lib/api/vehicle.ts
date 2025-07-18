import { fetchJson } from '@/lib/api/fetch'
import type {
  ApiRequestType,
  ApiResponseType,
  ApiParamsType,
} from '@/types/api'
import { ApiSuccessResponse } from '@/types/api/route.types'
import type { VehicleTripsPaginationParams } from '@/types/api/vehicle.types'
import { logger } from '../utils'
import { buildSearchParams } from './utils'

export const vehiclesApi = {
  getVehiclesPaginated: async (
    params: ApiParamsType<'GET /vehicles'>,
    cookie?: string,
  ): Promise<ApiSuccessResponse<ApiResponseType<'GET /vehicles'>>> => {
    const searchParams =
      params &&
      new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        include_deleted: `${params.include_deleted ?? false}`,
      })

    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'GET /vehicles'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles?${searchParams}`,
      cookie
        ? {
            headers: {
              Cookie: cookie,
            },
          }
        : { revalidate: false },
    )

    if (!response.success) {
      throw new Error('Failed to fetch vehicles')
    }

    return response.data
  },
  getVehiclesSearchPaginated: async (
    params: ApiParamsType<'GET /vehicles/search'>,
    cookie?: string,
  ): Promise<ApiSuccessResponse<ApiResponseType<'GET /vehicles/search'>>> => {
    const searchParams =
      params &&
      new URLSearchParams({
        query: params.query.toString(),
        page: params.page.toString(),
        limit: params.limit.toString(),
        include_deleted: `${params.include_deleted ?? false}`,
      })

    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'GET /vehicles/search'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles/search?${searchParams}`,
      cookie
        ? {
            headers: {
              Cookie: cookie,
            },
          }
        : { revalidate: false },
    )

    if (!response.success) {
      throw new Error('Failed to fetch vehicles')
    }

    return response.data
  },

  createVehicle: async (
    vehicle: ApiRequestType<'POST /vehicles'>,
  ): Promise<ApiSuccessResponse<ApiResponseType<'POST /vehicles'>>> => {
    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'POST /vehicles'>>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicle),
    })

    if (!response.success) {
      throw new Error('Failed to create vehicle')
    }

    return response.data
  },
  deleteVehicle: async (
    id: string,
  ): Promise<ApiSuccessResponse<ApiResponseType<'DELETE /vehicles/{id}'>>> => {
    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'DELETE /vehicles/{id}'>>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: id,
    })

    if (!response.success) {
      throw new Error('Failed to delete vehicle')
    }
    return response.data
  },
  // 페이지네이션된 회사 목록 조회
  getVehiclesByCompanyIdPaginated: async (
    params: ApiParamsType<'GET /vehicles/company/{company_id}'>,
    id: number,
  ): Promise<
    ApiSuccessResponse<ApiResponseType<'GET /vehicles/company/{company_id}'>>
  > => {
    const searchParams =
      params &&
      new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
      })

    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'GET /vehicles/company/{company_id}'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/companies/vehicles?id=${id}&${searchParams}`,
    )

    if (!response.success) {
      throw new Error('Failed to fetch vehicles')
    }

    return response.data
  },
  getVehicleTripsByVehicleIdPaginated: async (
    params: ApiParamsType<'GET /vehicles/trips/vehicle/{vehicle_id}'>,
  ): Promise<
    ApiSuccessResponse<
      ApiResponseType<'GET /vehicles/trips/vehicle/{vehicle_id}'>
    >
  > => {
    const searchParams = buildSearchParams(params)

    const response = await fetchJson<
      ApiSuccessResponse<
        ApiResponseType<'GET /vehicles/trips/vehicle/{vehicle_id}'>
      >
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles/trips?id=${params.id}&${searchParams}`,
    )

    if (!response.success) {
      throw new Error('Failed to fetch trips')
    }

    return response.data
  },

  getVehicleTripsByTripId: async (
    params: ApiParamsType<'GET /vehicles/trips/{id}'>,
  ): Promise<
    ApiSuccessResponse<ApiResponseType<'GET /vehicles/trips/{id}'>>
  > => {
    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'GET /vehicles/trips/{id}'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles/trips/details?id=${params.tripId}`,
    )

    if (!response.success) {
      throw new Error('Failed to fetch trips')
    }

    return response.data
  },

  getAllVehicleTrips: async (
    params: VehicleTripsPaginationParams,
  ): Promise<ApiSuccessResponse<ApiResponseType<'GET /vehicles/trips'>>> => {
    const searchParams = buildSearchParams(params)
    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'GET /vehicles/trips'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles/trips?type=all&${searchParams}`,
    )

    if (!response.success) {
      throw new Error('Failed to fetch trips')
    }

    return response.data
  },
}
