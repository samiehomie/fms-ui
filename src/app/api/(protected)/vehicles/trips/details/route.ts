import { NextRequest } from 'next/server'
import type { ApiResponseType } from '@/types/features'
import { withAuth } from '@/lib/actions/auth.actions'
import { fetchServer } from '@/lib/api/fetch-server'
import { buildURL } from '@/lib/utils/build-url'
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/route/route.heplers'

export async function GET(request: NextRequest) {
  return await withAuth(async (accessToken) => {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id') ?? ''
    const apiUrl = buildURL(`/vehicles/trips/${id}`)
    try {
      const response = await fetchServer<
        ApiResponseType<'GET /vehicles/trips/{id}'>
      >(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to fetch trips from external API',
        )
      }
      return createSuccessResponse(response.data, 'trips fetched successfully')
    } catch (err) {
      logger.error('Error fetching trips:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while fetching trips',
      )
    }
  })
}
