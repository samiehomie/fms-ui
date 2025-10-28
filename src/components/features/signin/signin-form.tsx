"use client"

import { useState } from "react"
import {
  signinSchema,
  type SigninFormData,
} from "@/types/features/auth/signin.schema"
import { cn } from "@/lib/utils"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signinAction } from "@/lib/actions/auth.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<SigninFormData> = async (
    data: SigninFormData,
  ) => {
    try {
      setServerError(null)
      const formData = signinSchema.parse(data)
      const result = await signinAction(formData)
      if (!result.success && result.error) {
        console.log("form server error: ", result.error)
        setServerError(result.error.message)
      } else if (result.success) {
        router.push("/")
      }
    } catch (error) {
      console.log("form server error: ", error)
      setServerError("Unknown error")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                {serverError && (
                  <div
                    role="alert"
                    className="text-destructive text-sm text-center p-2 bg-destructive/10 rounded"
                  >
                    {serverError}
                  </div>
                )}
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  required
                  {...register("email")}
                />
                {errors.email && (
                  <div
                    role="alert"
                    className="text-destructive text-sm leading-none"
                  >
                    {errors.email.message}
                  </div>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  aria-invalid={errors.password ? "true" : "false"}
                  required
                  {...register("password")}
                />
                {errors.password && (
                  <div role="alert" className="text-destructive text-sm">
                    {errors.password.message}
                  </div>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link prefetch={false} href="/signup">
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://ui.shadcn.com/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  )
}
