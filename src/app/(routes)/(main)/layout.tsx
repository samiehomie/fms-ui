import type React from 'react'
import { Sidebar } from '@/components/features/layout/sidebar'
import { Header } from '@/components/features/layout/header'
import { Providers } from '@/components/providers'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarMain } from '@/components/features/layout/sidebar/sidebar-main'
import BreadcrumbMain from '@/components/features/layout/breadcrumb-main'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <SidebarProvider>
        <SidebarMain />
        <SidebarInset className="text-slate-900 min-h-screen w-full flex flex-col">
          <header className="flex border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <BreadcrumbMain />
            </div>
          </header>
          <div className="lg:mx-6 flex-1 flex flex-col mt-5">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  )
}
