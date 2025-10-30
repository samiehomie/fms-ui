"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Inbox, Check, Bookmark } from "lucide-react"
import NotificationList from "@/components/features/notifications/notification-list"
import { Button } from "@/components/ui/button"

export default function NotificationPage() {
  const [notificationType, setNotificationType] = useState("all")
  return (
    <div className="flex-1 flex flex-col w-full -ml-6">
      <div className="flex-1 flex w-full gap-x-10">
        <div className="w-auto bg-[#f9fafb] border-r -mt-7 flex flex-col gap-y-1 items-start pt-4 pl-2.5 pr-2">
          <Button variant="ghost" className="w-full flex">
            <Inbox /> <span className="flex-1 text-end">Inbox</span>
          </Button>
          <Button variant="ghost" className="w-full flex">
            <Bookmark /> <span className="flex-1 text-end">Saved</span>
          </Button>
          <Button variant="ghost" className="w-full flex">
            <Check /> <span className="flex-1 text-end">Done</span>
          </Button>
        </div>
        <Tabs
          className="w-full max-w-[80rem] "
          value={notificationType}
          onValueChange={setNotificationType}
        >
          <div className="flex items-center gap-x-4 w-full">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
            <InputGroup className="flex-1">
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
            </InputGroup>
            <Select>
              <SelectTrigger className="w-[180px]">
                <div>
                  <span>{`Group by: `}</span>
                  <SelectValue />
                </div>
                {/* <SelectValue placeholder="Select a fruit" /> */}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* <SelectLabel>Fruits</SelectLabel> */}
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="device">Device</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <TabsContent value="all">
            <NotificationList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
