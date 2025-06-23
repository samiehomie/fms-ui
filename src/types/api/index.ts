export * from './auth.types'

import { AuthApiTypes } from './auth.types'

export interface ApiTypes extends AuthApiTypes {}

export type ApiEndpoint = keyof ApiTypes
export type ApiRequestType<T extends ApiEndpoint> = ApiTypes[T]['request']
export type ApiResponseType<T extends ApiEndpoint> = ApiTypes[T]['response']
