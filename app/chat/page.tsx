"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { isAuthenticated, getUserType } from "@/lib/auth-utils";

export default function ChatPage() {
  const router = useRouter();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = isAuthenticated();
    const userType = getUserType();
    setIsAuth(auth);
    setIsLoading(false);

    console.log('[ChatPage] Auth check:', { auth, userType });
    
    // Debug: Check localStorage data
    if (auth && userType === 'employee') {
      const employeeData = localStorage.getItem('employee');
      console.log('[ChatPage] Employee data:', employeeData ? JSON.parse(employeeData) : null);
    } else if (auth && userType === 'company') {
      const companyData = localStorage.getItem('company');
      console.log('[ChatPage] Company data:', companyData ? JSON.parse(companyData) : null);
    }

    if (!auth) {
      router.push("/");
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="animate-spin text-4xl">⏳</span>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-80 border-r overflow-y-auto">
          <ConversationSidebar
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </aside>

        {/* Mobile Sidebar */}
        <div className="md:hidden fixed bottom-4 left-4 z-40">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
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
        </div>

        {/* Main Chat */}
        <main className="flex-1 overflow-hidden">
          <ChatInterface
            conversationId={selectedConversationId}
            onConversationCreated={setSelectedConversationId}
          />
        </main>
      </div>
    </div>
  );
}
