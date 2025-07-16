'use client'

import * as React from 'react'
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import banfleetLogoSVG from '@/../public/logos/banfleet.svg'
import banfShortLogoWEBP from '@/../public/logos/banf-short.webp'
import Link from 'next/link'
import Image from 'next/image'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: SquareTerminal,
    },
    {
      title: 'Vehicles',
      url: '/vehicles',
      isActive: true,
      icon: BookOpen,
      items: [
        {
          title: 'Total',
          url: '/vehicles',
        },
        {
          title: 'Active',
          url: '/vehicles',
        },
      ],
    },
    {
      title: 'Companies',
      url: '/companies',
      icon: Bot,
    },
    {
      title: 'Users',
      url: '/users',
      icon: Settings2,
    },

    {
      title: 'Devices',
      url: '/devices',
      icon: Settings2,
    },
  ],
}

function SidebarLogo() {
  const { state } = useSidebar()

  return (
    <SidebarHeader
      className={cn(
        'ml-2 mt-[.625rem] mb-[.525rem]',
        state === 'collapsed' && 'ml-0 mb-0',
      )}
    >
      <Link href="/">
        {state === 'collapsed' ? (
          <Image
            src={banfShortLogoWEBP}
            alt="logo"
            width={20}
            className="mx-auto"
          />
        ) : (
          <Image src={banfleetLogoSVG} alt="logo" />
        )}
      </Link>
    </SidebarHeader>
  )
}

export function SidebarMain({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarLogo />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
