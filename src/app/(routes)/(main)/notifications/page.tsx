"use client"

import dynamic from "next/dynamic"

const NotificationsContent = dynamic(
  () => import("@/components/features/notifications/notifications-content"),
  {
    loading: () => <div>Loading...</div>,
  },
)

export default function NotificationsPage() {
  return <NotificationsContent />
}
