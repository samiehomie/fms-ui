'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronsLeft, Filter, Car, FileDown } from 'lucide-react'
import Link from 'next/link'

interface TripHistorySidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: Filter, label: 'Filters' },
  { icon: Car, label: 'Vehicle Details' },
  { icon: FileDown, label: 'Export Data' },
]

export function TripHistorySidebar({
  isCollapsed,
  onToggle,
}: TripHistorySidebarProps) {
  return (
    <div
      className={cn(
        'relative h-full bg-[#f8fafc]/40 border-r transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-12' : 'w-45',
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute top-4 -right-3 z-10 bg-background border rounded-full h-6 w-6"
      >
        <ChevronsLeft
          className={cn(
            'h-3 w-3 transition-transform',
            isCollapsed && 'rotate-180',
          )}
        />
      </Button>
      <div className="p-4"></div>
      <nav className="mt-4 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href="#"
            className="flex items-center p-2 rounded-lg hover:bg-background"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                'ml-4 font-medium transition-all text-sm',
                isCollapsed && 'opacity-0 w-0',
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
