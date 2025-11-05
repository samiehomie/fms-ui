import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ServerActionResult } from "@/types/common/common.types"
import { HTTPError } from "../route/route.heplers"
import type { DashboardOverviewQuery } from "@/types/features/dashboard/dashboard.types"
import { getOverview } from "../actions/dashboard.actions"

export function useOverview(query?: DashboardOverviewQuery) {
  return useQuery({
    queryKey: ["dashboard", "overview", query],
    queryFn: async () => {
      const result = await getOverview(query)

      if (!result.success) {
        throw new HTTPError(result.error.status ?? 500, result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}
