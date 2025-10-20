import type { CommonProperties, PaginationQuery } from '../common.types'
import type { Role } from '@/types/entities/role.entity'
import type { Permission } from '@/types/entities/permission.entity'

type RoleData = Pick<Role, CommonProperties | 'name' | 'description'>

// GET /roles
export type RolesGetResponse = (RoleData & {
  usersCount: number
  permissionsCount: number
})[]

// GET /roles
export interface RolesGetQuery extends PaginationQuery {
  search?: string
}

// GET /roles/{id}
export type RoleGetResponse = RoleData & {
  usersCount: number
  permissions: Pick<Permission, 'id' | 'name'>
}

// GET /roles/{id}
export interface RoleGetQuery {
  id: string
}
