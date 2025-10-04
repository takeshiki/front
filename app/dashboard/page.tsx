"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCompany } from "@/lib/hooks/use-company"
import { MessageSquare, Upload, Building2, Edit, Copy, Check, Key, Users } from "lucide-react"
import { AppHeader } from "@/components/app-header"

interface EmployeeEmail {
  id: string
  email: string
  password: string
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { company, isRegistered } = useCompany()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (!isRegistered || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to access the dashboard</p>
          <Button onClick={() => router.push("/register")}>Register</Button>
        </div>
      </div>
    )
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome, {company.contactName}!</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage onboarding resources and chat with your AI assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Employees Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Employees</CardTitle>
              <CardDescription>View and manage your company's employees and their skills.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/employees">
                <Button className="w-full">View Employees</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Resources Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Upload className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Resource Management</CardTitle>
              <CardDescription>Upload PDFs, documents, or add URLs for onboarding materials.</CardDescription>
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
              <CardDescription>Ask questions about the onboarding process and get instant answers.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chat">
                <Button className="w-full">Start Chat</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Company Info */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Company Information</CardTitle>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
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

        {/* Company ID Card */}
        <Card className="shadow-lg border-primary/20 max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-primary" />
                <CardTitle>Company ID</CardTitle>
              </div>
              <CardDescription>Share this ID with employees for registration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                <Label className="text-xs text-muted-foreground mb-2 block">Your Company ID</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-lg font-mono font-semibold text-foreground bg-background/50 px-3 py-2 rounded border select-all">
                    {company.id || company._id || 'N/A'}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => copyToClipboard(company.id || company._id || '', 'company-id')}
                  >
                    {copiedId === 'company-id' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <div className="flex gap-3">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Employee Registration
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Employees need this ID to sign up. Send it to your HR department or directly to new hires.
                    </p>
                    <a 
                      href="/employee-register" 
                      target="_blank"
                      className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                    >
                      Open registration page →
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
      </main>
    </div>
  )
}
