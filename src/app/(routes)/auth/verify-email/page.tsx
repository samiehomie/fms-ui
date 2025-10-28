"use client"
import { IconCircleDashedCheck, IconFileAlert } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { verifyEmailAction } from "@/lib/actions/auth.actions"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import Link from "next/link"

type VerificationState = "loading" | "success" | "error"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<VerificationState>("loading")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setState("error")
      setMessage("Invalid verification token")
      return
    }

    const verifyEmail = async () => {
      try {
        const result = await verifyEmailAction(token)

        if (result.success) {
          setState("success")
          setMessage(result.message || "Token verified successfully.")
          setTimeout(() => {
            router.push("/signin")
          }, 5000)
        } else {
          setState("error")
          setMessage(result.error.message || "Invalid verification token")
        }
      } catch (error) {
        setState("error")
        setMessage("Invalid verification token")
      }
    }

    verifyEmail()
  }, [searchParams, router])

  if (state === "loading") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center pb-2">
        <Skeleton className="w-[266px] h-[160px]" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center pb-20">
      <Empty>
        {state === "success" && (
          <>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconCircleDashedCheck color="#4BB543" />
              </EmptyMedia>
              <EmptyTitle>Email Verified!</EmptyTitle>
              <EmptyDescription>
                Your account is now active. Sign in now.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/signin">Sign in</Link>
                </Button>
              </div>
            </EmptyContent>
          </>
        )}
        {state === "error" && (
          <>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconFileAlert color="#F32013" />
              </EmptyMedia>
              <EmptyTitle>Verification Failed</EmptyTitle>
              <EmptyDescription>
                The link is invalid or expired.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button variant={"outline"} asChild>
                  <Link href="/signin">Sign up</Link>
                </Button>
                <Button asChild>
                  <Link href="/signin">Sign in</Link>
                </Button>
              </div>
            </EmptyContent>
          </>
        )}
      </Empty>
    </div>
  )

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6 text-center">
              {state === "loading" && (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                  <h1 className="text-2xl font-bold">Loading...</h1>
                </>
              )}

              {state === "success" && (
                <>
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <svg
                      className="h-10 w-10 text-green-600 dark:text-green-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold">Success</h1>
                  <p className="text-muted-foreground">{message}</p>
                  <Button asChild className="w-full">
                    <Link href="/signin">Sign in</Link>
                  </Button>
                </>
              )}

              {state === "error" && (
                <>
                  <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                    <svg
                      className="h-10 w-10 text-red-600 dark:text-red-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">{message}</p>
                  <div className="flex flex-col gap-2 w-full">
                    <Button asChild className="w-full">
                      <Link href="/signup">Sign up</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/signin">Sign in</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
