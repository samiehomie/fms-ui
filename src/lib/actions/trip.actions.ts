'use server'

import { buildURL } from '../utils/build-url'
import { withAuthAction } from './auth.actions'
import { fetchServer } from '../api/fetch-server'
import type {
  TripGpsDetailsResponse,
  TripGpsDetailsQuery,
  TripTpmsDetailsQuery,
  TripTpmsDetailsResponse,
  TripsGetQuery,
  TripsGetResponse
} from '@/types/features/trips/trip.types'



export async function getAllTrips(query: TripsGetQuery) {
  return await withAuthAction<TripsGetResponse>(async (accessToken) => {
    const apiUrl = buildURL(`/trips`, query)

    try {
      const response = await fetchServer<TripsGetResponse>(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || "Unknown server error",
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
          message: "Unexpected server error",
          status: 500,
        },
      }
    }
  })
}

// GET /trips/{id}
export async function getTripGpsDetails(query: TripGpsDetailsQuery) {
  return await withAuthAction<TripGpsDetailsResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/trips/${id}`)

    try {
      const response = await fetchServer<TripGpsDetailsResponse>(apiUrl, {
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

// GET /trips/{id}/tpms-results
export async function getTripTpmsDetails(query: TripTpmsDetailsQuery) {
  return await withAuthAction<TripTpmsDetailsResponse>(async (accessToken) => {
    const { id, ...params } = query
    const apiUrl = buildURL(`/trips/${id}/tpms-results`, params)

    try {
      const response = await fetchServer<TripTpmsDetailsResponse>(apiUrl, {
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
