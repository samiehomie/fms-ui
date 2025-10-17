import { NextRequest } from 'next/server'
import type { ApiResponseType } from '@/types/api'
import { withAuth } from '@/lib/actions/auth.actions'
import { fetchServer } from '@/lib/api/fetch-server'
import { buildURL } from '@/lib/utils/build-url'
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/route/route.heplers'

export async function POST(request: NextRequest) {
  return await withAuth(async (accessToken) => {
    const apiUrl = buildURL(`/vehicles`)
    const requestBody = await request.json()
    try {
      const response = await fetchServer<ApiResponseType<'POST /vehicles'>>(
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
        response?.message,
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
  return await withAuth(async (accessToken) => {
    const id = (await request.json()) as string
    const apiUrl = buildURL(`/vehicles/${id}`)

    try {
      const response = await fetchServer<
        ApiResponseType<'DELETE /vehicles/{id}'>
      >(apiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.success) {
        return createErrorResponse(
          'INTERNAL_ERROR',
          'Failed to delete vehicle from external API',
          response.error.status,
        )
      }
      return createSuccessResponse(
        response.data,
        response?.pagination,
        response?.message ?? 'A vehicle deleted successfully',
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

// export async function PATCH(request: NextRequest) {
//   return await withAuth(async (accessToken) => {
//     const id = (await request.json()) as string
//     const apiUrl = buildURL(`/vehicles/${id}/restore`)

//     try {
//       const response = await fetchServer<
//         ApiResponseType<'PATCH /vehicles/{id}/restore'>
//       >(apiUrl, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       })
//       if (!response.success) {
//         return createErrorResponse(
//           'INTERNAL_ERROR',
//           'Failed to restore vehicle from external API',
//         )
//       }
//       return createSuccessResponse(
//         response.data,
//         response?.pagination,
//         response?.message ?? 'A vehicle retored successfully',
//       )
//     } catch (err) {
//       logger.error('Error restoring a vehicle:', err)

//       return createErrorResponse(
//         'INTERNAL_ERROR',
//         'An unexpected error occurred while restoring a vehicle',
//       )
//     }
//   })
// }

export async function PATCH(request: NextRequest) {
  return await withAuth(async (accessToken) => {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const apiUrl = buildURL(`/vehicles/${id}`)
    const requestBody = await request.json()

    try {
      const response = await fetchServer<ApiResponseType<'PUT /vehicles/{id}'>>(
        apiUrl,
        {
          method: 'PUT',
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
        response?.message ?? 'A vehicle updated successfully',
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
