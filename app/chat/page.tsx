import { Suspense } from "react"
import ChatPageContent from "@/components/chat/chat-page-content"
import { Spinner } from "@/components/ui/spinner"

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner className="w-8 h-8" />
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  )
}
