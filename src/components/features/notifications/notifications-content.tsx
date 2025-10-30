"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Check,
  X,
  MoreHorizontal,
  AlertTriangle,
  AlertCircle,
  Info,
  Truck,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type NotificationType = "critical" | "warning" | "info"
type NotificationStatus = "unread" | "read" | "done"

interface Notification {
  id: string
  title: string
  description: string
  type: NotificationType
  vehicleId: string
  vehicleName: string
  driverId: string
  driverName: string
  timestamp: Date
  status: NotificationStatus
  category: string
}

// Mock data for OTR tire fleet notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Critical Tire Pressure Alert",
    description:
      "Front left tire pressure dropped below 80 PSI. Immediate inspection required.",
    type: "critical",
    vehicleId: "HD-001",
    vehicleName: "Haul Truck HD-001",
    driverId: "D-101",
    driverName: "John Smith",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "unread",
    category: "Tire Pressure",
  },
  {
    id: "2",
    title: "Tire Temperature Warning",
    description:
      "Rear tire temperature exceeds 85°C. Reduce load or speed recommended.",
    type: "warning",
    vehicleId: "HD-001",
    vehicleName: "Haul Truck HD-001",
    driverId: "D-101",
    driverName: "John Smith",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "unread",
    category: "Tire Temperature",
  },
  {
    id: "3",
    title: "Scheduled Tire Rotation Due",
    description:
      "Vehicle has reached 500 operating hours. Tire rotation maintenance required.",
    type: "info",
    vehicleId: "LD-205",
    vehicleName: "Loader LD-205",
    driverId: "D-102",
    driverName: "Sarah Johnson",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "unread",
    category: "Maintenance",
  },
  {
    id: "4",
    title: "Low Tire Pressure Warning",
    description:
      "Right rear tire pressure at 95 PSI. Monitor closely and inflate if needed.",
    type: "warning",
    vehicleId: "EX-112",
    vehicleName: "Excavator EX-112",
    driverId: "D-103",
    driverName: "Mike Davis",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "unread",
    category: "Tire Wear",
  },
  {
    id: "5",
    title: "Tire Temperature Warning",
    description:
      "Rear tire temperature exceeds 85°C. Reduce load or speed recommended.",
    type: "warning",
    vehicleId: "DT-089",
    vehicleName: "Dump Truck DT-089",
    driverId: "D-104",
    driverName: "Emily Chen",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: "unread",
    category: "Tire Condition",
  },
  {
    id: "6",
    title: "Tire Inspection Completed",
    description:
      "All tires passed inspection. Next inspection due in 200 hours.",
    type: "info",
    vehicleId: "LD-205",
    vehicleName: "Loader LD-205",
    driverId: "D-102",
    driverName: "Sarah Johnson",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "read",
    category: "Inspection",
  },
  {
    id: "7",
    title: "Low Tire Pressure Warning",
    description:
      "Right rear tire pressure at 95 PSI. Monitor closely and inflate if needed.",
    type: "warning",
    vehicleId: "HD-003",
    vehicleName: "Haul Truck HD-003",
    driverId: "D-105",
    driverName: "Robert Lee",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "unread",
    category: "Tire Pressure",
  },
  {
    id: "8",
    title: "Critical Tire Pressure Alert",
    description:
      "Front left tire pressure dropped below 80 PSI. Immediate inspection required.",
    type: "critical",
    vehicleId: "EX-112",
    vehicleName: "Excavator EX-112",
    driverId: "D-103",
    driverName: "Mike Davis",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "unread",
    category: "Tire Wear",
  },
]

