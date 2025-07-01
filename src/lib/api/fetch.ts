import { HttpError, NetworkError } from './errors'

export type FetchJsonError = { success: false; error: HttpError | NetworkError }
/** fetch 응답 타입 */
export type FetchJsonResult<T = any> =
  | { success: true; data: T }
  | FetchJsonError

/**
 * 타입 안전한 JSON fetch 유틸리티 함수
 * @param input - fetch 입력 (RequestInfo)
 * @param init - fetch 초기화 옵션 (기본 timeout: 10초)
 * @returns 성공 시 데이터, 실패 시 상세 에러 정보를 포함하는 객체
 *
 * @example
 * const result = await fetchJson<User[]>('/api/users')
 * if (result.success) {
 *   // result.data 사용
 * } else {
 *   // result.error 처리
 * }
 */
export async function fetchJson<T = unknown>(
  input: RequestInfo,
  init?: RequestInit & { timeout?: number; revalidate?: number | false },
): Promise<FetchJsonResult<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(
    () => controller.abort(),
    init?.timeout ?? 10_000,
  )

  try {
    const fetchOptions: RequestInit & { next?: { revalidate?: number } } = {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
      next:
        typeof init?.revalidate === 'number'
          ? { revalidate: init.revalidate }
          : undefined,
    }

    // revalidate 설정 처리
    if (init?.revalidate !== undefined) {
      if (init.revalidate === false) {
        fetchOptions.cache = 'no-store' // 캐싱 비활성화
      } else {
        fetchOptions.next = { revalidate: init.revalidate }
      }
    } else {
      fetchOptions.next = { revalidate: 0 } // 기본값 - 캐싱 비활성화
    }

    const response = await fetch(input, fetchOptions)

    clearTimeout(timeoutId)

    // Content-Type 검증
    const contentType = response.headers.get('Content-Type')
    if (!contentType?.includes('application/json')) {
      return {
        success: false,
        error: {
          type: 'invalid-json',
          message: '서버가 유효한 JSON을 반환하지 않았습니다',
        },
      }
    }

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: new HttpError(
          response.status,
          data.message || '알 수 없는 서버 에러',
          data.details,
        ),
      }
    }

    return { success: true, data: data as T }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        error: {
          type: 'timeout',
          message: `요청 시간 초과 (${init?.timeout ?? 10}초)`,
        },
      }
    }

    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: {
          type: 'invalid-json',
          message: 'JSON 파싱에 실패했습니다',
        },
      }
    }

    return {
      success: false,
      error: {
        type: 'network',
        message:
          error instanceof Error ? error.message : '알 수 없는 네트워크 에러',
      },
    }
  }
}
