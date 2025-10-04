import { Suspense } from "react"
import ResourcesPageContent from "@/components/resources/resources-page-content"

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ResourcesPageContent />
    </Suspense>
  )
}
