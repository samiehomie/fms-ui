import { fetchJson } from '@/lib/api/fetch'
import { buildURL } from '@/lib/api/utils'
import { ApiResponseType } from '@/types/api'

export default async function Home() {
  const apiUrl = buildURL('/auth/login')
  const data = await fetchJson<ApiResponseType<'POST /auth/login'>>(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'vially',
      password: 'vially@1234',
    }),
    next: { revalidate: 1000 * 30 },
  })

  if (!data) return
  return (
    <div>
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}
