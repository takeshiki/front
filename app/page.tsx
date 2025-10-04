import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, MessageSquare, Upload, Sparkles, Building2, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="font-semibold text-lg sm:text-xl">OnboardAI</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/employee-login">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Employee</span>
                <span className="sm:hidden">Employee</span>
              </Button>
            </Link>
            <Link href="/company-login">
              <Button size="sm" className="text-xs sm:text-sm">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Company</span>
                <span className="sm:hidden">Company</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - No Scroll */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                AI-Powered
                <span className="block text-primary mt-2">Employee Onboarding</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Transform your onboarding process with intelligent AI assistance
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-2" />
                  <CardTitle className="text-base sm:text-lg">Resource Management</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Upload documents and add URLs in one place
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-2" />
                  <CardTitle className="text-base sm:text-lg">AI Chat Assistant</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Instant answers to employee questions 24/7
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-2" />
                  <CardTitle className="text-base sm:text-lg">Source Attribution</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Every answer includes references to your documents
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-2" />
                  <CardTitle className="text-base sm:text-lg">For Companies</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Build knowledge base and automate onboarding
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p>OnboardAI - Intelligent Employee Onboarding</p>
        </div>
      </footer>
    </div>
  )
}
