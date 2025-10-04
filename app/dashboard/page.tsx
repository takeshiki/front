import { Suspense } from "react"
import DashboardPageContent from "@/components/dashboard/dashboard-page-content"

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <DashboardPageContent />
    </Suspense>
  )
}
