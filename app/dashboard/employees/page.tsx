"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCompany } from "@/lib/hooks/use-company"
import { AppHeader } from "@/components/app-header"
import { Search, Users, Briefcase, Code, Heart } from "lucide-react"

interface Employee {
  id: string
  _id: string
  name: string
  email: string
  companyId: string
  department: string
  tags?: {
    roles?: string[]
    skills?: string[]
    interests?: string[]
  }
  createdAt: string
}

export default function EmployeesListPage() {
  const router = useRouter()
  const { company, isRegistered } = useCompany()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isRegistered || !company) {
      router.push("/register")
      return
    }

    fetchEmployees()
  }, [company, isRegistered, router])

  const fetchEmployees = async () => {
    try {
      console.log('Fetching employees for company:', company?.id)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/employees/company/${company?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      console.log('Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Employees fetched:', data)
        setEmployees(data)
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Failed to fetch employees:', response.status, errorData)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isRegistered || !company) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBackButton backPath="/dashboard" title="Employees" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Employees</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage your company's employees
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{employees.length}</p>
                  <p className="text-xs text-muted-foreground">Total Employees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{new Set(employees.map(e => e.department)).size}</p>
                  <p className="text-xs text-muted-foreground">Departments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees List */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <span className="animate-spin text-4xl">⏳</span>
                <p className="mt-4 text-muted-foreground">Loading employees...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredEmployees.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No employees found matching your search" : "No employees yet"}
                </p>
                {!searchTerm && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Employees will appear here after they register with your Company ID
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{employee.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{employee.email}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {employee.department}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Roles */}
                  {employee.tags?.roles && employee.tags.roles.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Roles</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {employee.tags.roles.map((role) => (
                          <Badge key={role} variant="secondary" className="capitalize">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {employee.tags?.skills && employee.tags.skills.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Code className="w-4 h-4" />
                        <span>Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {employee.tags.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  {employee.tags?.interests && employee.tags.interests.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        <span>Interests</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {employee.tags.interests.map((interest) => (
                          <Badge key={interest} variant="outline" className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-300">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Joined Date */}
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Joined {new Date(employee.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

