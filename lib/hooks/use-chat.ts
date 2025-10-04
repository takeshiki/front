import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useCompany } from "./use-company"

export interface Message {
  id: string
  conversationId: string
  role: "user" | "assistant"
  content: string
  sources?: Array<{
    type: "file" | "url"
    title: string
    url?: string
    excerpt?: string
  }>
  createdAt: string
}

export interface Conversation {
  id: string
  companyId: string
  title?: string
  messages: Message[]
  createdAt: string
}

interface ChatStore {
  conversations: Conversation[]
  addConversation: (conversation: Conversation) => void
  addMessage: (conversationId: string, message: Message) => void
  updateConversationTitle: (conversationId: string, title: string) => void
}

const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      conversations: [],
      addConversation: (conversation) =>
        set((state) => ({
          conversations: [...state.conversations, conversation],
        })),
      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, messages: [...conv.messages, message] } : conv,
          ),
        })),
      updateConversationTitle: (conversationId, title) =>
        set((state) => ({
          conversations: state.conversations.map((conv) => (conv.id === conversationId ? { ...conv, title } : conv)),
        })),
    }),
    {
      name: "chat-storage",
    },
  ),
)

export function useChat(conversationId: string | null, onConversationCreate?: (id: string) => void) {
  const { company } = useCompany()
  const { conversations, addConversation, addMessage, updateConversationTitle } = useChatStore()

  const currentConversation = conversationId ? conversations.find((c) => c.id === conversationId) : null

  const messages = currentConversation?.messages || []

  const createConversation = () => {
    if (!company) throw new Error("No company registered")

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      companyId: company.id,
      messages: [],
      createdAt: new Date().toISOString(),
    }

    addConversation(newConversation)
    return newConversation.id
  }

  const sendMessage = async (content: string) => {
    if (!company) throw new Error("No company registered")

    // Auto-create conversation if none exists
    let activeConversationId = conversationId
    if (!activeConversationId) {
      activeConversationId = createConversation()
      onConversationCreate?.(activeConversationId)
    }

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    }
    addMessage(activeConversationId, userMessage)

    // Update conversation title if it's the first message
    if (messages.length === 0) {
      const title = content.slice(0, 50) + (content.length > 50 ? "..." : "")
      updateConversationTitle(activeConversationId, title)
    }

    try {
      // Call RAG API
      const response = await fetch("http://localhost:8000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: content,
          companyId: company.id,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        conversationId: activeConversationId,
        role: "assistant",
        content: data.content,
        sources: data.sources?.map((source: any) => ({
          type: "file" as const,
          title: "Company Document",
          excerpt: source.text,
        })),
        createdAt: new Date().toISOString(),
      }
      addMessage(activeConversationId, aiMessage)
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        conversationId: activeConversationId,
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        createdAt: new Date().toISOString(),
      }
      addMessage(activeConversationId, errorMessage)
    }
  }

  return {
    conversations,
    messages,
    isLoading: false,
    createConversation,
    sendMessage,
  }
}
