export const buildURL = (
  endpoint: string,
  params?: Record<string, any>,
): string => {
  const url = new URL(endpoint, process.env.NEXT_PUBLIC_API_BASE_URL!)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}
