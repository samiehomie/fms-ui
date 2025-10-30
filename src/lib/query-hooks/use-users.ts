import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getAllUsers, createUser, verifyUser } from "../actions/user.actions"
import type {
  UsersGetQuery,
  UserCreateBody,
  UserCreateResponse,
  UserVerifyBody,
  UserVerifyResponse,
} from "@/types/features/users/user.types"
import type { ServerActionResult } from "@/types/common/common.types"
import { HTTPError } from "../route/route.heplers"

export function useAllUsers(query: UsersGetQuery) {
  return useQuery({
    queryKey: ["users", query],
    queryFn: async () => {
      const result = await getAllUsers(query)

      if (!result.success) {
        throw new HTTPError(result.error.status ?? 500, result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<UserCreateResponse>,
    Error,
    UserCreateBody
  >({
    mutationFn: async (newUser) => {
      const res = await createUser(newUser)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      })
      if (res.success) {
        toast.success("New user added", {
          description: `username: ${res.data.username}`,
          position: "bottom-center",
        })
      }
    },
    onError: (error) => {
      toast.error("Adding a new vehicle failed.", {
        position: "bottom-center",
        description: error.message,
      })
    },
  })
}

export function useVerifyUser(id: string) {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<UserVerifyResponse>,
    Error,
    UserVerifyBody
  >({
    mutationFn: async (body) => {
      const res = await verifyUser({ id }, body)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      })
      queryClient.invalidateQueries({
        queryKey: ["user", id],
      })
      if (res.success) {
        toast.success("User Verification Complete", {
          description: `${res.data.name}`,
          position: "bottom-center",
        })
      }
    },
    onError: (error) => {
      toast.error("Company Verification Failed", {
        position: "bottom-center",
        description: error.message,
      })
    },
  })
}
