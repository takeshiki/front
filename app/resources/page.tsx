import { Suspense } from "react"
import dynamic from "next/dynamic"

const ResourcesPageContent = dynamic(() => import("@/components/resources/resources-page-content"), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
})

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ResourcesPageContent />
    </Suspense>
  )
}
