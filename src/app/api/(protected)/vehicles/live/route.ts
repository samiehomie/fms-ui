import { NextRequest, NextResponse } from 'next/server'
import { buildURL } from '@/lib/api/utils'
import { withAuth } from '@/lib/actions/auth'
import { fetchJson } from '@/lib/api/fetch'
import type { ApiResponseType, ApiRequestType } from '@/types/api'
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/route/route.heplers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return await withAuth(async (accessToken) => {
    const encoder = new TextEncoder()
    const apiUrl = buildURL('/vehicles/trips', { status: 'active' })

    // SSE 응답 설정
    const stream = new ReadableStream({
      async start(controller) {
        // 원본 서버가 SSE를 지원하기 전까지 폴링 방식을 취한다.
        const pollInterval = setInterval(async () => {
          try {
            const response = await fetchJson(apiUrl, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            })
            if (!response.success) {
              return createErrorResponse(
                'INTERNAL_ERROR',
                'Failed to fetch vehicles from external API',
              )
            }
            const data = response.data

            // SSE로 클라이언트에 전송
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'update',
                  vehicles: data,
                })}\n\n`,
              ),
            )
          } catch (err) {
            logger.error('Error fetching vehicles:', err)
            return createErrorResponse(
              'INTERNAL_ERROR',
              'An unexpected error occurred while fetching vehicles',
            )
          }
        }, 2000) // 2초마다 폴링

        // 연결 종료 시 폴링 중지
        request.signal.addEventListener('abort', () => {
          clearInterval(pollInterval)
          controller.close()
        })
      },
    })
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  })
}
