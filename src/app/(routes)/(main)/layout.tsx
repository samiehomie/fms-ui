import type React from 'react'
import { Sidebar } from '@/components/features/layout/sidebar'
import { Header } from '@/components/features/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 lg:ml-64">
        <Header />
        <main className="flex-1 p-4 sm:p-6 bg-white dark:bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  )
}
