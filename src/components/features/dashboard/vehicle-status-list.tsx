import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Truck, Car } from 'lucide-react' // Using Car as a generic vehicle icon
import { cn } from '@/lib/utils'

type Status = 'green' | 'red' | 'yellow'

const vehicles = [
  { name: 'Test Car 1', id: '48ha1241', status: 'green' as Status, icon: Car },
  {
    name: 'Fleet Truck 1',
    id: '41go3412',
    status: 'green' as Status,
    icon: Truck,
  },
  {
    name: 'Delivery Van',
    id: '51ra5123',
    status: 'red' as Status,
    icon: Truck,
  },
  { name: 'Test Car 2', id: '49ha1342', status: 'green' as Status, icon: Car },
  {
    name: 'Fleet Truck 2',
    id: '42go3543',
    status: 'yellow' as Status,
    icon: Truck,
  },
  {
    name: 'Delivery Van 2',
    id: '52ra5234',
    status: 'green' as Status,
    icon: Truck,
  },
]

const statusColors: Record<Status, string> = {
  green: 'bg-[#22c55e]', // green-500
  red: 'bg-[#ef4444]', // red-500
  yellow: 'bg-[#facc15]', // yellow-400
}

export function VehicleStatusList() {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#0f172a] dark:text-slate-50">
          Vehicle Status
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          Current fleet status overview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <vehicle.icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#0f172a] dark:text-slate-50">
                {vehicle.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {vehicle.id}
              </p>
            </div>
            <div
              className={cn(
                'w-3 h-3 rounded-full',
                statusColors[vehicle.status],
              )}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
