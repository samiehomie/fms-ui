import {
  QueryClient,
  defaultShouldDehydrateQuery,
  QueryCache,
  MutationCache,
  isServer,
} from '@tanstack/react-query'
import { logOutAction } from '../actions/auth'
import { FetchError } from './fetch-client'

let isLoggingOut = false // 중복 로그아웃 방지

async function handleUnauthorized() {
  if (isLoggingOut) return

  isLoggingOut = true

  try {
    await logOutAction()
  } finally {
    isLoggingOut = false
  }
}

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3 * 60 * 1000, // 3분
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error: FetchError) => {
          // 401, 403 에러는 재시도하지 않음
          if (
            error?.statusCode === 401 ||
            error?.statusCode === 409 ||
            error?.statusText === 'Unauthorized'
          ) {
            return false
          }
          return failureCount < 3
        },
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
    // queryCache: new QueryCache({
    //   onError: (error: FetchError) => {
    //     if (error?.statusCode === 401 || error?.statusText === 'Unauthorized') {
    //       handleUnauthorized()
    //     }
    //   },
    // }),
    // mutationCache: new MutationCache({
    //   onError: (error: any) => {
    //     if (error?.statusCode === 401 || error?.statusText === 'Unauthorized') {
    //       handleUnauthorized()
    //     }
    //   },
    // }),
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
