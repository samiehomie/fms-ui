"use server"

import { buildURL } from "../utils/build-url"
import { withAuthAction } from "./auth.actions"
import { fetchServer } from "../api/fetch-server"
import type {
  DashboardOverviewResponse,
  DashboardOverviewQuery,
} from "@/types/features/dashboard/dashboard.types"

export async function getOverview(query?: DashboardOverviewQuery) {
  return await withAuthAction<DashboardOverviewResponse>(
    async (accessToken) => {
      const apiUrl = buildURL("/dashboards/overview", query)
      try {
        const response = await fetchServer<DashboardOverviewResponse>(apiUrl, {
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
    },
  )
}