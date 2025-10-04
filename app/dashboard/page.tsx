"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCompany } from "@/lib/hooks/use-company"
import { MessageSquare, Upload, Sparkles, Building2, Edit, Copy, Check, Key, Users } from "lucide-react"

interface EmployeeEmail {
  id: string
  email: string
  password: string
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { company, isRegistered } = useCompany()
  const [loading, setLoading] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [employeeEmails, setEmployeeEmails] = useState<EmployeeEmail[]>([])
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

  const generatePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }

  const handleCreateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim()) return

    setLoading(true)

    try {
      const generatedPassword = generatePassword()
      
      console.log('Creating email:', { companyId: company.id, email: newEmail })
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/employees/create-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: company.id,
          email: newEmail,
          password: generatedPassword,
        }),
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const employeeEmail = await response.json()
        console.log('Email created:', employeeEmail)
        setEmployeeEmails([...employeeEmails, employeeEmail])
        setNewEmail("")
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Failed to create email:', response.status, errorData)
        alert(`Failed to create employee email: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error creating email:", error)
      alert(`Failed to create employee email: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
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
          <p className="text-muted-foreground">Manage onboarding resources and chat with your AI assistant.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
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

        {/* Employee Management Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Company ID Card */}
          <Card className="shadow-lg border-primary/20">
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

          {/* Employee Email Accounts Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <CardTitle>Employee Email Accounts</CardTitle>
              </div>
              <CardDescription>Create email accounts for employees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleCreateEmail} className="space-y-3">
                <div>
                  <Label htmlFor="newEmail" className="text-sm font-medium mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder="employee@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Create Email Account
                    </>
                  )}
                </Button>
              </form>

              {employeeEmails.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-sm font-medium">Created Accounts ({employeeEmails.length})</Label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {employeeEmails.map((emp) => (
                      <div key={emp.id} className="bg-muted/50 rounded-lg p-3 space-y-2 border">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{emp.email}</p>
                            <p className="text-xs text-muted-foreground font-mono truncate">
                              Password: {emp.password}
                            </p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => copyToClipboard(emp.email, `email-${emp.id}`)}
                              title="Copy email"
                            >
                              {copiedId === `email-${emp.id}` ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => copyToClipboard(emp.password, `pass-${emp.id}`)}
                              title="Copy password"
                            >
                              {copiedId === `pass-${emp.id}` ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
