import { FetchServerResult, FetchError } from '@/lib/api/fetch-server'

export type ApiResponse<T = any> = FetchServerResult<T>

export type ApiError = FetchError

export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 동적 속성명을 지원하는 페이지네이션 응답 타입
export type PaginatedResponse<T, K extends string = 'data'> = {
  [key in K]: T[]
} & {
  pagination: PaginationMeta
}

// 일반적인 사용을 위한 기본 페이지네이션 응답
export interface DefaultPaginatedResponse<T>
  extends PaginatedResponse<T, 'data'> {
  data: T[]
  pagination: PaginationMeta
}

// 특정 키를 지정한 페이지네이션 응답 생성 헬퍼 타입
export type PaginatedResponseWithKey<T, K extends string> = {
  [key in K]: T[]
} & {
  pagination: PaginationMeta
}

// HTTP 메서드별 타입 헬퍼
export type ApiRequest<T = any> = T
export type ApiGetResponse<T> = ApiResponse<T>
export type ApiPostRequest<T> = ApiRequest<T>
export type ApiPostResponse<T> = ApiResponse<T>
export type ApiPutRequest<T> = ApiRequest<T>
export type ApiPutResponse<T> = ApiResponse<T>
export type ApiDeleteResponse = ApiResponse<null>

// 페이지네이션 응답을 위한 추가 헬퍼 타입들
export type ApiGetPaginatedResponse<T, K extends string = 'data'> = ApiResponse<
  PaginatedResponse<T, K>
>

export type ApiGetDefaultPaginatedResponse<T> = ApiResponse<
  DefaultPaginatedResponse<T>
>

export interface PaginationQuery {
  page?: number
  limit?: number
}

export interface CommonData {
  id: number
  createdAt: string
  updatedAt: string
}


export type CommonProperties = 'id' | 'createdAt' | 'updatedAt'

export type ServerActionError = {
  message: string
  status?: number
  details?: unknown
}

export type ServerActionResult<T = any> =
  | { success: true; data: T; pagination?: PaginationMeta; message?: string }
  | { success: false; error: ServerActionError }