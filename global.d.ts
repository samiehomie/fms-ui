import { logger as loggerUtils } from '@/lib/utils'

declare global {
  var logger: typeof loggerUtils
}

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

export {}
