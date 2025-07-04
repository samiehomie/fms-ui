import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api/user'
import type { UsersPaginationParams } from '@/types/api/user.types'
import { ApiResponseType, ApiRequestType } from '@/types/api'
import { toast } from 'sonner'

type CreateUserResponse = ApiResponseType<'POST /users'>
type CreateUserRequest = ApiRequestType<'POST /users'>

export function useUsersPaginated(params: UsersPaginationParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsersPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation<CreateUserResponse, Error, CreateUserRequest>({
    mutationFn: async (newUser) => {
      const { data } = await usersApi.createUser(newUser)
      return data
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
