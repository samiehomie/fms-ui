import { RoleType } from "../roles/role.enum"

// POST /auth/logout
export type LogoutResponse = null


// POST /auth/refresh
export interface RefreshTokenRequest {
  refreshToken: string
}

// POST /auth/refresh
export interface RefreshTokenRequest {
  refreshToken: string
}

// POST /auth/refresh
export interface RefreshTokenResponse {
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


export interface JWTAuthPayload {
  sub: number
  username: string
  role: RoleType
  companyId: number
  iat: number
  exp: number
}