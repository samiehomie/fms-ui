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
  expires_in: number
  user: {
    id: number
    name: string
    username: string
    email: string
    role: Role
  }
}

export interface RefreshTokenRequest {
  token: string
  // TODO: API 구현 예정 현재는 빈 문자열 전달
  refresh_token: string
}

export interface RefreshTokenResponse {
  token: string
  expires_in: number
  user: {
    id: number
    name: string
    username: string
    email: string
    role: Role
  }
}

export interface JWTAuthPayload {
  id: number
  name: string
  username: string
  email: string
  role_id: number
  role: string
  company: string
  iat: number
  exp: number
}

export interface AuthApiTypes {
  'POST /auth/login': {
    request: LoginRequest
    response: LoginResponse
  }
  'POST /auth/refresh': {
    request: RefreshTokenRequest
    response: RefreshTokenResponse
  }
}
