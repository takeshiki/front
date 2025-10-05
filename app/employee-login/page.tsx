"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, LogIn, UserCircle } from "lucide-react"

export default function EmployeeLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Employee login attempt:', { email: formData.email })
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URI || 'http://localhost:8000/api'}/employees/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const employee = await response.json()
        console.log('Employee logged in:', employee)
        localStorage.setItem("access_token", employee.access_token)
        localStorage.setItem("user_type", "employee")
        localStorage.setItem("employee", JSON.stringify(employee))
        router.push("/chat")
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Login failed:', response.status, errorData)
        alert(`Login failed: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Login error:", error)
      alert(`Login failed: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-semibold text-xl">OnboardAI</span>
        </Link>

        <Card className="shadow-xl border-primary/20">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <UserCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Employee Sign In</CardTitle>
            <CardDescription>
              Sign in to access your onboarding materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11">
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/employee-register" className="text-primary hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                Are you a company?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Company sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

