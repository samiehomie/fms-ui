'use server'

import { buildURL } from '../utils/build-url'
import { withAuthAction } from './auth.actions'
import { fetchServer } from '../api/fetch-server'
import type {
  VehicleTripsResponse,
  VehicleTripsQuery,
} from '@/types/features/vehicle/vehicle.types'

// GET /vehicles/{id}/trips
export async function getVehicleTrips(query: VehicleTripsQuery) {
  return await withAuthAction<VehicleTripsResponse>(async (accessToken) => {
    const { id, ...params } = query
    const apiUrl = buildURL(`/vehicles/${id}/trips`, params)

    try {
      const response = await fetchServer<VehicleTripsResponse>(apiUrl, {
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
