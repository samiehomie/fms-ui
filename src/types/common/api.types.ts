// 기본 API 응답 타입
export interface BaseApiResponse {
  success: boolean
  message?: string
  timestamp: string
}

// 성공 응답 타입
export interface ApiSuccessResponse<T = any> extends BaseApiResponse {
  success: true
  data: T
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasNext?: boolean
    hasPrev?: boolean
  }
}

// 에러 응답 타입
export interface ApiErrorResponse extends BaseApiResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, any>
    stack?: string // 개발 환경에서만
  }
}

// 통합 API 응답 타입
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

// 페이지네이션을 위한 메타 타입
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// 페이지네이션 응답 타입
export interface ApiPaginatedResponse<T = any> extends ApiSuccessResponse<T[]> {
  meta: PaginationMeta
}

// 에러 코드 상수
export enum API_ERROR_CODES {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
}

export type ApiErrorCode = keyof typeof API_ERROR_CODES

// HTTP 상태 코드 매핑
export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export interface FetchError extends Error {
  statusCode?: number
  statusText?: string
  info?: any
}
