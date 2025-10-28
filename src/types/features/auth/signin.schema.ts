import { z } from "zod"

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Username is required")
    .email("Invalid email address"),
  password: z.coerce.string().min(1, "Password is required"),
})

export type SigninFormData = z.infer<typeof signinSchema>
