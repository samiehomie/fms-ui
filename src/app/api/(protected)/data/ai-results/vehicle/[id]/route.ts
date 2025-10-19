import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/actions/auth.actions'
import { fetchServer } from '@/lib/api/fetch-server'
import { buildURL } from '@/lib/utils/build-url'
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/route/route.heplers'
import type { AIResultsResponse } from '@/types/features/vehicles/vehicle.types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return await withAuth(async (accessToken) => {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') ?? '1'
    const limit = searchParams.get('limit') ?? '1'
    const start_date = searchParams.get('start_date') ?? ''
    const end_date = searchParams.get('end_date') ?? ''
    const { id } = await params

    const apiUrl = buildURL(`/data/ai-results/vehicle/${id}`, {
      page,
      limit,
      start_date,
      end_date,
    })

    try {
      const response = await fetchServer<AIResultsResponse>(apiUrl, {
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

      const { data, pagination } = response

      return createSuccessResponse(
        data,
        pagination,
        'AI results fetched successfully',
      )
    } catch (err) {
      console.error('Error fetching AI results:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while fetching AI results',
      )
    }
  })
}
