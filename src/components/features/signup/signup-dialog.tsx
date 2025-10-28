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
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SignupDialog
