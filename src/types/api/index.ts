export * from './auth.types'

import { AuthApiTypes } from './auth.types'
import { CompanyApiTypes } from './company.types'
import { VehicleApiTypes } from './vehicle.types'
import { UserApiTypes } from './user.types'
import { DeviceApiTypes } from './device.types'

export interface ApiTypes
  extends AuthApiTypes,
    CompanyApiTypes,
    VehicleApiTypes,
    UserApiTypes,
    DeviceApiTypes {}

export type ApiEndpoint = keyof ApiTypes
export type ApiRequestType<T extends ApiEndpoint> = ApiTypes[T]['request']
export type ApiResponseType<T extends ApiEndpoint> = ApiTypes[T]['response']
