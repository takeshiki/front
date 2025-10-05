import { useState, useEffect } from "react"
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
    resourceId?: string
    fileName?: string
    fileUrl?: string
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

export function useChat(conversationId: string | null, onConversationCreate?: (id: string) => void) {
  const { company } = useCompany()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch conversations when company changes
  useEffect(() => {
    const fetchConversations = async () => {
      if (!company?.id) {
        setConversations([])
        return
      }

      try {
        const { api } = await import("../api-client")
        const fetchedConversations = await api.chat.listConversations(company.id)

        // Convert to local format with messages array
        const conversationsWithMessages = await Promise.all(
          fetchedConversations.map(async (conv) => {
            const msgs = await api.chat.getMessages(conv.id)
            return {
              ...conv,
              messages: msgs,
            }
          })
        )

        setConversations(conversationsWithMessages)
      } catch (error) {
        console.error('Error fetching conversations:', error)
        setConversations([])
      }
    }

    fetchConversations()
  }, [company?.id])

  // Fetch messages when conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) {
        setMessages([])
        return
      }

      try {
        const { api } = await import("../api-client")
        const fetchedMessages = await api.chat.getMessages(conversationId)
        setMessages(fetchedMessages)
      } catch (error) {
        console.error('Error fetching messages:', error)
        setMessages([])
      }
    }

    fetchMessages()
  }, [conversationId])

  const createConversation = async () => {
    if (!company) throw new Error("No company registered")

    try {
      const { api } = await import("../api-client")
      const newConversation = await api.chat.createConversation(company.id, "New Conversation")

      const conversationWithMessages: Conversation = {
        ...newConversation,
        messages: [],
      }

      setConversations(prev => [...prev, conversationWithMessages])
      return newConversation.id
    } catch (error) {
      console.error('Error creating conversation:', error)
      throw error
    }
  }

  const sendMessage = async (content: string) => {
    if (!company) throw new Error("No company registered")

    // Auto-create conversation if none exists
    let activeConversationId = conversationId
    if (!activeConversationId) {
      activeConversationId = await createConversation()
      onConversationCreate?.(activeConversationId)
    }

    setIsLoading(true)

    try {
      const { api } = await import("../api-client")

      // Save user message to backend
      const userMessage = await api.chat.sendMessage(activeConversationId, content, "user")
      setMessages(prev => [...prev, userMessage])

      // Call RAG API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URI || 'http://localhost:8000/api'}/ai/chat`, {
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

      // Save AI response to backend
      const aiMessageContent = data.content || data.answer || "I'm sorry, I couldn't generate a response."
      const aiMessage = await api.chat.sendMessage(activeConversationId, aiMessageContent, "assistant")

      // Add sources if available
      const aiMessageWithSources: Message = {
        ...aiMessage,
        sources: data.sources?.map((source: any) => ({
          type: source.resource?.type || "file",
          title: source.resource?.title || "Company Document",
          excerpt: source.text,
          resourceId: source.resourceId,
          fileName: source.resource?.fileName,
          fileUrl: source.resource?.fileUrl,
          url: source.resource?.url,
        })),
      }

      setMessages(prev => [...prev, aiMessageWithSources])

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        const title = content.slice(0, 50) + (content.length > 50 ? "..." : "")
        setConversations(prev =>
          prev.map(conv =>
            conv.id === activeConversationId
              ? { ...conv, title }
              : conv
          )
        )
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message locally only (don't save to backend)
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        conversationId: activeConversationId,
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    conversations,
    messages,
    isLoading,
    createConversation,
    sendMessage,
  }
}
