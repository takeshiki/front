"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCompany } from "@/lib/hooks/use-company"
import { FileUpload } from "@/components/resources/file-upload"
import { UrlUpload } from "@/components/resources/url-upload"
import { ResourceList } from "@/components/resources/resource-list"
import { Sparkles, ArrowLeft } from "lucide-react"

export default function ResourcesPageContent() {
  const router = useRouter()
  const { isRegistered } = useCompany()

  useEffect(() => {
    if (!isRegistered) {
      router.push("/register")
    }
  }, [isRegistered, router])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-semibold text-xl">OnboardAI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Resources</h1>
          <p className="text-muted-foreground">Upload files or add URLs to build your onboarding knowledge base.</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="urls">Add URLs</TabsTrigger>
            <TabsTrigger value="all">All Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <FileUpload />
          </TabsContent>

          <TabsContent value="urls" className="space-y-4">
            <UrlUpload />
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <ResourceList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
