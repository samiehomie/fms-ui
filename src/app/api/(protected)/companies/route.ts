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
        ? buildURL(`/companies/${id}`)
        : buildURL(`/companies`, {
            page,
            limit,
            verified,
            type,
            search,
          })
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

export async function DELETE(request: NextRequest) {
  return await withAuth(async (tokenData) => {
    const { token } = tokenData
    const id = (await request.json()) as number
    const apiUrl = buildURL(`/companies/${id}`)

    try {
      const response = await fetchJson<ApiResponseType<'DELETE /companies'>>(
        apiUrl,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to delete companies from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'Companies deleted successfully',
      )
    } catch (err) {
      logger.error('Error deleting companies:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while deleting companies',
      )
    }
  })
}

export async function PUT(request: NextRequest) {
  return await withAuth(async (tokenData) => {
    const { token } = tokenData
    const id = (await request.json()) as number
    const apiUrl = buildURL(`/companies/${id}`)
    const requestBody = await request.json()

    try {
      const response = await fetchJson<ApiResponseType<'PUT /companies'>>(
        apiUrl,
        {
          method: 'PUT',
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
          'Failed to modify companies from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'Companies modified successfully',
      )
    } catch (err) {
      logger.error('Error modifying companies:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while modifying companies',
      )
    }
  })
}
