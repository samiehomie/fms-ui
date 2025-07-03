import { NextRequest } from 'next/server'
import type { ApiResponseType, ApiRequestType } from '@/types/api'
import { withAuth } from '@/lib/api/auth'
import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
import { logger } from '@/lib/utils'
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/route/route.heplers'

export async function GET(request: NextRequest) {
  return await withAuth(async (tokenData) => {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') ?? ''
    const limit = searchParams.get('limit') ?? ''
    const verified = searchParams.get('verified') ?? ''
    const type = searchParams.get('type') ?? ''
    const search = searchParams.get('search') ?? ''
    const id = searchParams.get('id')

    const { token } = tokenData
    const apiUrl =
      typeof id === 'string'
        ? buildURL(`/users/${id}`)
        : buildURL(`/users`, {
            page,
            limit,
            verified,
            type,
            search,
          })
    try {
      const response = await fetchJson<ApiResponseType<'GET /users'>>(
        apiUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to fetch companies from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'Companies fetched successfully',
      )
    } catch (err) {
      logger.error('Error fetching companies:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while fetching companies',
      )
    }
  })
}
