import { ApiResponse } from './api.common'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  expires_in: number
  user: {
    id: number
    name: string
    username: string
    email: string
    role: {
      id: number
      name: string
      description: string
    }
  }
}

export interface AuthApiTypes {
  'POST /auth/login': {
    request: LoginRequest
    response: ApiResponse<LoginResponse>
  }
}
