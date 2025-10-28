"use client"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <Skeleton className="w-[10.625rem] h-[2.4656rem]" />
      <Skeleton className="w-[24rem] h-[22.5rem]" />
    </div>
  )
}

const SignupForm = dynamic(
  () => import("@/components/features/signup/signup-form"),
  { ssr: false, loading: () => <LoadingSkeleton /> },
)

export default function SignupPage() {
  return (
    <main className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <section className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </section>
    </main>
  )
}
