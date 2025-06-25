import { buildURL } from './utils'
import { fetchJson } from '@/lib/api/fetch'
import { getAuthServer } from '@/lib/actions/auth'
import type { ApiResponseType } from '@/types/api'
import { logger } from '../utils'

export const getCompanies = async (): Promise<
  ApiResponseType<'GET /admin/companies/list'>
> => {
  const { authToken } = await getAuthServer()
  if (!authToken) {
    logger.error('GET /admin/companies/list 실패: 유저 토큰 없음')
    throw new Error(`회사 목록을 불러올 수 없습니다: 유저 토큰 없음`)
  }
  const apiUrl = buildURL('/admin/companies/list')
  const response = await fetchJson<
    ApiResponseType<'GET /admin/companies/list'>
  >(apiUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.success) {
    logger.error('GET /admin/companies/list 실패: ', response.error)
    throw new Error(`회사 목록을 불러올 수 없습니다: ${response.error}`)
  }
  return response.data
}
