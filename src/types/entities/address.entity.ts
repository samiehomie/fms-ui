import { BaseEntity } from './base.entity'
import { Company } from './company.entity'


export interface Address extends BaseEntity {
  street: string

  city: string

  state: string

  country: string

  postalCode: string

  latitude: number

  longitude: number

  company: Company
}
