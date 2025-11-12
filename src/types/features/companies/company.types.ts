import type {
  CommonProperties,
  PaginationQuery,
} from "../../common/common.types"
import type { Vehicle } from "@/types/entities/vehicle.entity"
import type { Company } from "@/types/entities/company.entity"
import type { User } from "@/types/entities/user.entity"
import { CompanyType } from "@/types/features/companies/company.enum"

type CompanyData = Pick<
  Company,
  | CommonProperties
  | "name"
  | "regNumber"
  | "type"
  | "details"
  | "phone"
  | "email"
  | "website"
  | "contactPerson"
  | "contactPhone"
  | "verified"
  | "isdeleted"
>

// GET /companies
export type CompaniesGetResponse = (CompanyData & {
  vehiclesCount: number
  usersCount: number
})[]

// GET /companies
export interface CompaniesGetQuery extends PaginationQuery {
  search?: string
  type?: CompanyType
  verified?: boolean
  includeDeleted?: boolean
}

// GET /companies/{id}
export type CompanyGetResponse = CompanyData & {
  users: Pick<User, "id" | "username" | "email">[]
  vehicles: Pick<Vehicle, "id" | "plateNumber">[]
}

// GET /companies/{id}
export interface CompanyGetQuery {
  id: string
}

// POST /companies
export type CompanyCreateBody = Pick<
  Company,
  | "name"
  | "regNumber"
  | "type"
  | "details"
  | "phone"
  | "email"
  | "website"
  | "contactPerson"
  | "contactPhone"
>

// POST /companies
export type CompanyCreateResponse = CompanyGetResponse

// DELETE /companies/{id}
export interface CompanyDeleteQuery {
  id: string
}

// DELETE /companies/{id}
export type CompanyDeleteResponse = undefined

// PATCH /companies/{id}/restore
export type CompanyRestoreResponse = undefined

// PATCH /companies/{id}/restore
export interface CompanyRestoreQuery {
  id: string
}

// PATCH /companies/{id}
export type CompanyUpdateBody = CompanyCreateBody

// PATCH /companies/{id}
export type CompanyUpdateResponse = CompanyCreateResponse

// PATCH /companies/{id}
export interface CompanyUpdateQuery {
  id: string
}

// PATCH /companies/{id}/verify
export interface CompanyVerifyQuery {
  id: string
}

// PATCH /companies/{id}/verify
export interface CompanyVerifyBody {
  verified: boolean
}

// PATCH /companies/{id}/verify
export type CompanyVerifyResponse = CompanyGetResponse

// GET /companies/{id}/vehicles
export interface CompanyVehiclesQuery extends PaginationQuery {
  id: string
  search?: string
  includeDeleted?: boolean
}

// GET /companies/{id}/vehicles
export type CompanyVehiclesReponse = Pick<
  Vehicle,
  | CommonProperties
  | "vehicleName"
  | "plateNumber"
  | "brand"
  | "manufactureYear"
  | "model"
  | "canBitrate"
  | "fuelType"
  | "gearType"
  | "numTire"
  | "isdeleted"
>[]
