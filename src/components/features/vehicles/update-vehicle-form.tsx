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
import { useUpdateVehicle, useVehicleById } from '@/lib/query-hooks/useVehicles'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { GearType, FuelType, CanBitrateType } from '@/types/enums/vehicle.enum'
import { useAuth } from '../auth/auth-provider'
import { useCompaniesPaginated } from '@/lib/query-hooks/useCompanies'
import { ApiRequestType } from '@/types/api'

const vehicleSchema = z.object({
  vehicleName: z.string().min(1, 'Vehicle name is required'),
  plateNumber: z.string().min(1, 'Plate number is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  manufactureYear: z
    .number()
    .min(1900, 'Invalid manufacturing year')
    .max(
      new Date().getFullYear() + 1,
      'Manufacturing year cannot be in the future',
    ),
  canBitrate: z.string().min(1, 'CAN bitrate is required'),
  fuelType: z.nativeEnum(FuelType, {
    errorMap: () => ({ message: 'Fuel type is required' }),
  }),
  gearType: z.nativeEnum(GearType, {
    errorMap: () => ({ message: 'Gear type is required' }),
  }),
  numTire: z.number().min(1, 'Number of tires must be at least 1'),
  companyId: z.number().min(1, 'Company name is required'),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

function VehicleForm({ onClose, id }: { onClose: () => void; id: string }) {
  // TODO: 전체 가져오기 다른 패턴 회사가 많아 졌을 경우 검색 UI 필요
  const { data: companiesData, isLoading: companiesLoading } =
    useCompaniesPaginated({
      page: 1,
      limit: 100,
      search: '',
    })
  const { user, isLoading: userLoading } = useAuth()
  const { data: vehicleData, isLoading } = useVehicleById(id)
  const mutation = useUpdateVehicle(id)
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicleName: vehicleData?.data.vehicleName ?? '',
      plateNumber: vehicleData?.data?.plateNumber ?? '',
      brand: vehicleData?.data?.brand ?? '',
      model: vehicleData?.data?.model ?? '',
      manufactureYear:
        vehicleData?.data?.manufactureYear ?? new Date().getFullYear(),
      canBitrate: vehicleData?.data?.canBitrate ?? CanBitrateType['500Kbps'],
      fuelType: vehicleData?.data?.fuelType ?? FuelType.GASOLINE,
      gearType: vehicleData?.data?.gearType ?? GearType.AUTOMATIC,
      numTire: vehicleData?.data?.numTire ?? 4,
      companyId: user?.companyId ?? 1,
    },
  })

  const onSubmit = async (
    data: Partial<ApiRequestType<'PATCH /vehicles/{id}'>>,
  ) => {
    try {
      await mutation.mutateAsync({
        ...data,
      })
      form.reset()
      onClose()
    } catch (error) {
      // Error is handled in the mutation
    }
  }

  useEffect(() => {
    if (vehicleData && vehicleData.data) {
      const vehicle = vehicleData.data
      form.reset({
        vehicleName: vehicle.vehicleName,
        plateNumber: vehicle.plateNumber,
        brand: vehicle.brand,
        model: vehicle.model,
        manufactureYear: vehicle.manufactureYear,
        canBitrate: vehicle.canBitrate,
        fuelType: vehicle.fuelType,
        gearType: vehicle.gearType,
        numTire: vehicle.numTire,
        companyId: user?.companyId ?? 1,
      })
    }
  }, [vehicleData])

  // 폼 에러 확인
  useEffect(() => {
    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      logger.log('Form validation errors:', errors)
    }
  }, [form.formState.errors])

  if (companiesLoading || userLoading || isLoading) {
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
              name="vehicleName"
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

            <FormField
              control={form.control}
              name="plateNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plate Number</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC-1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota, Honda, etc." {...field} />
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
                    <Input placeholder="Camry, Civic, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="manufactureYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturing Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1900"
                      value={field.value || 1900}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '') {
                          field.onChange(1900)
                        } else {
                          const numValue = parseInt(value)
                          if (!isNaN(numValue)) {
                            field.onChange(numValue)
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numTire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Tires</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="4"
                      value={field.value || 4}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '') {
                          field.onChange(4)
                        } else {
                          const numValue = parseInt(value)
                          if (!isNaN(numValue)) {
                            field.onChange(numValue)
                          }
                        }
                      }}
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
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(FuelType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gearType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gear Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select gear type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(GearType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="canBitrate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Can Bitrate</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select gear type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CanBitrateType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
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
                  <FormLabel>Company Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={`${field.value}`}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select gear type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companiesData?.data.map((company) => (
                        <SelectItem key={company.id} value={`${company.id}`}>
                          {company.name}
                        </SelectItem>
                      ))}
                      {/* {Object.values(CanBitrateType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))} */}
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
  id: string
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
