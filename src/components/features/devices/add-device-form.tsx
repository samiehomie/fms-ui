'use client'

import { useState } from 'react'
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
import { useCreateDevice } from '@/lib/query-hooks/useDevices'
import { IconPlus } from '@tabler/icons-react'
import { useAllVehicles } from '@/lib/query-hooks/useVehicles'
import { EdgeDeviceType } from '@/types/enums/edge-device.enum'
import { Skeleton } from '@/components/ui/skeleton'

const deviceSchema = z.object({
  serialNumber: z
    .string()
    .min(8, 'Serial number must be at least 8 characters')
    .max(255, 'Serial number must be at most 255 characters')
    .regex(
      /^[A-Z0-9]+$/,
      'Serial number must contain only uppercase letters and numbers',
    ),
  type: z.nativeEnum(EdgeDeviceType, {
    errorMap: () => ({ message: 'Edge device type is required' }),
  }),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  password: z
    .string()
    .min(3, 'Password must be at least 3 characters')
    .max(20, 'Password must be at most 20 characters'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .optional(),
  wlanIpAddr: z
    .string()
    .max(16, 'IP address must be at most 16 characters')
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Invalid IP address format',
    )
    .optional(),
  ethIpAddr: z
    .string()
    .max(16, 'IP address must be at most 16 characters')
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Invalid IP address format',
    )
    .optional(),
  vehicleId: z.number().min(1, 'Vehicle ID must be at least 1'),
})

type DeviceFormData = z.infer<typeof deviceSchema>

function DeviceForm({ onClose }: { onClose: () => void }) {
  // TODO 모든 차량 가져오기에 대한 리펙토링 UI / API 모두 필요
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useAllVehicles({
    page: 1,
    limit: 10,
    includeDeleted: false,
    search: '',
  })

  const mutation = useCreateDevice()
  const form = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      serialNumber: '',
      name: '',
      type: EdgeDeviceType.MASTER,
      username: '',
      password: '',
      wlanIpAddr: '',
      ethIpAddr: '',
      vehicleId: undefined,
    },
  })

  const onSubmit = async (data: DeviceFormData) => {
    try {
      await mutation.mutateAsync(data)
      form.reset()
      onClose()
    } catch (error) {
      logger.log('add device form:', error)
    }
  }

  if (isLoadingVehicles) {
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
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Edge Device 01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ED123456789ABC"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="banf" {...field} />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wlanIpAddr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wlan IP</FormLabel>
                  <FormControl>
                    <Input placeholder="192.168.1.100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ethIpAddr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ethernet IP</FormLabel>
                  <FormControl>
                    <Input placeholder="192.168.1.100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(EdgeDeviceType).map((type) => (
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
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isLoadingVehicles}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingVehicles
                              ? 'Loading vehicles...'
                              : 'Select vehicle'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehiclesData?.data?.map((vehicle) => (
                        <SelectItem
                          key={vehicle.id}
                          value={vehicle.id.toString()}
                        >
                          {vehicle.plateNumber}
                        </SelectItem>
                      ))}
                      {vehiclesData?.data?.length === 0 && (
                        <SelectItem value="" disabled>
                          No vehicles available
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
            Add Device
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function AddDeviceForm() {
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
            <DrawerTitle>Add Device</DrawerTitle>
            <DrawerDescription>
              Fill in the device information to add it to your database.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <DeviceForm onClose={handleClose} />
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
          Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[91vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Device</DialogTitle>
          <DialogDescription>
            Fill in the device information to add it to your database.
          </DialogDescription>
        </DialogHeader>
        <DeviceForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
