import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
import { ApiResponseType } from '@/types/api'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlZpYWxseSBLYXphZGkiLCJ1c2VybmFtZSI6InZpYWxseSIsImVtYWlsIjoidmlhbGx5QGJhbmYuYWkiLCJyb2xlX2lkIjoxLCJyb2xlIjoiQkFORiBBZG1pbiIsImlhdCI6MTc1MDY1ODY1MiwiZXhwIjoxNzUxMjYzNDUyfQ.ASgCHnTGeUVYUoSv9gu_ultm0Y4heYA8d8GjqMY3g4g'

export default async function Home() {
  const apiUrl = buildURL('/auth/refresh')
  const data = await fetchJson<ApiResponseType<'POST /auth/refresh'>>(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      token,
      refresh_token: null,
    }),
    next: { revalidate: 1000 * 30 },
  })

  if (!data) return
  if (data.success) {
    return (
      <div>
        <div>
          <div>{data.data.user.name}|</div>
        </div>
      </div>
    )
  }
  return <div>{JSON.stringify(data.error)}</div>
}
