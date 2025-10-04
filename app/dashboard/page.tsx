"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCompany } from "@/lib/hooks/use-company"
import { MessageSquare, Upload, Sparkles, Building2, Edit, Copy, Check } from "lucide-react"

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
          <p className="text-muted-foreground mb-4">Будь ласка, увійдіть щоб отримати доступ до панелі</p>
          <Button onClick={() => router.push("/register")}>Реєстрація</Button>
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
          <h1 className="text-3xl font-bold mb-2">Вітаємо, {company.contactName}!</h1>
          <p className="text-muted-foreground">Керуйте ресурсами онбордингу та спілкуйтеся з AI-помічником.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Resources Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Upload className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Керування ресурсами</CardTitle>
              <CardDescription>Завантажте PDF, документи або додайте URL для матеріалів онбордингу.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/resources">
                <Button className="w-full">Перейти до ресурсів</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Chat Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="w-10 h-10 text-primary mb-2" />
              <CardTitle>AI Чат-помічник</CardTitle>
              <CardDescription>Задавайте питання про процес онбордингу та отримуйте миттєві відповіді.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chat">
                <Button className="w-full">Почати чат</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Company Info */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Інформація про компанію</CardTitle>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Редагувати
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Галузь</p>
              <p className="font-medium capitalize">{company.industry}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Розмір компанії</p>
              <p className="font-medium">{company.size} співробітників</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Контактний email</p>
              <p className="font-medium">{company.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Employee Email Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Корпоративні Email-акаунти</CardTitle>
            <CardDescription>Створюйте email-акаунти для співробітників</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateEmail} className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="employee@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Створення..." : "Створити Email"}
              </Button>
            </form>

            {employeeEmails.length > 0 && (
              <div className="space-y-2 mt-4">
                <Label>Створені акаунти:</Label>
                {employeeEmails.map((emp) => (
                  <div key={emp.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{emp.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Пароль: {emp.password}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(emp.email, `email-${emp.id}`)}
                        >
                          {copiedId === `email-${emp.id}` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(emp.password, `pass-${emp.id}`)}
                        >
                          {copiedId === `pass-${emp.id}` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
