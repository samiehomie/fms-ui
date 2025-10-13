import type {
  ApiRequestType,
  ApiResponseType,
  ApiParamsType,
} from '@/types/api'
import type { VehicleTripsPaginationParams } from '@/types/api/vehicle.types'
import { buildSearchParams } from './utils'
import { fetchClient } from './fetch-client'

export const vehiclesApi = {
  getVehicleById: async (body: ApiRequestType<'POST /vehicles/get'>) => {
    const response = await fetchClient<ApiResponseType<'POST /vehicles/get'>>(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles/get`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    return response
  },
  getVehiclesPaginated: async (
    params: ApiParamsType<'GET /vehicles'>,
  ): Promise<ApiResponseType<'GET /vehicles'>> => {
    const searchParams = buildSearchParams(params)
    const response = await fetchClient<ApiResponseType<'GET /vehicles'>>(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles?${searchParams}`,
    )

    return response
  },
  createVehicle: async (vehicle: ApiRequestType<'POST /vehicles'>) => {
    const response = await fetchClient<ApiResponseType<'POST /vehicles'>>(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle),
      },
    )

    return response
  },
  deleteVehicle: async (
    id: string,
  ): Promise<ApiResponseType<'DELETE /vehicles/{id}'>> => {
    const response = await fetchClient<
      ApiResponseType<'DELETE /vehicles/{id}'>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: id,
    })
    return response
  },
  restoreVehicle: async (
    id: string,
  ): Promise<ApiResponseType<'PATCH /vehicles/{id}/restore'>> => {
    const response = await fetchClient<
      ApiResponseType<'PATCH /vehicles/{id}/restore'>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: id,
    })

    return response
  },
  updateVehicle: async (
    params: ApiParamsType<'PUT /vehicles/{id}'>,
    body: ApiRequestType<'PUT /vehicles/{id}'>,
  ) => {
    const response = await fetchClient<ApiResponseType<'PUT /vehicles/{id}'>>(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles?id=${params.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    return response
  },
  // 페이지네이션된 회사 목록 조회
  getVehiclesByCompanyIdPaginated: async (
    params: ApiParamsType<'GET /vehicles/company/{company_id}'>,
    id: number,
  ) => {
    const searchParams =
      params &&
      new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
      })

    const response = await fetchClient<
      ApiResponseType<'GET /vehicles/company/{company_id}'>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/companies/vehicles?id=${id}&${searchParams}`,
    )

    return response
  },
  getVehicleTripsByVehicleIdPaginated: async (
    params: ApiParamsType<'GET /vehicles/trips/vehicle/{vehicle_id}'>,
  ) => {
    const searchParams = buildSearchParams(params)

    const response = await fetchClient<
      ApiResponseType<'GET /vehicles/trips/vehicle/{vehicle_id}'>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles/trips?id=${params.id}&${searchParams}`,
    )

    return response
  },

  getVehicleTripsByTripId: async (
    params: ApiParamsType<'GET /vehicles/trips/{id}'>,
  ) => {
    const response = await fetchClient<
      ApiResponseType<'GET /vehicles/trips/{id}'>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles/trips/details?id=${params.tripId}`,
    )

    return response
  },

  getAllVehicleTrips: async (params: VehicleTripsPaginationParams) => {
    const searchParams = buildSearchParams(params)
    const response = await fetchClient<ApiResponseType<'GET /vehicles/trips'>>(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles/trips?type=all&${searchParams}`,
    )

    return response
  },
}
