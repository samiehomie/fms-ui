'use client'
import { FC, ReactNode, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type ConfirmDialogProps = {
  children: ReactNode
  handleClick: () => void
  onClose: () => void
  title?: string
  description?: string
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  children,
  title,
  description,
  handleClick,
  onClose,
}) => {
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || 'Are you absolutely sure?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ||
              `This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setOpen(false)
              onClose()
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDialog
