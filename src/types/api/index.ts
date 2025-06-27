export * from './auth.types'

import { AuthApiTypes } from './auth.types'
import { CompanyApiTypes } from './company.types'

export interface ApiTypes extends AuthApiTypes, CompanyApiTypes {}

export type ApiEndpoint = keyof ApiTypes
export type ApiRequestType<T extends ApiEndpoint> = ApiTypes[T]['request']
export type ApiResponseType<T extends ApiEndpoint> = ApiTypes[T]['response']
