import type { User } from "@/types/entities/user.entity"

type UserData = Pick<
  User,
  "id" | "username" | "name" | "email" | "role" | "company"
>

export type UserLoginBody = Pick<User, 'email' | 'password'>

// POST /auth/login
export type UserLoginResponse = {
  user: UserData
  accessToken: string
  refreshToken: string
  sessionId: string
}
