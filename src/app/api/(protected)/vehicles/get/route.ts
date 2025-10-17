import { NextRequest } from 'next/server'
import type { ApiResponseType } from '@/types/api'
import { withAuth } from '@/lib/actions/auth.actions'
import { fetchServer } from '@/lib/api/fetch-server'
import { buildURL } from '@/lib/utils/build-url'
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/route/route.heplers'

export async function POST(request: NextRequest) {
  return await withAuth(async (accessToken) => {
    const apiUrl = buildURL(`/vehicles/get`)
    const requestBody = await request.json()

    try {
      const response = await fetchServer<ApiResponseType<'POST /vehicles/get'>>(
        apiUrl,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      )
      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to get a vehicle from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'A vehicle created successfully',
      )
    } catch (err) {
      logger.error('Error getting a vehicle:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while getting a vehicle',
      )
    }
  })
}
