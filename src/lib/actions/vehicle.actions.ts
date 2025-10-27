"use server"

import { buildURL } from "../utils/build-url"
import { withAuthAction } from "./auth.actions"
import { fetchServer } from "../api/fetch-server"
import type {
  VehiclesGetResponse,
  VehiclesGetQuery,
  VehicleGetQuery,
  VehicleGetResponse,
  VehicleCreateBody,
  VehicleCreateResponse,
  VehicleDeleteQuery,
  VehicleDeleteResponse,
  VehicleRestoreQuery,
  VehicleRestoreResponse,
  VehicleUpdateResponse,
  VehicleUpdateBody,
  VehicleUpdateQuery,
} from "@/types/features/vehicles/vehicle.types"

export async function getAllVehicles(query: VehiclesGetQuery) {
  return await withAuthAction<VehiclesGetResponse>(async (accessToken) => {
    const apiUrl = buildURL(`/vehicles`, query)

    try {
      const response = await fetchServer<VehiclesGetResponse>(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || "Unknown server error",
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
          message: "Unexpected server error",
          status: 500,
        },
      }
    }
  })
}

export async function getVehicle(query: VehicleGetQuery) {
  return await withAuthAction<VehicleGetResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/vehicles/${id}`)

    try {
      const response = await fetchServer<VehicleGetResponse>(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || "Unknown server error",
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response

      return { success: true, data, pagination }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: {
          message: "Unexpected server error",
          status: 500,
        },
      }
    }
  })
}

export async function createVehicle(body: VehicleCreateBody) {
  return await withAuthAction<VehicleCreateResponse>(async (accessToken) => {
    const apiUrl = buildURL(`/vehicles`)

    try {
      const response = await fetchServer<VehicleCreateResponse>(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || "Unknown server error",
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response
      return { success: true, data, pagination }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: {
          message: "Unexpected server error",
          status: 500,
        },
      }
    }
  })
}

export async function updateVehicle(
  query: VehicleUpdateQuery,
  body: VehicleUpdateBody,
) {
  return await withAuthAction<VehicleUpdateResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/vehicles/${id}`)

    try {
      const response = await fetchServer<VehicleUpdateResponse>(apiUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || "Unknown server error",
            status: response.error.status,
          },
        }
      }
      const { data, pagination } = response
      return { success: true, data, pagination }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: {
          message: "Unexpected server error",
          status: 500,
        },
      }
    }
  })
}

export async function deleteVehicle(params: VehicleDeleteQuery) {
  return await withAuthAction<VehicleDeleteResponse>(async (accessToken) => {
    const { id } = params
    const apiUrl = buildURL(`/vehicles/${id}`)

    try {
      const response = await fetchServer<VehicleDeleteResponse>(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || "Unknown server error",
            status: response.error.status,
          },
        }
      }
      const { data, pagination, message } = response

      return { success: true, data, pagination, message }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: {
          message: "Unexpected server error",
          status: 500,
        },
      }
    }
  })
}

export async function restoreVehicle(query: VehicleRestoreQuery) {
  return await withAuthAction<VehicleRestoreResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/vehicles/${id}/restore`)

    try {
      const response = await fetchServer<VehicleRestoreResponse>(apiUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message || "Unknown server error",
            status: response.error.status,
          },
        }
      }
      const { data, pagination, message } = response
      return { success: true, data, pagination, message }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: {
          message: "Unexpected server error",
          status: 500,
        },
      }
    }
  })
}
