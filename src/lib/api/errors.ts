// HTTP 요청 실패 시 발생하는 커스텀 에러 클래스
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly serverMessage?: string,
    public readonly details?: any,
  ) {
    super(`HTTP 요청 실패 (상태 코드: ${status})`)
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}

// 네트워크 관련 에러 타입
export interface NetworkError {
  type: 'network' | 'timeout' | 'invalid-json'
  message: string
  status?: number
}
