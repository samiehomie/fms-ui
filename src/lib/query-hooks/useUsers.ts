import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api/user'
import type { UsersPaginationParams } from '@/types/features/user.types'
import { ApiResponseType, ApiRequestType } from '@/types/features'
import { toast } from 'sonner'
import { getAllUsers } from '../actions/user.actions'
import type {
  UsersGetResponse,
  UsersGetQuery,
} from '@/types/features/users/user.types'

type CreateUserResponse = ApiResponseType<'POST /users'>
type CreateUserRequest = ApiRequestType<'POST /users'>
type VerifyUserResponse = ApiResponseType<'POST /users/verify'>
type VerifyUserRequest = ApiRequestType<'POST /users/verify'>

export function useAllUsers(query: UsersGetQuery) {
  return useQuery({
    queryKey: ['users', query],
    queryFn: async () => {
      const result = await getAllUsers(query)

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000, 
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation<CreateUserResponse, Error, CreateUserRequest>({
    mutationFn: async (newUser) => {
      const res = await usersApi.createUser(newUser)
      return res
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
      toast.success('A new vehicle added', {
        description: `${data.message}`,
        position: 'bottom-center',
      })
    },
    onError: (error) => {
      toast.error('Adding a new vehicle failed.', {
        position: 'bottom-center',
        description: error.message,
      })
    },
  })
}

export function useVerifyUser() {
  const queryClient = useQueryClient()
  return useMutation<VerifyUserResponse, Error, VerifyUserRequest>({
    mutationFn: async (user) => {
      const res = await usersApi.verifyUser(user)
      return res
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
      toast.success('User Verification Complete', {
        description: `${data.message}`,
        position: 'bottom-center',
      })
    },
    onError: (error) => {
      toast.error('User Verification Failed', {
        position: 'bottom-center',
        description: error.message,
      })
    },
  })
}
