import { NextRequest } from 'next/server'
import type { ApiResponseType, ApiRequestType } from '@/types/api'
import { withAuth } from '@/lib/api/auth'
import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
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
    const include_deleted = searchParams.get('include_deleted')

    const { token } = tokenData
    const apiUrl =
      typeof id === 'string'
        ? buildURL(`/vehicles/${id}`)
        : buildURL(`/vehicles`, {
            page,
            limit,
            verified,
            type,
            search,
            include_deleted,
          })
    try {
      const response = await fetchJson<ApiResponseType<'GET /vehicles'>>(
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
          'Failed to fetch vehicles from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'Vehicles fetched successfully',
      )
    } catch (err) {
      logger.error('Error fetching vehicles:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while fetching vehicles',
      )
    }
  })
}

export async function POST(request: NextRequest) {
  return await withAuth(async (tokenData) => {
    const { token } = tokenData
    const apiUrl = buildURL(`/vehicles`)
    const requestBody = await request.json()
    try {
      const response = await fetchJson<ApiResponseType<'POST /vehicles'>>(
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
          'Failed to create a vehicle from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'A vehicle created successfully',
      )
    } catch (err) {
      logger.error('Error creating a vehicle:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while creating a vehicle',
      )
    }
  })
}

export async function DELETE(request: NextRequest) {
  return await withAuth(async (tokenData) => {
    const { token } = tokenData
    const id = (await request.json()) as string
    const apiUrl = buildURL(`/vehicles/${id}`)

    try {
      const response = await fetchJson<
        ApiResponseType<'DELETE /vehicles/{id}'>
      >(apiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to delete vehicle from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'A vehicle deleted successfully',
      )
    } catch (err) {
      logger.error('Error deleting a vehicle:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while deleting a vehicle',
      )
    }
  })
}

export async function PATCH(request: NextRequest) {
  return await withAuth(async (tokenData) => {
    const { token } = tokenData
    const id = (await request.json()) as string
    const apiUrl = buildURL(`/vehicles/${id}/restore`)

    try {
      const response = await fetchJson<
        ApiResponseType<'PATCH /vehicles/{id}/restore'>
      >(apiUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to restore vehicle from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'A vehicle retored successfully',
      )
    } catch (err) {
      logger.error('Error restoring a vehicle:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while restoring a vehicle',
      )
    }
  })
}

export async function PUT(request: NextRequest) {
  return await withAuth(async (tokenData) => {
    const { token } = tokenData
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const apiUrl = buildURL(`/vehicles/${id}`)
    const requestBody = await request.json()

    try {
      const response = await fetchJson<ApiResponseType<'PUT /vehicles/{id}'>>(
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
          'Failed to update vehicle from external API',
        )
      }
      return createSuccessResponse(
        response.data,
        'A vehicle updated successfully',
      )
    } catch (err) {
      logger.error('Error updating a vehicle:', err)

      return createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while updating a vehicle',
      )
    }
  })
}
