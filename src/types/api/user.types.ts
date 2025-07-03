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
}

export interface UserApiTypes {
  'GET /users': {
    request: {}
    response: UsersResponse
  }
}
