import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/actions/auth'
import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/route/route.heplers'
import type { AIResultsResponse } from '@/types/api/vehicle.types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return await withAuth(async (accessToken) => {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') ?? '1'
    const limit = searchParams.get('limit') ?? '1'
    const start_date = searchParams.get('start_date') ?? ''
    const end_date = searchParams.get('end_date') ?? ''

    const apiUrl = buildURL(`/data/ai-results/vehicle/${params.id}`, {
      page,
      limit,
      start_date,
      end_date,
    })

    try {
      const response = await fetchJson<AIResultsResponse>(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to fetch AI results from external API',
        )
      }

      return createSuccessResponse(
        response.data,
        'AI results fetched successfully',
      )
    } catch (err) {
      logger.error('Error fetching AI results:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while fetching AI results',
      )
    }
  })
}