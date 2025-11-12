import { VehicleApiTypes } from "./vehicles/vehicle.types"
import { VehicleTripApiTypes } from "./vehicles/vehicle-trip.types"

export interface ApiTypes extends VehicleApiTypes, VehicleTripApiTypes {}

export type ApiEndpoint = keyof ApiTypes
export type ApiRequestType<T extends ApiEndpoint> = ApiTypes[T]["request"]
export type ApiResponseType<T extends ApiEndpoint> = ApiTypes[T]["response"]
export type ApiParamsType<T extends ApiEndpoint> = ApiTypes[T]["params"]
