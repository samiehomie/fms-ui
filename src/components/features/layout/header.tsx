'use client'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, Search, Menu, LayoutDashboard, LogOut } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '../auth/auth-provider'
import { logger, getInitials } from '@/lib/utils'

export function Header() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  logger.info('user', user)
  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-slate-200 dark:bg-slate-950 dark:border-slate-700 lg:px-6">
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            {/* Re-using Sidebar component for mobile, might need adjustments or a dedicated mobile sidebar */}
            <div className="flex items-center h-16 px-6 border-b border-slate-200 dark:border-slate-700">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#3b82f6]">BANF</span>
                <span className="text-2xl font-bold text-[#0f172a]">FLEET</span>
              </Link>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {/* Simplified nav for mobile, or reuse Sidebar's items */}
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
              </Button>
              {/* Add other items similarly */}
            </nav>
            <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="ghost"
                className="w-full justify-start text-[#ef4444] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#ef4444]"
                // onClick={() => logout()}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Log out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative flex-1 ml-auto lg:ml-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
        <Input
          type="search"
          placeholder="Type a command or search..."
          className="w-full pl-8 md:w-[300px] lg:w-[320px] bg-[#f8fafc] dark:bg-slate-800"
        />
      </div>
      {user ? (
        <div className="flex items-center gap-4 ml-auto">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-5 h-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative flex items-center gap-2 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-[#0f172a] dark:text-slate-50">
                    {user.email}
                  </p>
                  <p className="text-xs text-[#3b82f6]">
                    {user.role || 'No affiliation'}
                  </p>
                </div>
                <Avatar className="w-9 h-9">
                  <AvatarImage
                    src="/diverse-user-avatars.png"
                    alt={user.name || user.username}
                  />
                  <AvatarFallback>
                    {getInitials(user.name, user.username)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="font-medium">{user.name || user.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  window.location.reload()
                }}
                className="text-[#ef4444] focus:text-[#ef4444] focus:bg-red-50 dark:focus:bg-red-900/30"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
    </header>
  )
}
