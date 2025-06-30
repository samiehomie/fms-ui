import { NextResponse } from 'next/server'
import type { ApiRequestType, ApiResponseType } from '@/types/api'
import { withAuth } from '@/lib/api/auth'
import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
import { logger } from '@/lib/utils'
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/route/route.heplers'

export async function GET() {
  return await withAuth(async (tokenData) => {
    const { token } = tokenData
    const apiUrl = buildURL('/companies')
    try {
      const response = await fetchJson<ApiResponseType<'GET /companies'>>(
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
