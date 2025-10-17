import { RoleType } from '@/constants/enums/role.enum'
import type { PaginationMeta } from './common.types'

export type ServerActionError = {
  message: string
  status?: number
  details?: unknown
}

export type ServerActionResult<T = any> =
  | { success: true; data: T; pagination?: PaginationMeta; message?: string }
  | { success: false; error: ServerActionError }
export interface LoginRequest {
  username: string
  password: string
}

export interface Role {
  name: string
  description: string
}

export interface LoginResponse {
  user: {
    id: number
    username: string
    name: string
    email: string
    role: RoleType
    company: string
  }
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// TODO: API - user에 IP가 빠져서 옴
export type RefreshTokenResponse = LoginResponse

export interface JWTAuthPayload {
  sub: number
  username: string
  role: RoleType
  companyId: number
  iat: number
  exp: number
}

export interface JWTRefreshPayload {
  sub: number
  type: 'refresh'
  iat: number
  exp: number
}

export interface AuthApiTypes {
  'POST /auth/login': {
    params: {}
    request: LoginRequest
    response: LoginResponse
  }
  'POST /auth/refresh': {
    params: {}
    request: RefreshTokenRequest
    response: RefreshTokenResponse
  }
  'POST /auth/logout': {
    params: {}
    request: {}
    response: {}
  }
}
