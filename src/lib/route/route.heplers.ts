import { NextResponse } from "next/server"
import type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiErrorCode,
} from "@/types/common/api.types"
import { HTTP_STATUS, API_ERROR_CODES } from "@/types/common/api.types"
import type { PaginationMeta } from "@/types/common/common.types"

export class HTTPError extends Error {
  statusCode: HTTP_STATUS

  constructor(statusCode: HTTP_STATUS, message?: string) {
    super(message)
    this.statusCode = statusCode
    this.name = "HTTPError"

    // TypeScript에서 instanceof를 정확하게 하기 위해
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

// 성공 응답 헬퍼
export function createSuccessResponse(
  data: any,
  pagination?: PaginationMeta,
  message?: string,
  status: number = HTTP_STATUS.OK,
): NextResponse<ApiSuccessResponse<any>> {
  return NextResponse.json(
    {
      success: true,
      data,
      pagination,
      message,
      timestamp: new Date().toISOString(),
    },
    { status },
  )
}

// 에러 응답 헬퍼
export function createErrorResponse(
  code: string,
  message: string,
  status?: number,
): NextResponse<ApiErrorResponse> {
  const statusCode = status || 500

  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(process.env.NODE_ENV === "development" && {
          stack: new Error().stack,
        }),
      },
      timestamp: new Date().toISOString(),
    },
    { status: statusCode },
  )
}

// 에러 코드에 따른 HTTP 상태 코드 매핑
function getStatusCodeByErrorCode(code: ApiErrorCode): number {
  const mapping: Record<ApiErrorCode, number> = {
    VALIDATION_ERROR: HTTP_STATUS.BAD_REQUEST,
    UNAUTHORIZED: HTTP_STATUS.UNAUTHORIZED,
    FORBIDDEN: HTTP_STATUS.FORBIDDEN,
    NOT_FOUND: HTTP_STATUS.NOT_FOUND,
    INTERNAL_ERROR: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    RATE_LIMIT_EXCEEDED: HTTP_STATUS.TOO_MANY_REQUESTS,
    SERVICE_UNAVAILABLE: HTTP_STATUS.SERVICE_UNAVAILABLE,
  }

  return mapping[code] || HTTP_STATUS.INTERNAL_SERVER_ERROR
}

// 페이지네이션 응답 헬퍼
// export function createPaginatedResponse<T>(
//   data: T[],
//   total: number,
//   page: number,
//   limit: number,
//   message?: string,
// ) {
//   const totalPages = Math.ceil(total / limit)

//   return createSuccessResponse(data, message, {
//     total,
//     page,
//     limit,
//     totalPages,
//     hasNext: page < totalPages,
//     hasPrev: page > 1,
//   })
// }
