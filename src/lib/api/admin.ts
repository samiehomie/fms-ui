import { buildURL } from './utils'
import { fetchJson } from '@/lib/api/fetch'
import { ApiResponseType } from '@/types/api'

export const getCompanies = async () => {
  const apiUrl = buildURL('/admin/companies/list')
  const data = fetchJson
}
