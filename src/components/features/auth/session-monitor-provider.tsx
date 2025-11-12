"use client"

import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { logOutAction } from "@/lib/actions/auth.actions"
import type { FetchError } from "@/types/common/api.types"
import { useRouter } from "next/navigation"

export function SessionMonitorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const sessionExpiredHandled = useRef(false)
  const router = useRouter()

  useEffect(() => {
    // Tanstack Query 전역 에러 핸들러
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "observerResultsUpdated") {
        const error = event.query.state.error as FetchError
        if (
          (error?.statusCode === 401 || error?.statusCode === 409) &&
          !sessionExpiredHandled.current
        ) {
          handleSessionExpired(
            error?.statusCode === 409 ? "Session invalid." : "Token invalid.",
          ).catch((err) => {
            console.error("Session expired handling failed:", err)
          })
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
      position: "bottom-center",
      action: {
        label: "Signin Again",
        onClick: async () => {
          sessionExpiredHandled.current = false
          await logOutAction()
          // 로그아웃 (세션 무효화 요청) 실패 하더라도 로그인 페이지 이동
          router.push("/signin")
        },
      },
    })

    // 4. 로그인 페이지로 리다이렉트 (약간의 딜레이)
    // setTimeout(() => {
    //   router.refresh()
    //   router.push('/signin')
    // }, 1000)
  }

  return <>{children}</>
}
