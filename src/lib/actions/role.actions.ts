"use server"

import { buildURL } from "../utils/build-url"
import { withAuthAction } from "./auth.actions"
import { fetchServer } from "../api/fetch-server"
import type {
  RoleGetQuery,
  RoleGetResponse,
  RolesGetQuery,
  RolesGetResponse,
} from "@/types/features/roles/role.types"

// TODO 반복되는 함수 헬퍼 함수로 만들기

export async function getAllRoleList() {
  try {
    const apiUrl = buildURL(`/roles/list`)
    const response = await fetchServer<RolesGetResponse>(apiUrl, {
      method: "GET",
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
}

export async function getAllRoles(query: RolesGetQuery) {
  return await withAuthAction<RolesGetResponse>(async (accessToken) => {
    const apiUrl = buildURL(`/roles`, query)

    try {
      const response = await fetchServer<RolesGetResponse>(apiUrl, {
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

export async function getRole(query: RoleGetQuery) {
  return await withAuthAction<RoleGetResponse>(async (accessToken) => {
    const { id } = query
    const apiUrl = buildURL(`/roles/${id}`)

    try {
      const response = await fetchServer<RoleGetResponse>(apiUrl, {
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
