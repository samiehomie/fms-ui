import type {
  ApiRequestType,
  ApiResponseType,
  ApiParamsType,
} from '@/types/features'
import type { VehicleTripsPaginationParams } from '@/types/features/vehicles/vehicle.types'
import { buildSearchParams, buildURL } from '../utils/build-url'
import { fetchClient } from './fetch-client'

export const vehiclesApi = {
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

  getAllVehicleTrips: async (
    params: ApiParamsType<'GET /vehicles/{id}/trips'>,
  ) => {
    const apiUrl = buildURL(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles/trips`,
      params,
    )
    const response = await fetchClient<
      ApiResponseType<'GET /vehicles/{id}/trips'>
    >(apiUrl)

    return response
  },
}
