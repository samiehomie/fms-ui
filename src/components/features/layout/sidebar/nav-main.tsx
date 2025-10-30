"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { state, toggleSidebar } = useSidebar()
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const isCollapsed = state === "collapsed"

  const handleMenuClick = (item: (typeof items)[0]) => {
    const hasChildren = item.items && item.items.length > 0

    if (isCollapsed && hasChildren) {
      // 접힌 상태에서 하위 항목이 있으면: 메뉴바 펼치기 + 해당 메뉴 확장
      toggleSidebar()
      setExpandedMenu(item.title)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>FMS</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = item.items && item.items.length > 0
          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          } else {
            return (
              <Collapsible
                key={item.title}
                asChild
                open={expandedMenu === item.title ? true : undefined}
                onOpenChange={(open) => {
                  if (open) {
                    setExpandedMenu(item.title)
                  } else if (expandedMenu === item.title) {
                    setExpandedMenu(null)
                  }
                }}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => handleMenuClick(item)}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
