import { NextRequest } from 'next/server'
import type { ApiResponseType, ApiRequestType } from '@/types/api'
import { withAuth } from '@/lib/api/auth'
import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/route/route.heplers'

export async function GET(request: NextRequest) {
  return await withAuth(async (tokenData) => {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') ?? ''
    const limit = searchParams.get('limit') ?? ''
    const id = searchParams.get('id') ?? ''

    const { token } = tokenData
    const apiUrl = buildURL(`/vehicles/company/${id}`, { page, limit })
    try {
      const response = await fetchJson<
        ApiResponseType<'GET /vehicles/company/{company_id}'>
      >(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to fetch vehicles from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'vehicles fetched successfully',
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
