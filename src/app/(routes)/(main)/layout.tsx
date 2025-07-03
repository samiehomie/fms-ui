import type React from 'react'
import { Sidebar } from '@/components/features/layout/sidebar'
import { Header } from '@/components/features/layout/header'
import { Providers } from '@/components/providers'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="flex min-h-screen w-full text-slate-900 bg-[#f8fafc]">
        <Sidebar />
        <div className="flex flex-col flex-1 lg:ml-64">
          <Header />
          <main className="flex-1 flex flex-col p-4 sm:p-6 bg-white">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  )
}
