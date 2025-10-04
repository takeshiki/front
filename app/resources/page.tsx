"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCompany } from "@/lib/hooks/use-company"
import { FileUpload } from "@/components/resources/file-upload"
import { UrlUpload } from "@/components/resources/url-upload"
import { ResourceList } from "@/components/resources/resource-list"
import { AppHeader } from "@/components/app-header"
import { isAuthenticated } from "@/lib/auth-utils"

export default function ResourcesPage() {
  const router = useRouter()
  const { company, isRegistered } = useCompany()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const auth = isAuthenticated()
    setIsAuth(auth)
    
    if (!auth && !isRegistered) {
      router.push("/")
    }
  }, [isRegistered, router])

  if (!isAuth && !isRegistered) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBackButton title="Resources" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Manage Resources</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload files or add URLs for your onboarding materials
          </p>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="list" className="text-xs sm:text-sm">Browse</TabsTrigger>
            <TabsTrigger value="upload" className="text-xs sm:text-sm">Upload File</TabsTrigger>
            <TabsTrigger value="url" className="text-xs sm:text-sm">Add URL</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <ResourceList companyId={company?.id || ""} />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <FileUpload companyId={company?.id || ""} />
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <UrlUpload companyId={company?.id || ""} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
