import { DefaultPaginatedResponse } from "../common/common.types"

export interface User {
  id: number
  name: string
  username: string
  email: string
  verified: boolean
  role: {
    id: number
    name: string
  }
  company: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt: string
}

export type UsersResponse = DefaultPaginatedResponse<User>
export interface UsersPaginationParams {
  page: number
  limit: number
  verified?: boolean
  search?: string
}

export interface UsersCreateRequest {
  user: {
    name: string
    username: string
    password: string
    email: string
    role_id: number
    company_id: number
  }
}

export interface UsersVerifyRequest {
  username: string
}

export interface UsersVerifyResponse {
  message: string
  user: {
    id: number
    username: string
    name: string
    verified: boolean
  }
}

export interface UsersCreateResponse {
  message: string
}

export interface UserApiTypes {
  "GET /users": {
    params: {}
    request: {}
    response: UsersResponse
  }
  "POST /users": {
    params: {}
    request: UsersCreateRequest
    response: UsersCreateResponse
  }
  "POST /users/verify": {
    params: {}
    request: UsersVerifyRequest
    response: UsersVerifyResponse
  }
}
