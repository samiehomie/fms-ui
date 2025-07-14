'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Building,
  Users,
  Truck,
  Settings,
  Cpu,
  ChevronsLeft,
} from 'lucide-react'
import Link from 'next/link'

interface TripHistorySidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: Building, label: 'Company' },
  { icon: Users, label: 'Users' },
  { icon: Truck, label: 'Vehicles' },
  { icon: Cpu, label: 'Devices' },
]

export function TripHistorySidebar({
  isCollapsed,
  onToggle,
}: TripHistorySidebarProps) {
  return (
    <div
      className={cn(
        'relative h-full bg-[#f8fafc]/40 border-r transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-14' : 'w-43',
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute top-4 -right-[.625rem] z-10 bg-background border rounded-full h-5 w-5"
      >
        <ChevronsLeft
          className={cn(
            'h-2 w-2 transition-transform',
            isCollapsed && 'rotate-180',
          )}
        />
      </Button>

      <nav className="mt-14 pl-4 flex flex-col gap-y-5 w-full">
        {menuItems.map((item, index) => (
          <Link
            key={item.label}
            href="#"
            className="flex items-center relative w-full"
          >
            <item.icon className="h-6 w-6 shrink-0 p-1 border rounded-6 bg-[#f5f5f5]" />
            <span
              className={cn(
                'ml-[.65rem] transition-all text-sm overflow-hidden whitespace-nowrap',
                isCollapsed && 'hidden',
              )}
            >
              {item.label}
            </span>
            <div
              className={cn(
                'absolute bg-gray-900/60 h-[1.39rem] w-[.1rem] right-0 top-[.05rem] translate-x-[100%]',
                index !== 0 && 'hidden',
              )}
            />
          </Link>
        ))}
      </nav>
    </div>
  )
}
