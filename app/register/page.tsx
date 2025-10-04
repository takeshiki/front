"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCompany } from "@/lib/hooks/use-company"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const { setCompany } = useCompany()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size: "",
    contactName: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Sending registration request:', formData)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const company = await response.json()
        console.log('Registration successful:', company)
        // Normalize _id to id for frontend compatibility
        const normalizedCompany = {
          ...company,
          id: company._id || company.id
        }
        setCompany(normalizedCompany)
        router.push("/dashboard")
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Registration failed:', response.status, errorData)
        alert(`Registration failed: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <span className="font-semibold text-lg sm:text-xl">OnboardAI</span>
        </Link>

        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl sm:text-2xl">Company Registration</CardTitle>
            <CardDescription className="text-sm">Create your account in 2 minutes</CardDescription>
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
                    <SelectValue placeholder="Select your industry" />
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
                    <SelectValue placeholder="Select company size" />
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
                <Label htmlFor="contactName" className="text-sm font-medium">Your Full Name</Label>
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

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  minLength={6}
                  required
                  className="h-11"
                />
              </div>

              <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              <p className="text-center text-xs text-muted-foreground pt-2">
                Are you an employee?{" "}
                <Link href="/employee-register" className="text-primary hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
