import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ServerActionResult } from "@/types/common/common.types"
import { HTTPError } from "@/lib/api/fetch-server"
import type { AlertGetAllQuery } from "@/types/features/alerts/alerts.types"
import { getAllAlerts, getOneAlert } from "../actions/alert.actions"

export function useAllAlerts(query: AlertGetAllQuery) {
  return useQuery({
    queryKey: ["alerts", query],
    queryFn: async () => {
      const result = await getAllAlerts(query)

      if (!result.success) {
        throw new HTTPError(result.error.status ?? 500, result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}
