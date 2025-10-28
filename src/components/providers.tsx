"use client"
import "@/global"
import { ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/get-query-client"
import { SessionMonitorProvider } from "./features/auth/session-monitor-provider"

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <SessionMonitorProvider>{children}</SessionMonitorProvider>
    </QueryClientProvider>
  )
}
