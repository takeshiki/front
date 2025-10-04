"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Building2, UserCircle, LogOut, Menu, Home } from "lucide-react"
import { getUserType, getHomePath, logout } from "@/lib/auth-utils"
import { useCompany } from "@/lib/hooks/use-company"
import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface AppHeaderProps {
  showBackButton?: boolean
  backPath?: string
  title?: string
}

export function AppHeader({ showBackButton = false, backPath, title }: AppHeaderProps) {
  const router = useRouter()
  const { company } = useCompany()
  const [userType, setUserType] = useState<string | null>(null)
  const [employee, setEmployee] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setUserType(getUserType())
    if (typeof window !== 'undefined') {
      const empData = localStorage.getItem('employee')
      if (empData) {
        try {
          setEmployee(JSON.parse(empData))
        } catch (e) {
          console.error('Failed to parse employee data:', e)
        }
      }
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleBack = () => {
    if (backPath) {
      router.push(backPath)
    } else {
      router.push(getHomePath())
    }
  }

  const navItems = userType === 'company' ? [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Employees', path: '/dashboard/employees', icon: UserCircle },
    { label: 'Resources', path: '/resources', icon: Building2 },
    { label: 'Chat', path: '/chat', icon: Sparkles },
  ] : userType === 'employee' ? [
    { label: 'Chat', path: '/chat', icon: Sparkles },
    { label: 'Resources', path: '/resources', icon: Building2 },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ] : []

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo or Back + Title */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {showBackButton ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="shrink-0"
                >
                  <Home className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                {title && (
                  <h1 className="font-semibold text-base sm:text-lg truncate">{title}</h1>
                )}
              </>
            ) : (
              <Link href={getHomePath()} className="flex items-center gap-2 shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <span className="font-semibold text-base sm:text-xl">OnboardAI</span>
              </Link>
            )}
          </div>

          {/* Right: User info + Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Desktop Navigation */}
            {userType && (
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <item.icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{item.label}</span>
                    </Button>
                  </Link>
                ))}
              </nav>
            )}

            {/* User Info */}
            {userType && (
              <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-muted-foreground px-3 py-1.5 bg-muted/50 rounded-full">
                {userType === 'company' ? (
                  <>
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="max-w-[100px] sm:max-w-[150px] truncate">
                      {company?.name || 'Company'}
                    </span>
                  </>
                ) : (
                  <>
                    <UserCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="max-w-[100px] sm:max-w-[150px] truncate">
                      {employee?.name || 'Employee'}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Logout Button */}
            {userType && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            )}

            {/* Mobile Menu */}
            {userType && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span>OnboardAI</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {/* User Info in Mobile */}
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      {userType === 'company' ? (
                        <>
                          <Building2 className="w-8 h-8 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {company?.name || 'Company'}
                            </p>
                            <p className="text-xs text-muted-foreground">Company Account</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <UserCircle className="w-8 h-8 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {employee?.name || 'Employee'}
                            </p>
                            <p className="text-xs text-muted-foreground">Employee Account</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button variant="ghost" className="w-full justify-start gap-3">
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </nav>

                    {/* Logout */}
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

