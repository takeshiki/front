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

export function useChat(conversationId: string | null) {
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
    if (!conversationId) throw new Error("No conversation selected")

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    }
    addMessage(conversationId, userMessage)

    // Update conversation title if it's the first message
    if (messages.length === 0) {
      const title = content.slice(0, 50) + (content.length > 50 ? "..." : "")
      updateConversationTitle(conversationId, title)
    }

    // Mock AI response for testing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const aiMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      conversationId,
      role: "assistant",
      content: `This is a mock response to: "${content}". In production, this would be an AI-generated answer based on your uploaded resources.`,
      sources: [
        {
          type: "url",
          title: "Employee Handbook",
          url: "https://example.com/handbook",
          excerpt: "This is an example excerpt from the source document...",
        },
      ],
      createdAt: new Date().toISOString(),
    }
    addMessage(conversationId, aiMessage)
  }

  return {
    conversations,
    messages,
    isLoading: false,
    createConversation,
    sendMessage,
  }
}
