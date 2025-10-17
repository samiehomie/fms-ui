import { NextRequest } from 'next/server'
import type { ApiResponseType } from '@/types/api'
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
    const page = searchParams.get('page') ?? ''
    const limit = searchParams.get('limit') ?? ''
    const verified = searchParams.get('verified') ?? ''
    const terminated = searchParams.get('terminated') ?? ''
    const type = searchParams.get('type') ?? ''
    const id = searchParams.get('id')

    const apiUrl =
      typeof id === 'string'
        ? buildURL(`/edge-devices/${id}`)
        : buildURL(`/edge-devices`, {
            page,
            limit,
            verified,
            terminated,
            type,
          })
    try {
      const response = await fetchServer<ApiResponseType<'GET /edge-devices'>>(
        apiUrl,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      )
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
        response?.message ?? 'All edgeDevices fetched successfully',
      )
    } catch (err) {
      logger.error('Error fetching devices:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while fetching devices',
      )
    }
  })
}

export async function POST(request: NextRequest) {
  return await withAuth(async (accessToken) => {
    const apiUrl = buildURL(`/edge-devices`)
    const requestBody = await request.json()

    try {
      const response = await fetchServer<ApiResponseType<'POST /edge-devices'>>(
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
          response.error.type,
          response.error.message,
          response.error.status,
        )
      }
      return createSuccessResponse(
        response.data,
        response?.pagination,
        response?.message ?? 'A device created successfully',
      )
    } catch (err) {
      logger.error('Error creating a device:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while creating a device',
      )
    }
  })
}
