"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useCompany } from "@/lib/hooks/use-company"

export default function LoginPage() {
  const [companyEmail, setCompanyEmail] = useState("")
  const [companyPassword, setCompanyPassword] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setCompany } = useCompany()

  const handleCompanyLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URI}/auth/company/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: companyEmail,
          password: companyPassword,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("user_type", "company")

        // Fetch company profile
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URI}/auth/company/profile`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        })

        if (profileResponse.ok) {
          const companyData = await profileResponse.json()
          setCompany(companyData)
        }

        window.location.href = "/dashboard"
      } else {
        alert("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URI}/auth/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("user_type", "user")

        // Fetch user profile and their company
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URI}/auth/user/profile`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        })

        if (profileResponse.ok) {
          const userData = await profileResponse.json()
          // Set the user's company data to enable access
          if (userData.company) {
            setCompany(userData.company)
          }
        }

        window.location.href = "/chat"
      } else {
        alert("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-primary" />
          <span className="font-semibold text-2xl">OnboardAI</span>
        </div>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="company">Organization</TabsTrigger>
            <TabsTrigger value="user">Employee</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Organization Login</CardTitle>
                <CardDescription>Sign in to manage your onboarding resources</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCompanyLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input
                      id="company-email"
                      type="email"
                      placeholder="org@example.com"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-password">Password</Label>
                    <Input
                      id="company-password"
                      type="password"
                      value={companyPassword}
                      onChange={(e) => setCompanyPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      Register
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>Employee Login</CardTitle>
                <CardDescription>Access your onboarding resources and AI assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="employee@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Password</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
