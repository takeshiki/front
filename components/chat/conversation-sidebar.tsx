"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Plus } from "lucide-react"
import { useChat } from "@/lib/hooks/use-chat"

interface ConversationSidebarProps {
  selectedConversationId: string | null
  onSelectConversation: (id: string | null) => void
}

export function ConversationSidebar({ selectedConversationId, onSelectConversation }: ConversationSidebarProps) {
  const { conversations, createConversation } = useChat(selectedConversationId)

  const handleNewChat = async () => {
    try {
      const newId = await createConversation()
      onSelectConversation(newId)
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <Button onClick={handleNewChat} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          New Conversation
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant={selectedConversationId === conversation.id ? "secondary" : "ghost"}
              className="w-full justify-start gap-2 h-auto py-3 px-3"
              onClick={() => onSelectConversation(conversation.id)}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-medium truncate">{conversation.title || "New Conversation"}</p>
                <p className="text-xs text-muted-foreground">{new Date(conversation.createdAt).toLocaleDateString()}</p>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
