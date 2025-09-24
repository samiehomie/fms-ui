'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building,
  Users,
  Truck,
  Cpu,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import banfleetLogoSVG from '@/../public/logos/banfleet.svg'
import { logOutAction } from '@/lib/actions/auth'
// import { useAuth } from '../auth/auth-provider'

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Companies', href: '/companies', icon: Building },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Vehicles', href: '/vehicles', icon: Truck },
  { name: 'Devices', href: '/devices', icon: Cpu },
]

export function Sidebar() {
  // const { user, isLoading } = useAuth()
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-[#f8fafc] dark:lg:border-slate-700 dark:lg:bg-slate-900">
      <div className="flex items-center h-16 px-6 border-b border-slate-200 dark:border-slate-700">
        <Link href="/" className="flex items-center gap-2">
          <Image src={banfleetLogoSVG} alt="logo" />
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.name}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start',
              pathname === item.href
                ? 'bg-[#e0f2fe] text-[#3b82f6] hover:bg-[#e0f2fe]/90 hover:text-[#3b82f6]'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800',
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-[#ef4444] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#ef4444]"
          onClick={async () => {
            await logOutAction()
          }}
        >
          <LogOut className="w-5 h-5 mr-3" />
          {'Log out'}
        </Button>
      </div>
    </aside>
  )
}
