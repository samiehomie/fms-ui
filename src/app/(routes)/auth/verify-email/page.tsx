"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const VerifyEmailContent = dynamic(
  () => import("@/components/features/verify-email/verify-email-content"),
  {
    loading: () => (
      <div className="flex-1 flex flex-col justify-center items-center pb-2">
        <Skeleton className="w-[266px] h-[160px]" />
      </div>
    ),
  },
)

export default function VerifyEmailPage() {
  return <VerifyEmailContent />
}