type GroupBy = "none" | "vehicle" | "driver" | "category"
type FilterType = "all" | "unread" | "critical" | "warning" | "maintenance"

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [groupBy, setGroupBy] = useState<GroupBy>("vehicle")
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [showBanner, setShowBanner] = useState(true)

  // Filter notifications based on search and active filter
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const matchesSearch =
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.driverName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "unread" && notif.status === "unread") ||
        (activeFilter === "critical" && notif.type === "critical") ||
        (activeFilter === "warning" && notif.type === "warning") ||
        (activeFilter === "maintenance" && notif.category === "Maintenance")

      return matchesSearch && matchesFilter
    })
  }, [notifications, searchQuery, activeFilter])

  // Group notifications
  const groupedNotifications = useMemo(() => {
    if (groupBy === "none") {
      return { "All Notifications": filteredNotifications }
    }

    const groups: Record<string, Notification[]> = {}

    filteredNotifications.forEach((notif) => {
      let key: string
      if (groupBy === "vehicle") {
        key = notif.vehicleName
      } else if (groupBy === "driver") {
        key = notif.driverName
      } else {
        key = notif.category
      }

      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(notif)
    })

    return groups
  }, [filteredNotifications, groupBy])

  const handleSelectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)))
    }
  }

  const handleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleMarkAsDone = () => {
    setNotifications((prev) =>
      prev.map((notif) =>
        selectedIds.has(notif.id)
          ? { ...notif, status: "done" as NotificationStatus }
          : notif,
      ),
    )
    setSelectedIds(new Set())
  }

  const handleMarkAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) =>
        selectedIds.has(notif.id)
          ? { ...notif, status: "read" as NotificationStatus }
          : notif,
      ),
    )
    setSelectedIds(new Set())
  }

  const handleDelete = () => {
    setNotifications((prev) =>
      prev.filter((notif) => !selectedIds.has(notif.id)),
    )
    setSelectedIds(new Set())
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getNotificationBadge = (type: NotificationType) => {
    switch (type) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            Warning
          </Badge>
        )
      case "info":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
            Info
          </Badge>
        )
    }
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return "just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const unreadCount = notifications.filter((n) => n.status === "unread").length

  return (
    <div className="flex h-screen bg-background -ml-6 -mt-7">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-muted/30 pl-4.5 pr-4 pt-9.5">
        {/* <div className="mb-6">
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div> */}

        {/* Main Navigation */}
        <div className="space-y-1 mb-6">
          <button
            onClick={() => setActiveFilter("all")}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeFilter === "all"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50 text-muted-foreground",
            )}
          >
            <div className="flex items-center gap-2 flex-1">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              Inbox
            </div>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {unreadCount}
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveFilter("unread")}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeFilter === "unread"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50 text-muted-foreground",
            )}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            Unread
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Filters
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => setActiveFilter("critical")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                activeFilter === "critical"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50 text-muted-foreground",
              )}
            >
              <AlertTriangle className="h-4 w-4" />
              Critical Issues
            </button>
            <button
              onClick={() => setActiveFilter("warning")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                activeFilter === "warning"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50 text-muted-foreground",
              )}
            >
              <AlertCircle className="h-4 w-4" />
              Warnings
            </button>
            <button
              onClick={() => setActiveFilter("maintenance")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                activeFilter === "maintenance"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50 text-muted-foreground",
              )}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Maintenance
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2">
              <Button variant="ghost" size="sm">
                All
              </Button>
              <Button variant="ghost" size="sm">
                Unread
              </Button>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select
              value={groupBy}
              onValueChange={(value) => setGroupBy(value as GroupBy)}
            >
              <SelectTrigger className="w-[190px]">
                <SelectValue>
                  {groupBy !== "none" && <span>{`Group by:`}</span>}
                  {groupBy === "none"
                    ? "No grouping"
                    : groupBy.slice(0, 1).toUpperCase() + groupBy.slice(1)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No grouping</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Info Banner */}
        {showBanner && (
          <div className="border-b border-border bg-blue-500/10 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">
                  Stay on top of your fleet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monitor tire conditions, pressure alerts, and maintenance
                  schedules for all your OTR vehicles in real-time.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBanner(false)}
                >
                  Dismiss
                </Button>
                <Button size="sm">Get started</Button>
              </div>
            </div>
          </div>
        )}

        {/* Selection Actions */}
        {selectedIds.size > 0 && (
          <div className="border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedIds.size === filteredNotifications.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                {selectedIds.size} selected
              </span>
              <Button variant="ghost" size="sm" onClick={handleMarkAsDone}>
                <Check className="h-4 w-4 mr-1" />
                Done
              </Button>
              <Button variant="ghost" size="sm" onClick={handleMarkAsRead}>
                Mark as read
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <X className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                  <DropdownMenuItem>Unsubscribe</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(groupedNotifications).map(
            ([groupName, groupNotifications]) => (
              <div key={groupName} className="border-b border-border">
                {/* Group Header */}
                {groupBy !== "none" && (
                  <div className="bg-[#fcfcfc] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
                    <h3 className="text-sm font-semibold">{groupName}</h3>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Mark as done
                    </Button>
                  </div>
                )}

                {/* Group Notifications */}
                {groupNotifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    <p className="text-sm">No notifications found</p>
                  </div>
                ) : (
                  groupNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors border-l-2",
                        selectedIds.has(notification.id)
                          ? "bg-accent/30 border-l-primary"
                          : notification.status === "unread"
                          ? "border-l-blue-500"
                          : "border-l-transparent",
                      )}
                    >
                      <Checkbox
                        checked={selectedIds.has(notification.id)}
                        onCheckedChange={() =>
                          handleSelectNotification(notification.id)
                        }
                        className="mt-1"
                      />
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {notification.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getNotificationBadge(notification.type)}
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            {notification.vehicleName}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {notification.driverName}
                          </span>
                          <span>{notification.category}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ),
          )}
        </div>

        {/* Footer Tip */}
        <div className="border-t border-border px-4 py-2 bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-background border border-border rounded">
              Shift
            </kbd>{" "}
            +{" "}
            <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-background border border-border rounded">
              U
            </kbd>{" "}
            to mark as unread
          </p>
        </div>
      </div>
    </div>
  )
}
