"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-none ">
        <CardHeader>
          <CardTitle className="text-[22px] flex leading-none items-center justify-center gap-x-2">
            <div className="rounded-full bg-muted p-1.5">
              <FileQuestion className="h-4 w-4 text-muted-foreground" />
            </div>
            Page Not Found
          </CardTitle>
          <CardDescription className="text-base mt-5 ">
            The page you requested does not exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={() => {
              window.history.back()
            }}
            className="w-full sm:flex-1"
            variant="outline"
          >
            <div className="flex items-center justify-center gap-x-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </div>
          </Button>
          <Button
            asChild
            className="w-full sm:flex-1"
            variant="default"
            onClick={() => {
              router.refresh()
              router.push("/")
            }}
          >
            <div className="flex items-center justify-center gap-x-2">
              <Home className=" h-3 w-3" />
              Go Home
            </div>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
