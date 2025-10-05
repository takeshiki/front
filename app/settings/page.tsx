"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCompany } from "@/lib/hooks/use-company"
import { Sparkles, ArrowLeft } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { company, isRegistered, setCompany } = useCompany()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size: "",
    contactName: "",
    email: "",
  })

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        industry: company.industry,
        size: company.size,
        contactName: company.contactName,
        email: company.email,
      })
    }
  }, [company])

  if (!isRegistered || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to access settings</p>
          <Button onClick={() => router.push("/register")}>Go to Registration</Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Updating company:', formData)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URI || 'http://localhost:8000/api'}/companies/${company.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const updatedCompany = await response.json()
        console.log('Company updated:', updatedCompany)
        setCompany(updatedCompany)
        router.push("/dashboard")
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Update failed:', response.status, errorData)
        alert(`Update failed: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Update error:", error)
      alert(`Update failed: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="font-semibold text-lg sm:text-xl">OnboardAI</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Company Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Update your company information</p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Company Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Acme Inc."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  required
                >
                  <SelectTrigger id="industry" className="h-11 w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="technology" className="py-3">Technology & Software</SelectItem>
                    <SelectItem value="finance" className="py-3">Finance & Banking</SelectItem>
                    <SelectItem value="healthcare" className="py-3">Healthcare & Medical</SelectItem>
                    <SelectItem value="retail" className="py-3">Retail & E-commerce</SelectItem>
                    <SelectItem value="manufacturing" className="py-3">Manufacturing & Industrial</SelectItem>
                    <SelectItem value="other" className="py-3">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size" className="text-sm font-medium">Company Size</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => setFormData({ ...formData, size: value })}
                  required
                >
                  <SelectTrigger id="size" className="h-11 w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="1-10" className="py-3">1-10 employees</SelectItem>
                    <SelectItem value="11-50" className="py-3">11-50 employees</SelectItem>
                    <SelectItem value="51-200" className="py-3">51-200 employees</SelectItem>
                    <SelectItem value="201-500" className="py-3">201-500 employees</SelectItem>
                    <SelectItem value="501+" className="py-3">501+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-sm font-medium">Contact Name</Label>
                <Input
                  id="contactName"
                  placeholder="e.g., John Doe"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button type="submit" className="flex-1 h-11" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => router.push("/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

