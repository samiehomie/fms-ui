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
} from '@/components/ui/sidebar'

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

export function SidebarMain({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
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
