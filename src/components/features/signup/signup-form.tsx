"use client"

import { cn } from "@/lib/utils/utils"
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
import { useState } from "react"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  signupSchema,
  type SignupFormData,
} from "@/types/features/auth/signup.schema"
import { signupAction } from "@/lib/actions/auth.actions"
import { useAllCompanyList } from "@/lib/query-hooks/use-companies"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SignupDialog from "./signup-dialog"

type FormResponseType =
  | { success: false; email: undefined }
  | { success: true; email?: string }

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [formResponse, setFormResponse] = useState<FormResponseType>({
    success: false,
    email: undefined,
  })
  const { data: companiesData, isLoading: isCompanyLoading } =
    useAllCompanyList()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      username: "",
      name: "",
      password: "",
      confirmPassword: "",
      companyId: 1,
      roleId: 1,
    },
  })

  // 클라이언트 사이드 검증 후 호출됨
  const onSubmit: SubmitHandler<SignupFormData> = async (
    data: SignupFormData,
  ) => {
    try {
      setServerError(null)
      setFormResponse({
        success: false,
        email: undefined,
      })
      const dataParsed = signupSchema.parse(data)
      const { confirmPassword, ...formData } = dataParsed
      const result = await signupAction(formData)
      if (!result.success && result.error) {
        console.log("form server error: ", result.error)
        setServerError(result.error.message)
      } else if (result.success) {
        setFormResponse({
          success: true,
          email: result.data?.email,
        })
      }
    } catch (error) {
      console.error("[signup onsubmit]", error)
      setServerError("Unknown error")
    }
  }

  if (isCompanyLoading) {
    return (
      <div>
        <Skeleton className="w-[894px] h-[623.75px]" />
      </div>
    )
  }

  return (
    <>
      <SignupDialog
        open={formResponse.success}
        handleOpenChange={() =>
          setFormResponse({
            success: false,
            email: undefined,
          })
        }
        email={formResponse.email}
      />
      <div className={cn("flex flex-col gap-5", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup className="gap-5">
                <div className="flex flex-col items-center gap-2 text-center mb-2">
                  <h1 className="text-2xl font-bold">Create your account</h1>
                </div>
                {serverError && (
                  <div
                    role="alert"
                    className="text-destructive text-sm text-center p-2 bg-destructive/10 rounded"
                  >
                    {serverError}
                  </div>
                )}
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
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    type="text"
                    placeholder="username"
                    aria-invalid={errors.username ? "true" : "false"}
                    {...register("username")}
                  />
                  {errors.username && (
                    <div role="alert" className="text-destructive text-sm">
                      {errors.username.message}
                    </div>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="username">Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="name"
                    aria-invalid={errors.name ? "true" : "false"}
                    {...register("name")}
                  />
                  {errors.name && (
                    <div role="alert" className="text-destructive text-sm">
                      {errors.name.message}
                    </div>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    aria-invalid={errors.password ? "true" : "false"}
                    {...register("password")}
                  />
                  {errors.password && (
                    <div role="alert" className="text-destructive text-sm">
                      {errors.password.message}
                    </div>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <div role="alert" className="text-destructive text-sm">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="companyId">Company</FieldLabel>
                  <Controller
                    name="companyId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          const valueParsed = parseInt(value, 10)
                          const output = isNaN(valueParsed) ? 1 : valueParsed
                          field.onChange(output)
                        }}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companiesData?.map((company) => (
                            <SelectItem
                              key={company.id}
                              value={`${company.id}`}
                            >
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.companyId && (
                    <div role="alert" className="text-destructive text-sm">
                      {errors.companyId.message}
                    </div>
                  )}
                </Field>

                <Field>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-[2.375rem] mt-3"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </Field>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link href="/signin" prefetch={false}>
                    Sign in
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
    </>
  )
}
