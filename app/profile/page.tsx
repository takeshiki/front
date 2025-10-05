"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppHeader } from "@/components/app-header"
import { getUserType } from "@/lib/auth-utils"
import { User, Save, X } from "lucide-react"

const DEPARTMENTS = ["Engineering", "Marketing", "Sales", "HR", "Product", "Design", "Operations", "Finance"]
const ROLES = ["Developer", "Team Lead", "Manager", "Senior Developer", "Junior Developer", "Intern", "Consultant", "Specialist"]
const SKILLS = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C#", "Go", "Rust", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "SQL", "NoSQL"]
const INTERESTS = ["AI/ML", "Web Development", "Mobile Development", "Cloud Computing", "Cybersecurity", "Data Science", "UI/UX", "DevOps", "Blockchain", "IoT"]

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [employee, setEmployee] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    department: "",
  })
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  useEffect(() => {
    const userType = getUserType()
    if (userType !== 'employee') {
      router.push('/')
      return
    }

    // Load employee data from localStorage
    const empData = localStorage.getItem('employee')
    if (empData) {
      try {
        const emp = JSON.parse(empData)
        setEmployee(emp)
        setFormData({
          name: emp.name || "",
          department: emp.department || "",
        })
        setSelectedRoles(emp.tags?.roles || [])
        setSelectedSkills(emp.tags?.skills || [])
        setSelectedInterests(emp.tags?.interests || [])
      } catch (e) {
        console.error('Failed to parse employee data:', e)
        router.push('/employee-login')
      }
    } else {
      router.push('/employee-login')
    }
  }, [router])

  const toggleTag = (tag: string, type: 'roles' | 'skills' | 'interests') => {
    const setters = {
      roles: setSelectedRoles,
      skills: setSelectedSkills,
      interests: setSelectedInterests,
    }
    const getters = {
      roles: selectedRoles,
      skills: selectedSkills,
      interests: selectedInterests,
    }

    const setter = setters[type]
    const current = getters[type]

    setter(current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = {
        name: formData.name,
        department: formData.department,
        tags: {
          roles: selectedRoles,
          skills: selectedSkills,
          interests: selectedInterests,
        },
      }

      console.log('Updating employee:', employee.id, updateData)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URI || 'http://localhost:8000/api'}/employees/${employee.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      )

      if (response.ok) {
        const updatedEmployee = await response.json()
        console.log('Employee updated:', updatedEmployee)
        localStorage.setItem('employee', JSON.stringify(updatedEmployee))
        setEmployee(updatedEmployee)
        alert('Profile updated successfully!')
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Update failed:', response.status, errorData)
        alert(`Update failed: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error('Update error:', error)
      alert(`Update failed: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-spin text-4xl">⏳</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBackButton title="My Profile" />

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Employee Profile</CardTitle>
                <CardDescription>Update your information, skills, and interests</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Cannot be changed)</Label>
                  <Input
                    id="email"
                    value={employee.email}
                    disabled
                    className="h-11 bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept.toLowerCase()} className="py-3">
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Roles</Label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((role) => (
                    <Badge
                      key={role}
                      variant={selectedRoles.includes(role.toLowerCase()) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90 transition-colors px-3 py-1.5"
                      onClick={() => toggleTag(role.toLowerCase(), 'roles')}
                    >
                      {role}
                      {selectedRoles.includes(role.toLowerCase()) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <Badge
                      key={skill}
                      variant={selectedSkills.includes(skill.toLowerCase()) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90 transition-colors px-3 py-1.5"
                      onClick={() => toggleTag(skill.toLowerCase(), 'skills')}
                    >
                      {skill}
                      {selectedSkills.includes(skill.toLowerCase()) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest.toLowerCase()) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90 transition-colors px-3 py-1.5"
                      onClick={() => toggleTag(interest.toLowerCase(), 'interests')}
                    >
                      {interest}
                      {selectedInterests.includes(interest.toLowerCase()) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full h-11">
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

