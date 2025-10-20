'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useMedia } from 'react-use'
import { Loader2 } from 'lucide-react'
import { useCreateUser } from '@/lib/query-hooks/useUsers'
import { IconPlus } from '@tabler/icons-react'
import { useAllCompanies } from '@/lib/query-hooks/useCompanies'
import { useAllRoles } from '@/lib/query-hooks/useRoles'
import { RoleType } from '@/types/enums/role.enum'
import { useAuth } from '../auth/auth-provider'
import { Skeleton } from '@/components/ui/skeleton'
import type { UserCreateBody } from '@/types/features/users/user.types'

const userSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email address'),
  roleId: z.number().min(1, 'Role is required'),
  companyId: z.number().min(1, 'Company is required'),
})

type UserFormData = z.infer<typeof userSchema>

function UserForm({ onClose }: { onClose: () => void }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const { user, isLoading } = useAuth()

  // TODO 모든 회사 가져오기에 대한 리펙토링 UI / API 모두 필요
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useAllCompanies({
      page: 1,
      limit: 1000,
    })

  const { data: rolesData, isLoading: isLoadingRoles } = useAllRoles({
    page: 1,
    limit: 1000,
  })
  const mutation = useCreateUser()
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: '',
        username: '',
        password: '',
        email: '',
        roleId: 3,
        companyId: user.companyId,
      })
      setIsInitialized(true)
    }
  }, [user])

  const onSubmit = async (data: UserCreateBody) => {
    try {
      await mutation.mutateAsync(data)
      onClose()
    } catch (error) {
      // Error is handled in the mutation
    }
  }

  if (
    isLoadingCompanies ||
    isLoading ||
    !companiesData ||
    !isInitialized ||
    isLoadingRoles ||
    !rolesData
  ) {
    return (
      <div className="min-h-[51.125rem]  flex flex-col gap-y-4 overflow-y-hidden">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isLoadingRoles}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingRoles ? 'Loading roles...' : 'Select role'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rolesData?.data?.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                      {rolesData?.data?.length === 0 && (
                        <SelectItem value="" disabled>
                          No role available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isLoadingCompanies}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingCompanies
                              ? 'Loading companies...'
                              : 'Select company'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companiesData?.data?.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                      {companiesData?.data?.length === 0 && (
                        <SelectItem value="" disabled>
                          No companies available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add User
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function AddUserForm() {
  const [open, setOpen] = useState(false)
  const isDesktop = useMedia('(min-width: 768px)', true)

  const handleClose = () => setOpen(false)

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>Add</Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Add User</DrawerTitle>
            <DrawerDescription>
              Fill in the user information to add it to your database.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <UserForm onClose={handleClose} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          size={'sm'}
          className="text-[.8125rem] tracking-tight h-6"
        >
          <IconPlus />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[91vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Fill in the user information to add it to your database.
          </DialogDescription>
        </DialogHeader>
        <UserForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
