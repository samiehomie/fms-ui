"use client"

import * as React from "react"
import {
  ChartGantt,
  CarFront,
  Building,
  User,
  Cpu,
  FileText,
  Route
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils/utils"
import banfleetLogoSVG from "@/../public/logos/banfleet.svg"
import banfShortLogoPNG from "@/../public/logos/banf-short.png"
import Link from "next/link"
import Image from "next/image"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: ChartGantt,
    },
    {
      title: "Trips",
      url: "/trips",
      icon: Route,
    },
    {
      title: "Vehicles",
      url: "/vehicles",
      isActive: true,
      icon: CarFront,
      items: [
        {
          title: "All Vehicles",
          url: "/vehicles",
        },
        {
          title: "Live Map",
          url: "/live-map",
        },
        {
          title: "Events",
          url: "/events",
        },
      ],
    },
    {
      title: "Companies",
      url: "/companies",
      icon: Building,
    },
    {
      title: "Users",
      url: "/users",
      icon: User,
    },

    {
      title: "Devices",
      url: "/devices",
      icon: Cpu,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
    },
  ],
}

function SidebarLogo() {
  const { state } = useSidebar()

  return (
    <SidebarHeader
      className={cn(
        "pl-4 pt-[1.025rem] pb-[.825rem]",
        state === "collapsed" && "p-[1.025rem_0px_10px_0px]",
      )}
    >
      <Link href="/">
        {state === "collapsed" ? (
          <Image
            src={banfShortLogoPNG}
            alt="logo"
            width={20}
            className="mx-auto "
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
