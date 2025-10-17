import { BaseEntity } from './base.entity'
import { User } from './user.entity'
import { Permission } from './permission.entity'
import { RoleType } from '@/constants/enums/role.enum'

export interface Role extends BaseEntity {
  name: RoleType

  description: string

  permissions: Permission[]

  users: User[]
}
