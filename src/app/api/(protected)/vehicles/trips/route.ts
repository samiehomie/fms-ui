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
    const id = searchParams.get('id')
    const parmas = Object.fromEntries(searchParams)
    delete parmas.id
    const apiUrl = buildURL(`/vehicles/${id}/trips`, parmas)

    try {
      const response = await fetchServer<
        ApiResponseType<'GET /vehicles/{id}/trips'>
      >(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.success) {
        return createErrorResponse(
          response.error.type,
          response.error.message,
          response.error.status,
        )
      }
      return createSuccessResponse(
        response.data,
        response?.pagination,
        response?.message ?? 'All trips fetched successfully',
      )
    } catch (err) {
      logger.error('Error fetching vehicles:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while fetching vehicles',
      )
    }
  })
}
