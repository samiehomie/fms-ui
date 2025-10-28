"use client"

import type { FC, Dispatch, SetStateAction } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface SignupDialogProps {
  open: boolean
  handleOpenChange: Dispatch<SetStateAction<boolean>>
  email?: string
}

const SignupDialog: FC<SignupDialogProps> = ({
  open,
  handleOpenChange,
  email,
}) => {
  const router = useRouter()
  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Verify your email to complete registration
          </AlertDialogTitle>
          <AlertDialogDescription>
            {`We've sent a verification email to your email address (${email}).
            Please check your inbox and click the link to complete your sign-up.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              router.push("/signin")
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SignupDialog
