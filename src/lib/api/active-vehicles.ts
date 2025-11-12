import { fetchServer } from "@/lib/api/fetch-server"
import type {
  AIResultsResponse,
  TPMSResultsResponse,
  VehicleDataParams,
} from "@/types/features/vehicles/vehicle.types"
import { ApiSuccessResponse } from "@/types/common/api.types"

export const activeVehiclesApi = {
  getAIResults: async (
    vehicleId: string,
    params: VehicleDataParams,
  ): Promise<ApiSuccessResponse<AIResultsResponse>> => {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      start_date: params.start_date,
      end_date: params.end_date,
    })

    const response = await fetchServer<ApiSuccessResponse<AIResultsResponse>>(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/data/ai-results/vehicle/${vehicleId}?${searchParams}`,
    )

    if (!response.success) {
      throw new Error("Failed to fetch AI results")
    }

    return response.data
  },

  getTPMSResults: async (
    vehicleId: string,
    params: VehicleDataParams,
  ): Promise<ApiSuccessResponse<TPMSResultsResponse>> => {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      start_date: params.start_date,
      end_date: params.end_date,
    })

    const response = await fetchServer<ApiSuccessResponse<TPMSResultsResponse>>(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/data/tpms-results/vehicle/${vehicleId}?${searchParams}`,
    )

    if (!response.success) {
      throw new Error("Failed to fetch TPMS results")
    }

    return response.data
  },
}
