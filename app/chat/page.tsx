import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Spinner } from "@/components/ui/spinner"

const ChatPageContent = dynamic(() => import("@/components/chat/chat-page-content"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="w-8 h-8" />
    </div>
  ),
})

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
