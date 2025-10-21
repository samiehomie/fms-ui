'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface TripPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number // 한 번에 보여줄 최대 페이지 버튼 수
}

export function TripPagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 7, // 기본값: 7개
}: TripPaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // 줄임표 클릭 시 점프할 페이지 계산
  const handleEllipsisClick = (direction: 'start' | 'end') => {
    if (direction === 'start') {
      // 앞쪽 줄임표: 현재 페이지에서 maxVisiblePages만큼 뒤로
      const targetPage = Math.max(1, currentPage - maxVisiblePages)
      onPageChange(targetPage)
    } else {
      // 뒤쪽 줄임표: 현재 페이지에서 maxVisiblePages만큼 앞으로
      const targetPage = Math.min(totalPages, currentPage + maxVisiblePages)
      onPageChange(targetPage)
    }
  }

  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    // 총 페이지가 maxVisiblePages 이하면 모두 표시
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = []
    const sidePages = Math.floor((maxVisiblePages - 3) / 2) // 양쪽에 보여줄 페이지 수

    // 항상 첫 페이지 표시
    pages.push(1)

    if (currentPage <= sidePages + 2) {
      // 현재 페이지가 앞쪽에 있을 때
      for (let i = 2; i <= maxVisiblePages - 1; i++) {
        pages.push(i)
      }
      pages.push('ellipsis-end')
    } else if (currentPage >= totalPages - sidePages - 1) {
      // 현재 페이지가 뒤쪽에 있을 때
      pages.push('ellipsis-start')
      for (let i = totalPages - maxVisiblePages + 2; i <= totalPages - 1; i++) {
        pages.push(i)
      }
    } else {
      // 현재 페이지가 중간에 있을 때
      pages.push('ellipsis-start')
      for (let i = currentPage - sidePages; i <= currentPage + sidePages; i++) {
        pages.push(i)
      }
      pages.push('ellipsis-end')
    }

    // 항상 마지막 페이지 표시
    pages.push(totalPages)

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <Pagination className="mt-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePrevious()
            }}
            className={
              currentPage === 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-start') {
            return (
              <PaginationItem key={`ellipsis-start-${index}`}>
                <button
                  onClick={() => handleEllipsisClick('start')}
                  className="flex h-9 w-9 items-center justify-center hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  title={`${maxVisiblePages}페이지 이전으로`}
                >
                  <PaginationEllipsis />
                </button>
              </PaginationItem>
            )
          }

          if (page === 'ellipsis-end') {
            return (
              <PaginationItem key={`ellipsis-end-${index}`}>
                <button
                  onClick={() => handleEllipsisClick('end')}
                  className="flex h-9 w-9 items-center justify-center hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  title={`${maxVisiblePages}페이지 이후로`}
                >
                  <PaginationEllipsis />
                </button>
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page)
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleNext()
            }}
            className={
              currentPage === totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
