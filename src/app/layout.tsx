import '@ant-design/v5-patch-for-react-19'
import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import '@/lib/global'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fleet Management Service',
  description: 'Manage your fleet efficiently',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  logger.log('test')
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
