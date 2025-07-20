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
import {
  useUpdateVehicle,
  useVehicleById,
} from '@/lib/hooks/queries/useVehicles'
import { Skeleton } from '@/components/ui/skeleton'
import { logger } from '@/lib/utils'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

const vehicleSchema = z.object({
  vehicle_name: z.string().min(1, 'Vehicle name is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  fuel_type: z.string().min(2, 'Fuel is required'),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

function VehicleForm({ onClose, id }: { onClose: () => void; id: number }) {
  const { data, isLoading } = useVehicleById(id)
  const mutation = useUpdateVehicle(id)
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicle_name: '',
      brand: '',
      model: '',
      fuel_type: '',
    },
  })

  const onSubmit = async (data: VehicleFormData) => {
    logger.log('updating vehicle', data)
    try {
      await mutation.mutateAsync({
        vehicle: data,
      })
      form.reset()
      onClose()
    } catch (error) {
      // Error is handled in the mutation
    }
  }

  useEffect(() => {
    if (data && data.data) {
      const vehicle = data.data
      logger.log('vehicle', vehicle)
      form.reset({
        vehicle_name: vehicle.vehicle_name || '',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        fuel_type: vehicle.fuel_type || 'gasoline',
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
          <FormField
            control={form.control}
            name="vehicle_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter vehicle name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Honda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Accord" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="fuel_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gasoline">Gasoline</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update Vehicle
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function UpdateVehicleForm({
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
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Update Vehicle</DrawerTitle>
            <DrawerDescription>
              Update the vehicle information.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <VehicleForm onClose={handleClose} id={id} />
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
      </DialogTrigger>
      <DialogContent
        onClose={handleClose}
        className="max-w-2xl max-h-[91vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Update Vehicle</DialogTitle>
          <DialogDescription>Update the vehicle information.</DialogDescription>
        </DialogHeader>
        <VehicleForm onClose={handleClose} id={id} />
      </DialogContent>
    </Dialog>
  )
}
