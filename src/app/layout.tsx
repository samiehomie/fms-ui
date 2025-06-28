import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { getAuthData } from '@/lib/api/auth'

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
  const authData = await getAuthData()
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers token={authData?.token}>{children}</Providers>
      </body>
    </html>
  )
}
