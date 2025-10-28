import type { PaginationMeta } from "@/types/features/common.types"
import { HTTP_STATUS } from "@/types/features/route.types"

export type FetchError =
  | { type: "http"; status: number; message: string; details?: unknown }
  | { type: "network"; message: string; cause?: unknown; status?: number }
  | { type: "timeout"; message: string; status?: number }
  | { type: "invalid-json"; message: string; text?: string; status?: number }
  | { type: "abort"; message: string; status?: number }

export type FetchServerResult<T = any> =
  | { success: true; data: T; pagination?: PaginationMeta; message?: string }
  | { success: false; error: FetchError }

export type FetchServerResponse<T = any> =
  | {
      success: true
      data: T
      statusCode: HTTP_STATUS
      timestamp: string
      message?: string
      pagination?: PaginationMeta
    }
  | {
      success: false
      statusCode: HTTP_STATUS
      message?: string
      timestamp: string
    }

// Extended options for Next.js 15
interface FetchServerOptions extends Omit<RequestInit, "signal"> {
  timeout?: number
  revalidate?: number | false
  tags?: string[]
  retry?: {
    attempts?: number
    delay?: number
    shouldRetry?: (error: FetchError) => boolean
  }
  parseResponse?: boolean
  debug?: boolean
}

export interface ApiResponse<T> {
  data: T
  message: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Default retry logic - only retry on network errors and 5xx
const defaultShouldRetry = (error: FetchError): boolean => {
  return (
    error.type === "network" || (error.type === "http" && error.status >= 500)
  )
}

// Helper for delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Type-safe server-side fetch utility for Next.js 15
 *
 * @param input - Request URL or RequestInfo
 * @param options - Extended fetch options with Next.js 15 support
 * @returns Result object with data or detailed error information
 *
 * @example
 * // Basic usage
 * const result = await fetchServer<User[]>('/api/users')
 * if (result.success) {
 *   console.log(result.data)
 * }
 *
 * @example
 * // With caching (Next.js 15)
 * const result = await fetchServer<Post>('/api/post/1', {
 *   revalidate: 3600, // Revalidate every hour
 *   tags: ['post', 'post-1']
 * })
 *
 * @example
 * // With retry logic
 * const result = await fetchServer<Data>('/api/data', {
 *   retry: { attempts: 3, delay: 1000 }
 * })
 */
export async function fetchServer<T = unknown>(
  input: RequestInfo | URL,
  options: FetchServerOptions = {},
): Promise<FetchServerResult<T>> {
  const {
    timeout = 30000, // Increased default timeout for server-side
    revalidate,
    tags,
    retry = {},
    debug = process.env.NODE_ENV === "development",
    ...fetchOptions
  } = options

  const {
    attempts = 1,
    delay: retryDelay = 1000,
    shouldRetry = defaultShouldRetry,
  } = retry

  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
      ? input.href
      : input instanceof Request
      ? input.url
      : String(input)

  if (debug) {
    console.log("[fetchServer] Request:", {
      url,
      method: fetchOptions.method || "GET",
      revalidate,
      tags,
    })
  }

  // Attempt fetch with retry logic
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      // Configure Next.js 15 specific options
      const nextFetchOptions: RequestInit & {
        next?: {
          revalidate?: number | false
          tags?: string[]
        }
      } = {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
        // Next.js 15 caching configuration
        next: {
          ...(revalidate !== undefined && { revalidate }),
          ...(tags && tags.length > 0 && { tags }),
        },
      }

      // Handle cache control for Next.js 15
      // Default is no-cache in Next.js 15
      if (revalidate === false) {
        // Force no caching
        nextFetchOptions.cache = "no-store"
      } else if (revalidate === 0) {
        // Always revalidate
        nextFetchOptions.cache = "no-cache"
      } else if (typeof revalidate === "number" && revalidate > 0) {
        // Time-based revalidation
        nextFetchOptions.cache = "force-cache"
      }
      // If revalidate is undefined, use Next.js 15 default (no caching)

      const response = await fetch(input, nextFetchOptions)
      clearTimeout(timeoutId)

      if (debug) {
        console.log("[fetchServer] Response:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        })
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      const isJson = contentType?.includes("application/json")

      if (!isJson) {
        const text = await response.text()
        return {
          success: false,
          error: {
            type: "invalid-json",
            message: "Server did not return valid JSON",
            text: text.substring(0, 200), // Include first 200 chars for debugging
          },
        }
      }

      try {
        const resData = (await response.json()) as FetchServerResponse
        console.log("resData", resData)
        if (!resData.success) {
          const errorMessage = resData.message || "Unknown server error"
          const errorDetails: unknown = resData.timestamp

          const error: FetchError = {
            type: "http",
            status: resData.statusCode,
            message: errorMessage,
            details: errorDetails,
          }

          // Check if should retry
          if (attempt < attempts && shouldRetry(error)) {
            if (debug) {
              console.log(
                `[fetchServer] Retrying... Attempt ${attempt + 1}/${attempts}`,
              )
            }
            await delay(retryDelay * attempt) // Exponential backoff
            continue
          }

          return { success: false, error }
        }

        return resData
      } catch (err) {
        return {
          success: false,
          error: {
            type: "invalid-json",
            message: "Failed to parse JSON response",
            text: undefined,
          },
        }
      }
    } catch (error) {
      clearTimeout(timeoutId)

      // Handle abort/timeout
      if (error instanceof Error && error.name === "AbortError") {
        const timeoutError: FetchError = {
          type: "timeout",
          message: `Request timeout after ${timeout}ms`,
        }

        // Check if should retry on timeout
        if (attempt < attempts && shouldRetry(timeoutError)) {
          if (debug) {
            console.log(
              `[fetchServer] Timeout. Retrying... Attempt ${
                attempt + 1
              }/${attempts}`,
            )
          }
          await delay(retryDelay * attempt)
          continue
        }

        return { success: false, error: timeoutError }
      }

      // Handle network errors
      const networkError: FetchError = {
        type: "network",
        message:
          error instanceof Error ? error.message : "Unknown network error",
        cause: error,
      }

      // Check if should retry on network error
      if (attempt < attempts && shouldRetry(networkError)) {
        if (debug) {
          console.log(
            `[fetchServer] Network error. Retrying... Attempt ${
              attempt + 1
            }/${attempts}`,
          )
        }
        await delay(retryDelay * attempt)
        continue
      }

      return { success: false, error: networkError }
    }
  }

  // Should never reach here, but TypeScript needs this
  return {
    success: false,
    error: {
      type: "network",
      message: "Unexpected error after all retry attempts",
    },
  }
}

/**
 * Utility function to invalidate cache tags (Next.js 15)
 * Note: This requires server action or API route
 */
export async function revalidateTag(tag: string | string[]): Promise<void> {
  if (typeof window !== "undefined") {
    throw new Error("revalidateTag can only be called on the server")
  }

  const { revalidateTag: nextRevalidateTag } = await import("next/cache")
  const tags = Array.isArray(tag) ? tag : [tag]

  for (const t of tags) {
    nextRevalidateTag(t)
  }
}

/**
 * Utility function to invalidate path cache (Next.js 15)
 * Note: This requires server action or API route
 */
export async function revalidatePath(
  path: string,
  type: "page" | "layout" = "page",
): Promise<void> {
  if (typeof window !== "undefined") {
    throw new Error("revalidatePath can only be called on the server")
  }

  const { revalidatePath: nextRevalidatePath } = await import("next/cache")
  nextRevalidatePath(path, type)
}
