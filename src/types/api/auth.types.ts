import { Role as RoleEnum } from '@/constants/enums/role.enum'
export interface LoginRequest {
  username: string
  password: string
}

export interface Role {
  name: string
  description: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  expires_in: number
  user: {
    id: number
    name: string
    username: string
    email: string
    role: {
      name: RoleEnum
      description: string
    }
    ip: string
  }
}

export interface RefreshTokenRequest {
  accessToken: string
  refreshToken: string
}

// TODO: API - user에 IP가 빠져서 옴
export type RefreshTokenResponse = LoginResponse

export interface JWTAuthPayload {
  id: number
  name: string
  username: string
  email: string
  role_id: number
  role: RoleEnum
  company: string
  ip: string
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
