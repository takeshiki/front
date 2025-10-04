import { Suspense } from "react"
import dynamic from "next/dynamic"

const DashboardPageContent = dynamic(() => import("@/components/dashboard/dashboard-page-content"), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
})

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <DashboardPageContent />
    </Suspense>
  )
}
