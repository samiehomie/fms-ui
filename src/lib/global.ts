import { logger as loggerUtils } from '@/lib/utils'

// 서버 환경 (Node.js, SSR)
if (typeof globalThis !== 'undefined') {
  globalThis.logger = loggerUtils
}

// 클라이언트 환경 (브라우저)
if (typeof window !== 'undefined') {
  globalThis.logger = loggerUtils
  ;(window as any).logger = loggerUtils
}
