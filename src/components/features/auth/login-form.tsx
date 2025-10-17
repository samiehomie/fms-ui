'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import banfleetLogoSVG from '@/../public/logos/banfleet.svg'
import { ApiRequestType } from '@/types/api'
import { loginAction } from '@/lib/actions/auth.actions'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null)
    setIsLoading(true)
    try {
      const loginData: ApiRequestType<'POST /auth/login'> = {
        username: data.username,
        password: data.password,
      }

      await loginAction(loginData)
      // Redirect is handled by the login mutation's onSuccess
    } catch (error: any) {
      if (error.message !== 'NEXT_REDIRECT') {
        logger.error('login form error:', error)
        setApiError(error.message || 'An unexpected error occurred.')
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="w-full  max-w-sm">
      <div className="w-full flex flex-col justify-center gap-y-4 mb-4 leading-none">
        <Image src={banfleetLogoSVG} alt="logo" width={170} />
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username and password to access your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                {...form.register('username')}
                required
              />
              {form.formState.errors.username && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register('password')}
                required
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            {apiError && <p className="text-sm text-red-500">{apiError}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
