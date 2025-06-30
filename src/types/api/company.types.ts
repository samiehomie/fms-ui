import { PaginatedResponseWithKey } from './api.common'
export interface Address {
  id: number
  created_at: string
  updated_at: string
  street: string
  city: string
  state: string
  country: string
  postal_code: string
  latitude: string
  longitude: string
}

export interface Company {
  id: number
  created_at: string
  updated_at: string
  name: string
  reg_number: string
  type: string
  details: string
  phone: string
  email: string
  website: string
  contact_person: string
  contact_phone: string
  verified: boolean
  isdeleted: boolean
  deletedAt: null | string
  address: Address
}

export interface CompaniesPaginationParams {
  page: number
  limit: number
  verified?: boolean
  type?: string
  search?: string
}

export type CompaniesResponse = PaginatedResponseWithKey<Company, 'companies'>

export interface CompanyApiTypes {
  'GET /companies': {
    request: {}
    response: CompaniesResponse
  }
}
