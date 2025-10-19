import type { User } from '@/types/entities/user.entity'
import type { Company } from '@/types/entities/company.entity'
import type { Role } from '@/types/entities/role.entity'
import type { CommonProperties, PaginationQuery } from '../common.types'

type UserData = Pick<
  User,
  CommonProperties | 'name' | 'username' | 'email' | 'verified' | 'isdeleted'
> & {
  company: Pick<Company, 'id' | 'name' | 'regNumber'>
  role: Pick<Role, 'id' | 'name'>
}

// GET /users
export type UsersGetResponse = UserData[]

// GET /users
export interface UsersGetQuery extends PaginationQuery {
  search?: string
  includeDeleted?: boolean
  verified?: boolean
}
