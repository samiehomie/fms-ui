'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function CompaniesError({ reset }: ErrorProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          데이터 로딩 실패
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          회사 정보를 불러오는 중 오류가 발생했습니다.
        </p>
        <div className="space-y-2">
          <Button onClick={reset} className="w-full">
            다시 시도
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            페이지 새로고침
          </Button>
        </div>
      </Card>
    </div>
  )
}
