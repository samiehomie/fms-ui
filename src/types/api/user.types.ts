import { PaginatedResponseWithKey } from './api.common'

export interface User {
  id: number
  name: string
  username: string
  email: string
  verified: boolean
  role_id: {
    id: number
    name: string
  }
  company_id: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

export type UsersResponse = PaginatedResponseWithKey<User, 'users'>
export interface UsersPaginationParams {
  page: number
  limit: number
  verified: boolean
  search: string
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
  'GET /users': {
    params: {}
    request: {}
    response: UsersResponse
  }
  'POST /users': {
    params: {}
    request: UsersCreateRequest
    response: UsersCreateResponse
  }
  'POST /users/verify': {
    params: {}
    request: UsersVerifyRequest
    response: UsersVerifyResponse
  }
}
