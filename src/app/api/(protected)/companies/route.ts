import { NextRequest } from 'next/server'
import type { ApiResponseType } from '@/types/api'
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

    const { token } = tokenData
    const apiUrl = buildURL(
      `/companies?page=${page}&limit=${limit}&verified=${verified}&type=${type}&search=${search}`,
    )
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

export async function POST(request: NextRequest) {
  return await withAuth(async (tokenData) => {
    const { token } = tokenData
    const apiUrl = buildURL(`/companies`)
    const requestBody = await request.json()
    logger.log('post companies', requestBody)
    try {
      const response = await fetchJson<ApiResponseType<'POST /companies'>>(
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
          'Failed to create companies from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'Companies created successfully',
      )
    } catch (err) {
      logger.error('Error creating companies:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while creating companies',
      )
    }
  })
}
