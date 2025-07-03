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
import { Loader2 } from 'lucide-react'

type ConfirmDialogProps = {
  children: ReactNode
  handleClick: () => Promise<void> | void // Promise 지원 추가
  onClose?: () => void // 선택적으로 변경
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  disabled?: boolean
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  children,
  title,
  description,
  handleClick,
  onClose,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  variant = 'default',
  disabled = false,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault() // 기본 동작 방지

    try {
      setLoading(true)
      await handleClick()

      // 성공 시에만 dialog 닫기
      setOpen(false)
      onClose?.()
    } catch (error) {
      console.error('Confirm action failed:', error)
      // 에러 발생 시에도 dialog는 열린 상태 유지
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    onClose?.()
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      // 로딩 중이 아닐 때만 상태 변경 허용
      setOpen(newOpen)
      if (!newOpen) {
        onClose?.()
      }
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || 'Are you absolutely sure?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ||
              'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={
              variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : ''
            }
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDialog
