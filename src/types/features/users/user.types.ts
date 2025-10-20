import type { User } from '@/types/entities/user.entity'
import type { Company } from '@/types/entities/company.entity'
import type { Role } from '@/types/entities/role.entity'
import type { CommonProperties, PaginationQuery } from '../common.types'

type UserData = Pick<
  User,
  CommonProperties | 'name' | 'username' | 'email' | 'verified' | 'isdeleted'
>

// GET /users
export type UsersGetResponse = (UserData & {
  company: Pick<Company, 'id' | 'name' | 'regNumber'>
  role: Pick<Role, 'id' | 'name'>
})[]

// GET /users
export interface UsersGetQuery extends PaginationQuery {
  search?: string
  includeDeleted?: boolean
  verified?: boolean
}

// /users/{id}
export type UserGetResponse = UserData & {
  company: Pick<
    Company,
    | 'id'
    | 'name'
    | 'regNumber'
    | 'type'
    | 'details'
    | 'phone'
    | 'email'
    | 'website'
    | 'verified'
    | 'isdeleted'
  >
  role: Pick<Role, 'id' | 'name'>
}

// GET /users/{id}
export interface UserGetQuery {
  id: string
}

// POST /users
export type UserCreateBody = Pick<
  User,
  'username' | 'email' | 'name' | 'password'
> & {
  companyId: number
  roleId: number
}

// POST /users
export type UserCreateResponse = UserGetResponse

// PATCH /users/{id}/verify
export interface UserVerifyQuery {
  id: string
}

// PATCH /users/{id}/verify
export interface UserVerifyBody {
  verified: boolean
}

// PATCH /companies/{id}/verify
export type UserVerifyResponse = UserGetResponse
