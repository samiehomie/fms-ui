export * from './auth.types'

import { AuthApiTypes } from './auth.types'
import { CompanyApiTypes } from './company.types'
import { VehicleApiTypes } from './vehicle/vehicle.types'
import { UserApiTypes } from './user.types'
import { DeviceApiTypes } from './device.types'
import { VehicleTripApiTypes } from './vehicle/vehicle-trip'

export interface ApiTypes
  extends AuthApiTypes,
    CompanyApiTypes,
    VehicleApiTypes,
    UserApiTypes,
    DeviceApiTypes,
    VehicleTripApiTypes {}

export type ApiEndpoint = keyof ApiTypes
export type ApiRequestType<T extends ApiEndpoint> = ApiTypes[T]['request']
export type ApiResponseType<T extends ApiEndpoint> = ApiTypes[T]['response']
export type ApiParamsType<T extends ApiEndpoint> = ApiTypes[T]['params']
