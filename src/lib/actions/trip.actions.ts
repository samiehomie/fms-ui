'use server'

import { buildURL } from '../utils/build-url'
import { withAuthAction } from './auth.actions'
import { fetchServer } from '../api/fetch-server'
import type {
  TripDetailsResponse,
  TripDetailsQuery,
} from '@/types/features/trip/trip.types'

// GET /trips/{id}
export async function getTripDetails(query: TripDetailsQuery) {
  return await withAuthAction<TripDetailsResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/trips/${id}`)

    try {
      const response = await fetchServer<TripDetailsResponse>(apiUrl, {
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
