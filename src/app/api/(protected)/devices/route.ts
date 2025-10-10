import { NextRequest } from 'next/server'
import type { ApiResponseType, ApiRequestType } from '@/types/api'
import { withAuth } from '@/lib/actions/auth'
import { fetchServer } from '@/lib/api/fetch-server'
import { buildURL } from '@/lib/api/utils'
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
        ? buildURL(`/devices/edge-devices/${id}`)
        : buildURL(`/devices/edge-devices`, {
            page,
            limit,
            verified,
            terminated,
            type,
          })
    try {
      const response = await fetchServer<
        ApiResponseType<'GET /devices/edge-devices'>
      >(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to fetch devices from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'Devices fetched successfully',
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
    const apiUrl = buildURL(`/devices/edge-devices`)
    const requestBody = await request.json()

    try {
      const response = await fetchServer<
        ApiResponseType<'POST /devices/edge-devices'>
      >(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      logger.log(response)
      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to create a device from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'A device created successfully',
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
