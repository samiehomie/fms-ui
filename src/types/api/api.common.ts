import { FetchJsonResult } from '@/lib/api/fetch'

export type ApiResponse<T = any> = FetchJsonResult<T>

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// HTTP 메서드별 타입 헬퍼
export type ApiRequest<T = any> = T
export type ApiGetResponse<T> = ApiResponse<T>
export type ApiPostRequest<T> = ApiRequest<T>
export type ApiPostResponse<T> = ApiResponse<T>
export type ApiPutRequest<T> = ApiRequest<T>
export type ApiPutResponse<T> = ApiResponse<T>
export type ApiDeleteResponse = ApiResponse<null>
