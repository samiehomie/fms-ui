import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
  skipToken,
} from "@tanstack/react-query"
import { vehiclesApi } from "@/lib/api/vehicle"
import type {
  // VehicleTripsByTripIdResponse,
  VehiclesGetQuery,
  VehicleCreateBody,
  VehicleCreateResponse,
  VehicleDeleteQuery,
  VehicleDeleteResponse,
  VehicleRestoreQuery,
  VehicleRestoreResponse,
  // VehicleUpdateQuery,
  VehicleUpdateBody,
  VehicleUpdateResponse,
  VehicleTripsQuery,
  // VehicleTripsResponse,
} from "@/types/features/vehicles/vehicle.types"
import {
  // ApiResponseType,
  // ApiRequestType,
  ApiParamsType,
} from "@/types/features"
import { toast } from "sonner"
import { useMemo, useEffect } from "react"
import {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  restoreVehicle,
} from "../actions/vehicle.actions"
import {
  getTripGpsDetails,
  getTripTpmsDetails,
  getAllTrips,
} from "../actions/trip.actions"
import { getVehicleTrips } from "../actions/vehicle-trip.actions"
import { socketManager } from "../socket-manager"
import type { ServerActionResult } from "@/types/common/common.types"
import {
  TripGpsDetailsResponse,
  TripTpmsDetailsQuery,
  TripsGetQuery,
  // TripTpmsDetailsResponse,
} from "@/types/features/trips/trip.types"
import { HTTPError } from "../route/route.heplers"

export function useAllVehicles(query: VehiclesGetQuery, id?: string) {
  return useQuery({
    queryKey: ["vehicles", query],
    queryFn:
      id === undefined
        ? async () => {
            const result = await getAllVehicles(query)

            if (!result.success) {
              throw new HTTPError(
                result.error.status ?? 500,
                result.error.message,
              )
            }

            return result
          }
        : skipToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useVehicleById(id: string) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const result = await getVehicle({ id })

      if (!result.success) {
        throw new HTTPError(result.error.status ?? 500, result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<VehicleCreateResponse>,
    Error,
    VehicleCreateBody
  >({
    mutationFn: async (newVehicle) => {
      const res = await createVehicle(newVehicle)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      })
      if (res.success) {
        toast.success("A new vehicle added", {
          description: `plate number: ${res.data.plateNumber}`,
          position: "bottom-center",
        })
      }
    },
    onError: (error) => {
      logger.log(error)
      toast.error("Adding a new vehicle failed.", {
        position: "bottom-center",
        description: error.message,
      })
    },
  })
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<VehicleDeleteResponse>,
    Error,
    VehicleDeleteQuery
  >({
    mutationFn: async (deleteParams) => {
      const res = await deleteVehicle(deleteParams)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      })
      if (res.success) {
        toast.success("A vehicle deleted.", {
          position: "bottom-center",
        })
      }
    },
    onError: (error) => {
      toast.error("Deleting a vehicle failed.", {
        position: "bottom-center",
      })
      logger.error("Delete vehicle error:", error)
    },
  })
}

export function useUpdateVehicle(id: string) {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<VehicleUpdateResponse>,
    Error,
    VehicleUpdateBody
  >({
    mutationFn: async (vehicle) => {
      const res = await updateVehicle({ id }, vehicle)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      })
      queryClient.invalidateQueries({
        queryKey: ["vehicle", id],
      })
      if (res.success) {
        toast.success("Vehicle updated successfully", {
          description: `plate number: ${res.data.plateNumber}`,
          position: "bottom-center",
        })
      }
    },
    onError: (error) => {
      toast.error("Adding a new vehicle failed.", {
        position: "bottom-center",
        description: error.message,
      })
    },
  })
}

export function useRestoreVehicle() {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<VehicleRestoreResponse>,
    Error,
    VehicleRestoreQuery
  >({
    mutationFn: async (restoreParams) => {
      const res = await restoreVehicle(restoreParams)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      })
      if (res.success) {
        toast.success(res.message ?? "Vehicle restored.", {
          position: "bottom-center",
        })
      }
    },
    onError: (error) => {
      toast.error("Restoring a vehicle failed.", {
        position: "bottom-center",
      })
      logger.error("Restore vehicle error:", error)
    },
  })
}

