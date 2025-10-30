import type React from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarMain } from "@/components/features/layout/sidebar/sidebar-main"
import BreadcrumbMain from "@/components/features/layout/breadcrumb-main"
import { AuthProvider } from "@/components/features/auth/auth-provider"
import { InboxIcon } from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <SidebarMain />
        <SidebarInset className="text-slate-900 min-h-screen w-full flex flex-col">
          <header
            className="flex justify-between border-b h-16 shrink-0 items-center pr-6
          gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
          >
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="ml-[.4375rem] mr-2 data-[orientation=vertical]:h-4"
              />
              <BreadcrumbMain />
            </div>
            <Link href={"/notifications"} className="relative">
              <div className="w-2 h-2 bg-[#2c7fff] rounded-full absolute z-[999]" />
              <InboxIcon size={20} strokeWidth={1.5} />
            </Link>
          </header>
          <div className="lg:mx-6 flex-1 flex flex-col mt-7">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  )
}
