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
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

type VerificationState = "loading" | "success" | "error"

export default function VerifyEmailContent() {
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
}
