export interface Company {
  id: number
  created_at: string
  updated_at: string
  name: string
  reg_number: string
  type: string
  details: string
  verified: boolean
}

export type CompaniesResponse = Company[]

export interface AdminApiTypes {
  'GET /admin/companies/list': {
    request: {}
    response: CompaniesResponse
  }
}
