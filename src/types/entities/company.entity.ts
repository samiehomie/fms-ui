import { BaseEntity } from "./base.entity"
import { User } from "./user.entity"
import { Vehicle } from "./vehicle.entity"
import { Address } from "./address.entity"
import { CompanyType } from "@/types/features/companies/company.enum"

export interface Company extends BaseEntity {
  name: string

  regNumber: string

  type: CompanyType

  details: string

  phone: string

  email: string

  website: string

  contactPerson: string

  contactPhone: string

  verified: boolean

  isdeleted: boolean

  address: Address

  users: User[]

  vehicles: Vehicle[]
}
