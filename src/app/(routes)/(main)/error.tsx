"use client"

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, LogIn } from "lucide-react"
import { logOutAction } from "@/lib/actions/auth.actions"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-background -mt-7 -ml-6">
      <Card className="w-full max-w-md shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl flex leading-none items-center justify-center gap-x-2">
            <div className="rounded-full bg-destructive/10 p-[6px]">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            ERROR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && (
            <div className="rounded-lg bg-muted py-4 px-8">
              <p className="text-sm font-mono text-muted-foreground break-words">
                {error.message}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={reset}
            className="w-full sm:flex-1"
            variant="default"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            onClick={async () => {
              await logOutAction()
              router.push("/signin")
            }}
            className="w-full sm:flex-1"
            variant="outline"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
