'use server'

import { buildURL } from '../utils/build-url'
import { withAuthAction } from './auth.actions'
import { fetchServer } from '../api/fetch-server'
import type {
  TPMSResultsByVehicleGetQuery,
  TPMSResultsByVehicleGetResponse,
} from '@/types/features/vehicles/vehicle-tpms.types'

// GET /vehicles/{id}/tpms-results
export async function getTpmsResultsByVehicle(
  query: TPMSResultsByVehicleGetQuery,
) {
  return await withAuthAction<TPMSResultsByVehicleGetResponse>(
    async (accessToken) => {
      const { id, ...params } = query
      const apiUrl = buildURL(`/vehicles/${id}/tpms-results`, params)

      try {
        const response = await fetchServer<TPMSResultsByVehicleGetResponse>(
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
