"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, X } from "lucide-react"

const ROLES = ["Developer", "Team Lead", "Manager", "Designer", "Product Manager", "QA Engineer", "DevOps", "Data Scientist"]
const SKILLS = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C#", "Go", "Rust", "Docker", "Kubernetes", "AWS", "Azure", "GCP"]
const INTERESTS = ["AI/ML", "Web Development", "Mobile Development", "Cloud Computing", "Cybersecurity", "Data Science", "UI/UX", "DevOps"]

export default function EmployeeRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyId: "",
    department: "",
  })
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const toggleTag = (tag: string, type: 'roles' | 'skills' | 'interests') => {
    if (type === 'roles') {
      setSelectedRoles(prev => 
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      )
    } else if (type === 'skills') {
      setSelectedSkills(prev => 
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      )
    } else {
      setSelectedInterests(prev => 
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate Company ID format (MongoDB ObjectId is 24 hex characters)
      if (!formData.companyId || formData.companyId.length !== 24 || !/^[a-f0-9]{24}$/i.test(formData.companyId)) {
        alert('Invalid Company ID format. Please enter a valid 24-character company ID (provided by your HR department).')
        setLoading(false)
        return
      }

      const payload = {
        ...formData,
        tags: {
          roles: selectedRoles,
          skills: selectedSkills,
          interests: selectedInterests,
        },
      }
      
      console.log('Sending employee registration:', payload)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URI || 'http://localhost:8000/api'}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const employee = await response.json()
        console.log('Employee registered:', employee)
        localStorage.setItem("access_token", employee.access_token)
        localStorage.setItem("user_type", "employee")
        router.push("/chat")
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <span className="font-semibold text-lg sm:text-xl">OnboardAI</span>
        </Link>

        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl sm:text-2xl">Employee Registration</CardTitle>
            <CardDescription className="text-sm">Create your profile in 3 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-primary">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
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

                <div className="space-y-2">
                  <Label htmlFor="companyId" className="text-sm font-medium">Company ID</Label>
                  <Input
                    id="companyId"
                    placeholder="24-character ID (e.g., 507f1f77bcf86cd799439011)"
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value.toLowerCase().trim() })}
                    required
                    className="h-11 font-mono text-sm"
                    maxLength={24}
                    pattern="[a-f0-9]{24}"
                    title="Must be a 24-character hexadecimal string"
                  />
                  <p className="text-xs text-muted-foreground">Ask your HR department for this 24-character company ID</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                    required
                  >
                    <SelectTrigger id="department" className="h-11 w-full">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="engineering" className="py-3">Engineering & Development</SelectItem>
                      <SelectItem value="marketing" className="py-3">Marketing & Communications</SelectItem>
                      <SelectItem value="sales" className="py-3">Sales & Business Development</SelectItem>
                      <SelectItem value="hr" className="py-3">Human Resources</SelectItem>
                      <SelectItem value="finance" className="py-3">Finance & Accounting</SelectItem>
                      <SelectItem value="operations" className="py-3">Operations & Support</SelectItem>
                      <SelectItem value="other" className="py-3">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-4 border-t pt-5">
                {/* Roles */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-primary">Role(s)</Label>
                    <span className="text-xs text-muted-foreground">Optional</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Select one or more that apply to you</p>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((role) => (
                      <Badge
                        key={role}
                        variant={selectedRoles.includes(role) ? "default" : "outline"}
                        className="cursor-pointer hover:opacity-80 text-xs transition-all px-3 py-1.5"
                        onClick={() => toggleTag(role, 'roles')}
                      >
                        {role}
                        {selectedRoles.includes(role) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-primary">Skills</Label>
                    <span className="text-xs text-muted-foreground">Optional</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Choose your technical and professional skills</p>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill) => (
                      <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer hover:opacity-80 text-xs transition-all px-3 py-1.5"
                        onClick={() => toggleTag(skill, 'skills')}
                      >
                        {skill}
                        {selectedSkills.includes(skill) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-primary">Interests</Label>
                    <span className="text-xs text-muted-foreground">Optional</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">What areas are you interested in?</p>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <Badge
                        key={interest}
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        className="cursor-pointer hover:opacity-80 text-xs transition-all px-3 py-1.5"
                        onClick={() => toggleTag(interest, 'interests')}
                      >
                        {interest}
                        {selectedInterests.includes(interest) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
                {loading ? "Creating Profile..." : "Create Profile"}
              </Button>

              <p className="text-center text-xs text-muted-foreground pt-2">
                Registering a company?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Company sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
