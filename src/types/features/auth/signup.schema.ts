import { z } from "zod"

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    username: z
      .string()
      .min(6, "Username must be at least 6 characters.")
      .max(15, "Username must be 15 characters or fewer."),
    name: z
      .string()
      .min(2, "name must be at least 2 characters.")
      .max(15, "name must be 15 characters or fewer."),
    password: z
      .string()
      .min(8, "Passwords must be at least 8 characters.")
      .max(20, "Passwords must be at 20 characters or fewer.")
      .regex(/[A-Z]/, "Must include capital letters.")
      .regex(/[0-9]/, "Must include numbers"),
    confirmPassword: z.string(),
    companyId: z.coerce.number().min(1),
    roleId: z.coerce.number().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The password does not match.",
    path: ["confirmPassword"],
  })

export type SignupData = z.infer<typeof signupSchema>
