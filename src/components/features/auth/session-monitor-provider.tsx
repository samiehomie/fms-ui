'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SessionExpiredError } from '@/lib/api/fetch-client'
import { logOutAction } from '@/lib/actions/auth'

export function SessionMonitorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const sessionExpiredHandled = useRef(false)

  useEffect(() => {
    // Tanstack Query 전역 에러 핸들러
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'observerResultsUpdated') {
        const error = event.query.state.error

        if (
          error instanceof SessionExpiredError &&
          !sessionExpiredHandled.current
        ) {
          handleSessionExpired(error.message)
        }
      }
    })

    return () => unsubscribe()
  }, [queryClient])

  const handleSessionExpired = async (message: string) => {
    if (sessionExpiredHandled.current) return

    sessionExpiredHandled.current = true
    // 2. Query cache 초기화
    queryClient.clear()

    // 3. 사용자에게 알림
    toast.error(message, {
      duration: Infinity,
      position: 'bottom-center',
      action: {
        label: 'Login Again',
        onClick: async () => {
          // router.refresh()
          sessionExpiredHandled.current = false
          await logOutAction()
        },
      },
    })

    // 4. 로그인 페이지로 리다이렉트 (약간의 딜레이)
    // setTimeout(() => {
    //   router.refresh()
    //   router.push('/login')
    // }, 1000)
  }

  return <>{children}</>
}