export function useVehicleAllTrips(query: VehicleTripsQuery) {
  return useQuery({
    queryKey: ["trips", query],
    queryFn:
      query.id !== undefined
        ? async () => {
            const result = await getVehicleTrips(query)

            if (!result.success) {
              throw new HTTPError(
                result.error.status ?? 500,
                result.error.message,
              )
            }

            return result
          }
        : skipToken,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTripGpsDetailsBatch(tripIds: number[]) {
  // tripIds가 비어있으면 빈 배열, 아니면 쿼리 배열 생성
  const queryConfigs = useMemo(() => {
    if (tripIds.length === 0) {
      return []
    }

    return tripIds.map((id) => ({
      queryKey: ["trip gps", id] as const,
      queryFn: async () => {
        const result = await getTripGpsDetails({ id })

        if (!result.success) {
          throw new HTTPError(result.error.status ?? 500, result.error.message)
        }

        return result
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    }))
  }, [tripIds])

  const queries = useQueries({
    queries: queryConfigs,
  })

  // tripId와 결과를 매핑하여 객체로 반환
  const mappedData = useMemo(() => {
    const result: Record<number, TripGpsDetailsResponse> = {}

    tripIds.forEach((tripId, index) => {
      const query = queries[index]
      if (query?.data && query.data.data) {
        result[tripId] = query.data.data
      }
    })

    return result
  }, [tripIds, queries])

  // 추가 유틸리티 정보들
  const isLoading = queries.some((query) => query.isLoading)
  const isError = queries.some((query) => query.isError)
  const errors = queries
    .filter((query) => query.isError)
    .map((query) => query.error)
  const isSuccess = queries.every((query) => query.isSuccess)

  return {
    data: mappedData,
    queries,
    isLoading,
    isError,
    errors,
    isSuccess,
  }
}

export function useTripTpmsDetails(query: TripTpmsDetailsQuery) {
  return useQuery({
    queryKey: ["trip tpms", query],
    queryFn: async () => {
      const result = await getTripTpmsDetails(query)

      if (!result.success) {
        throw new HTTPError(result.error.status ?? 500, result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useAllVehicleTripsPaginated(
  params: ApiParamsType<"GET /vehicles/{id}/trips">,
) {
  return useQuery({
    queryKey: ["all trips", params],
    queryFn: () => vehiclesApi.getAllVehicleTrips(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

interface Vehicle {
  id: number
  plate_number: string
  lat: number
  lng: number
  heading: number
}

export function useLiveVehicles() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const eventSource = new EventSource("/api/vehicles/live")
    eventSource.onmessage = (event) => {
      const updates: Vehicle[] = JSON.parse(event.data)
      // Update TanStack Query cache directly
      queryClient.setQueryData<Map<number, Vehicle>>(
        ["live-vehicles"],
        (oldData) => {
          const newData = oldData ? new Map(oldData) : new Map()
          updates.forEach((vehicle) => {
            newData.set(vehicle.id, vehicle)
          })
          return newData
        },
      )
    }

    // Basic error handling with reconnection logic
    eventSource.onerror = () => {
      // Here you would implement exponential backoff for retries
      console.error(
        "SSE connection error. Closing and will be retried by browser.",
      )
      eventSource.close()
    }

    // Cleanup on component unmount
    return () => {
      eventSource.close()
    }
  }, [queryClient])

  return useQuery<Map<number, Vehicle>>({
    queryKey: ["live-vehicles"],
    initialData: new Map(),
    staleTime: Number.POSITIVE_INFINITY, // Data is live, no need to refetch via standard means
  })
}

export function useAllTrips(query: TripsGetQuery) {
  const queryClient = useQueryClient()

  // WebSocket 이벤트를 통해 캐시 무효화
  useEffect(() => {
    // trip:started 이벤트가 발생하면 캐시 무효화
    const unsubscribe = socketManager.addEventListener(
      "trip:started",
      () => {
        logger.info("Trip started detected, invalidating trips cache")
        queryClient.invalidateQueries({
          queryKey: ["trips", query],
        })
      },
    )

    return () => {
      unsubscribe()
    }
  }, [query, queryClient])

  return useQuery({
    queryKey: ["trips", query],
    queryFn: async () => {
      const result = await getAllTrips(query)

      if (!result.success) {
        throw new HTTPError(result.error.status ?? 500, result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
