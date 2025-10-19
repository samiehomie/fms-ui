'use server'

import { buildURL } from '../utils/build-url'
import { withAuthAction } from './auth.actions'
import { fetchServer } from '../api/fetch-server'
import type {
  DevicesGetQuery,
  DevicesGetResponse,
  DeviceGetQuery,
  DeviceGetResponse,
  DeviceCreateBody,
  DeviceCreateResponse,
} from '@/types/features/devices/device.types'

export async function getAllDevices(query: DevicesGetQuery) {
  return await withAuthAction<DevicesGetResponse>(async (accessToken) => {
    const apiUrl = buildURL(`/edge-devices`, query)

    try {
      const response = await fetchServer<DevicesGetResponse>(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response

      return { success: true, data, pagination }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}

export async function createDevice(body: DeviceCreateBody) {
  return await withAuthAction<DeviceCreateResponse>(async (accessToken) => {
    const apiUrl = buildURL(`/edge-devices`)

    try {
      const response = await fetchServer<DeviceCreateResponse>(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response
      return { success: true, data, pagination }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}

export async function getDevice(query: DeviceGetQuery) {
  return await withAuthAction<DeviceGetResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/vehicles/${id}`)

    try {
      const response = await fetchServer<DeviceGetResponse>(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || 'Unknown server error',
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response

      return { success: true, data, pagination }
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Unexpected server error',
          status: 500,
        },
      }
    }
  })
}

// export async function updateDevice(
//   query: VehicleUpdateQuery,
//   body: VehicleUpdateBody,
// ) {
//   return await withAuthAction<VehicleUpdateResponse>(async (accessToken) => {
//     const { id } = query
//     const apiUrl = buildURL(`/vehicles/${id}`)

//     try {
//       const response = await fetchServer<VehicleUpdateResponse>(apiUrl, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//         cache: 'no-store',
//       })

//       if (!response.success) {
//         return {
//           success: false,
//           error: {
//             message: response.error.message || 'Unknown server error',
//             status: response.error.status,
//           },
//         }
//       }
//       const { data, pagination } = response
//       return { success: true, data, pagination }
//     } catch (error) {
//       return {
//         success: false,
//         error: {
//           message: 'Unexpected server error',
//           status: 500,
//         },
//       }
//     }
//   })
// }

// export async function deleteDevice(params: VehicleDeleteQuery) {
//   return await withAuthAction<VehicleDeleteResponse>(async (accessToken) => {
//     const { id } = params
//     const apiUrl = buildURL(`/vehicles/${id}`)

//     try {
//       const response = await fetchServer<VehicleDeleteResponse>(apiUrl, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//         cache: 'no-store',
//       })

//       if (!response.success) {
//         return {
//           success: false,
//           error: {
//             message: response.error.message || 'Unknown server error',
//             status: response.error.status,
//           },
//         }
//       }
//       const { data, pagination, message } = response

//       return { success: true, data, pagination, message }
//     } catch (error) {
//       return {
//         success: false,
//         error: {
//           message: 'Unexpected server error',
//           status: 500,
//         },
//       }
//     }
//   })
// }

// export async function restoreDevice(query: VehicleRestoreQuery) {
//   return await withAuthAction<VehicleRestoreResponse>(async (accessToken) => {
//     const { id } = query
//     const apiUrl = buildURL(`/vehicles/${id}/restore`)

//     try {
//       const response = await fetchServer<VehicleRestoreResponse>(apiUrl, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//         cache: 'no-store',
//       })

//       if (!response.success) {
//         return {
//           success: false,
//           error: {
//             message: response.error.message || 'Unknown server error',
//             status: response.error.status,
//           },
//         }
//       }
//       const { data, pagination, message } = response
//       return { success: true, data, pagination, message }
//     } catch (error) {
//       return {
//         success: false,
//         error: {
//           message: 'Unexpected server error',
//           status: 500,
//         },
//       }
//     }
//   })
// }
