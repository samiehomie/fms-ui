"use client"

import dynamic from "next/dynamic"

const AlertsContent = dynamic(
  () => import("@/components/features/alerts/alerts-content"),
  {
    loading: () => <div>Loading...</div>,
  },
)

export default function AlertsPage() {
  return <AlertsContent />
}
