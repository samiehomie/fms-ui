import { NextRequest } from 'next/server'
import type { ApiResponseType, ApiRequestType } from '@/types/api'
import { withAuth } from '@/lib/actions/auth.actions'
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
    const type = searchParams.get('type') ?? ''
    const search = searchParams.get('search') ?? ''
    const id = searchParams.get('id')

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
      const response = await fetchServer<ApiResponseType<'GET /users'>>(
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

export async function POST(request: NextRequest) {
  return await withAuth(async (accessToken) => {
    const apiUrl = buildURL(`/users`)
    const requestBody = await request.json()
    logger.log('post users', requestBody)
    try {
      const response = await fetchServer<ApiResponseType<'POST /users'>>(
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
          'INTERNAL_ERROR',
          'Failed to create user from external API',
        )
      }
      return createSuccessResponse(response.data, 'User created successfully')
    } catch (err) {
      logger.error('Error creating user:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while creating user',
      )
    }
  })
}
