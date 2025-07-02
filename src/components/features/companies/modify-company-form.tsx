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
import { Textarea } from '@/components/ui/textarea'
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
import { useModifyCompany } from '@/lib/hooks/queries/useCompanies'
import { useCompanyById } from '@/lib/hooks/queries/useCompanies'
import { Skeleton } from '@/components/ui/skeleton'
import { logger } from '@/lib/utils'
import { IconPlus } from '@tabler/icons-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  reg_number: z.string().min(1, 'Registration number is required'),
  type: z.string().min(1, 'Company type is required'),
  details: z.string().min(1, 'Company details are required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL'),
  contact_person: z.string().min(1, 'Contact person is required'),
  contact_phone: z.string().min(1, 'Contact phone is required'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
    latitude: z.number(),
    longitude: z.number(),
  }),
})

type CompanyFormData = z.infer<typeof companySchema>

function CompanyForm({ onClose, id }: { onClose: () => void; id: number }) {
  const { data, isLoading } = useCompanyById(id)
  const mutation = useModifyCompany(id)
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      reg_number: '',
      type: '',
      details: '',
      phone: '',
      email: '',
      website: '',
      contact_person: '',
      contact_phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        latitude: 0,
        longitude: 0,
      },
    },
  })

  const onSubmit = async (data: CompanyFormData) => {
    logger.log('modify', data)
    try {
      await mutation.mutateAsync({
        company: data,
      })
      form.reset()
      onClose()
    } catch (error) {
      // Error is handled in the mutation
    }
  }

  useEffect(() => {
    if (data && data.data.company) {
      const company = data.data.company
      logger.log('company', company)
      form.reset({
        name: company.name || '',
        reg_number: company.reg_number || '',
        type: company.type || '',
        details: company.details || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        contact_person: company.contact_person || '',
        contact_phone: company.contact_phone || '',
        address: {
          street: company.address?.street || '',
          city: company.address?.city || '',
          state: company.address?.state || '',
          country: company.address?.country || '',
          postal_code: company.address?.postal_code || '',
          latitude: 0,
          longitude: 0,
        },
      })
    }
  }, [data])

  // 폼 에러 확인
  useEffect(() => {
    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors)
    }
  }, [form.formState.errors])

  if (!data || isLoading) {
    return (
      <div className="min-h-[51.125rem]  flex flex-col gap-y-4 overflow-y-hidden">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
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
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reg_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="REG-2024-STL-034" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Owner">Owner</SelectItem>
                      <SelectItem value="Guest">Guest</SelectItem>
                      <SelectItem value="Partner">Partner</SelectItem>
                      <SelectItem value="Client">Client</SelectItem>
                      <SelectItem value="Vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+82-2-1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the company's business and services"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      placeholder="info@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+82-10-9876-5432" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>

            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="175 Yeoksam-ro, Gangnam-gu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Seoul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Seoul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="South Korea" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="06247" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            Edit Company
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function ModifyCompanyForm({
  id,
  onClose,
}: {
  id: number
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMedia('(min-width: 768px)', true)

  const handleClose = () => {
    onClose()
    setOpen(false)
  }

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          {/* <Button>
            <IconPlus />
            Add Company
          </Button> */}
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Add New Company</DrawerTitle>
            <DrawerDescription>
              Fill in the company information to add it to your database.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <CompanyForm onClose={handleClose} id={id} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          className="w-full flex justify-start pl-2 font-[400]"
        >
          Edit
        </Button>
        {/* <Button variant={'outline'}>
          <IconPlus />
          Add Company
        </Button> */}
      </DialogTrigger>
      <DialogContent
        onClose={handleClose}
        className="max-w-4xl max-h-[91vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
          <DialogDescription>
            Fill in the company information to add it to your database.
          </DialogDescription>
        </DialogHeader>
        <CompanyForm onClose={handleClose} id={id} />
      </DialogContent>
    </Dialog>
  )
}
