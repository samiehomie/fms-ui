import { NextRequest } from 'next/server'
import type { ApiResponseType } from '@/types/api'
import { withAuth } from '@/lib/actions/auth'
import { fetchServer } from '@/lib/api/fetch-server'
import { buildURL } from '@/lib/api/utils'
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/route/route.heplers'

// 공통 API 호출 함수
async function fetchTripsData(apiUrl: string, token: string) {
  try {
    const response = await fetchServer(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
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
}

export async function GET(request: NextRequest) {
  return await withAuth(async (accessToken) => {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    const status = searchParams.get('status')
    const start_date = searchParams.get('start_date')
    const end_date = searchParams.get('end_date')
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    // 공통 파라미터 객체
    const commonParams = {
      page,
      limit,
      status,
      start_date,
      end_date,
    }

    let apiUrl: string

    if (type === 'all') {
      apiUrl = buildURL('/vehicles/trips', commonParams)
    } else {
      apiUrl = buildURL(`/vehicles/trips/vehicle/${id}`, commonParams)
    }
    return fetchTripsData(apiUrl, accessToken)
  })
}
