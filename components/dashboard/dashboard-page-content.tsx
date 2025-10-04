"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCompany } from "@/lib/hooks/use-company"
import { MessageSquare, Upload, Sparkles, Building2 } from "lucide-react"

export default function DashboardPageContent() {
  const router = useRouter()
  const { company, isRegistered } = useCompany()

  useEffect(() => {
    if (!isRegistered) {
      router.push("/register")
    }
  }, [isRegistered, router])

  if (!company) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-semibold text-xl">OnboardAI</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>{company.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {company.contactName}!</h1>
          <p className="text-muted-foreground">Manage your onboarding resources and chat with your AI assistant.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resources Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Upload className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Manage Resources</CardTitle>
              <CardDescription>Upload PDFs, documents, or add URLs for your onboarding materials.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/resources">
                <Button className="w-full">Go to Resources</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Chat Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="w-10 h-10 text-primary mb-2" />
              <CardTitle>AI Chat Assistant</CardTitle>
              <CardDescription>Ask questions about your onboarding process and get instant answers.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chat">
                <Button className="w-full">Start Chatting</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Company Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Industry</p>
              <p className="font-medium capitalize">{company.industry}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Company Size</p>
              <p className="font-medium">{company.size} employees</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Email</p>
              <p className="font-medium">{company.email}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
