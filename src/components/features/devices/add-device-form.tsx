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
import { useCreateDevice } from '@/lib/hooks/queries/useDevices'
import { IconPlus } from '@tabler/icons-react'
import { useVehiclesPaginated } from '@/lib/hooks/queries/useVehicles'

const deviceSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  serial_number: z
    .string()
    .min(8, 'Serial number must be at least 8 characters')
    .max(255, 'Serial number must be at most 255 characters')
    .regex(
      /^[A-Z0-9]+$/,
      'Serial number must contain only uppercase letters and numbers',
    ),
  type: z.enum(['master', 'slave', 'gateway', 'sensor', 'logger']),
  user_name: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  ip_addr: z
    .string()
    .max(16, 'IP address must be at most 16 characters')
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Invalid IP address format',
    ),
  vehicle_id: z.number().min(1, 'Vehicle ID must be at least 1'),
})

type DeviceFormData = z.infer<typeof deviceSchema>

function DeviceForm({ onClose }: { onClose: () => void }) {
  const mutation = useCreateDevice()
  const { data: vehiclesData, isLoading: isLoadingVehicles } =
    useVehiclesPaginated({
      page: 1,
      limit: 10000, // 모든 회사를 가져오기 위해 충분히 큰 수로 설정
    })

  const form = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: '',
      serial_number: '',
      type: 'master',
      user_name: 'banf',
      ip_addr: '',
      vehicle_id: undefined,
    },
  })

  const onSubmit = async (data: DeviceFormData) => {
    try {
      await mutation.mutateAsync({
        edge_device: data,
      })
      form.reset()
      onClose()
    } catch (error) {
      // Error is handled in the mutation
    }
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
              name="serial_number"
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
                      <SelectItem value="master">Master</SelectItem>
                      <SelectItem value="slave">Slave</SelectItem>
                      <SelectItem value="gateway">Gateway</SelectItem>
                      <SelectItem value="sensor">Sensor</SelectItem>
                      <SelectItem value="logger">Logger</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_name"
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
              name="ip_addr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input placeholder="192.168.1.100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle ID</FormLabel>
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
                      {vehiclesData?.data?.vehicles.map((vehicle) => (
                        <SelectItem
                          key={vehicle.id}
                          value={vehicle.id.toString()}
                        >
                          {vehicle.plate_number}
                        </SelectItem>
                      ))}
                      {vehiclesData?.data?.vehicles.length === 0 && (
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
