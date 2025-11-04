"use server"

import { buildURL } from "../utils/build-url"
import { withAuthAction } from "./auth.actions"
import { fetchServer } from "../api/fetch-server"
import type {
  AlertGetAllQuery,
  AlertGetOneQuery,
  AlertGetAllResponse,
  AlertGetOneResponse,
} from "@/types/features/alerts/alerts.types"

export async function getAllAlerts(query: AlertGetAllQuery) {
  return await withAuthAction<AlertGetAllResponse>(async (accessToken) => {
    const apiUrl = buildURL("/alerts", query)
    try {
      const response = await fetchServer<AlertGetAllResponse>(apiUrl, {
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

export async function getOneAlert(query: AlertGetOneQuery) {
  return await withAuthAction<AlertGetOneResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/alerts/${id}`)

    try {
      const response = await fetchServer<AlertGetOneResponse>(apiUrl, {
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
