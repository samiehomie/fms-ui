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

export interface CompanyByIdResponse {
  company: {
    id: number
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
    deletedAt: string | null
    created_at: string
    updated_at: string
    address: {
      id: number
      street: string
      city: string
      state: string
      country: string
      postal_code: string
      latitude: number
      longitude: number
      created_at: string
      updated_at: string
    }
    users: {
      id: number
      username: string
      email: string
      role: string
    }[]
    vehicles: {
      id: number
      plate_number: string
    }[]
  }
}

export interface CompaniesCreateRequest {
  company: {
    name: string
    reg_number: string
    type: string
    details: string
    phone: string
    email: string
    website: string
    contact_person: string
    contact_phone: string
    address: {
      street: string
      city: string
      state: string
      country: string
      postal_code: string
      latitude: number
      longitude: number
    }
  }
}

export interface CompaniesCreateResponse {
  message: string
  company: Company
}

export interface CompaniesDeleteRequest {
  id: number
}
export interface CompaniesDeleteResponse {
  message: string
}

export interface CompaniesVerifyRequest {
  verified: boolean
}

export interface CompaniesVerifyResponse {
  message: string
  company: {
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
    deletedAt: string | null
  }
}

export interface CompanyApiTypes {
  'POST /companies': {
    request: CompaniesCreateRequest
    response: CompaniesCreateResponse
  }
  'GET /companies': {
    request: {}
    response: CompaniesResponse
  }
  'GET /companies/id': {
    request: {}
    response: CompanyByIdResponse
  }
  'DELETE /companies': {
    request: CompaniesDeleteRequest
    response: CompaniesDeleteResponse
  }
  'PUT /companies': {
    request: CompaniesCreateRequest
    response: CompaniesCreateResponse
  }
  'PATCH /companies/id': {
    request: CompaniesVerifyRequest
    response: CompaniesVerifyResponse
  }
}
