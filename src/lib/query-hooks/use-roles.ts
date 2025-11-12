import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  RolesGetQuery,
  RoleGetResponse,
  RoleGetQuery,
  RolesGetResponse,
} from '@/types/features/roles/role.types'
import { getAllRoles, getRole, getAllRoleList } from '../actions/role.actions'
import { HTTPError } from "@/lib/api/fetch-server"


export function useAllRoleList() {
  return useQuery({
    queryKey: ["role list"],
    queryFn: async () => {
      const result = await getAllRoleList()

      if (!result.success) {
        throw new HTTPError(
          result?.error?.status ?? 500,
          result?.error?.message,
        )
      }

      return result.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useAllRoles(query: RolesGetQuery) {
  return useQuery({
    queryKey: ['roles', query],
    queryFn: async () => {
      const result = await getAllRoles(query)

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useRoleById(id: string) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: async () => {
      const result = await getRole({ id })

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}
