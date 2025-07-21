import { logger as loggerUtils } from '@/lib/utils'
declare global {
  var logger: typeof loggerUtils
}

export {}
