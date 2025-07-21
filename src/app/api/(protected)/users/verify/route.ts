import { NextRequest } from 'next/server'
import type { ApiResponseType, ApiRequestType } from '@/types/api'
import { withAuth } from '@/lib/api/auth'
import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/route/route.heplers'

export async function POST(request: NextRequest) {
  return await withAuth(async (tokenData) => {
    const { token } = tokenData
    const apiUrl = buildURL(`/users/verify`)
    const requestBody = await request.json()

    try {
      const response = await fetchJson<ApiResponseType<'POST /users/verify'>>(
        apiUrl,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      )
      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to verify usre from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'Companies verified successfully',
      )
    } catch (err) {
      logger.error('Error verifying user:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while verifying user',
      )
    }
  })
}
