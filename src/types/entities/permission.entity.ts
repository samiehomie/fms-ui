import { BaseEntity } from './base.entity'
import { Role } from './role.entity'

export interface Permission extends BaseEntity {
  name: string

  description: string

  roles: Role[]
}
