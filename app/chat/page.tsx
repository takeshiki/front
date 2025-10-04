"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCompany } from "@/lib/hooks/use-company"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ConversationSidebar } from "@/components/chat/conversation-sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sparkles, Menu } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  const router = useRouter()
  const { company, isRegistered } = useCompany()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  if (!isRegistered || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to access the chat</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <ConversationSidebar
                  selectedConversationId={selectedConversationId}
                  onSelectConversation={setSelectedConversationId}
                />
              </SheetContent>
            </Sheet>

            <Link href="/dashboard" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-semibold text-xl">OnboardAI</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-80 border-r bg-muted/10">
          <ConversationSidebar
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </aside>

        {/* Chat Area */}
        <main className="flex-1 overflow-hidden">
          <ChatInterface conversationId={selectedConversationId} />
        </main>
      </div>
    </div>
  )
}
