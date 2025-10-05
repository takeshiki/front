import { useState, useEffect } from "react"
import { useCompany } from "./use-company"
import { getUserType } from "../auth-utils"

// Get companyId from either company or employee
function getCompanyId(): string | null {
  if (typeof window === 'undefined') return null
  
  const userType = getUserType()
  console.log('[useChat] User type:', userType)
  
  if (userType === 'company') {
    const companyData = localStorage.getItem('company-storage')
    if (companyData) {
      try {
        const parsed = JSON.parse(companyData)
        // zustand persist wraps the data in state object
        const company = parsed.state?.company || parsed.company
        console.log('[useChat] Company data:', { id: company?.id, _id: company?._id })
        return company?.id || company?._id || null
      } catch (e) {
        console.error('[useChat] Error parsing company data:', e)
        return null
      }
    }
  } else if (userType === 'employee') {
    const employeeData = localStorage.getItem('employee')
    console.log('[useChat] Employee data exists:', !!employeeData)
    if (employeeData) {
      try {
        const employee = JSON.parse(employeeData)
        console.log('[useChat] Employee companyId:', employee.companyId)
        return employee.companyId
      } catch (e) {
        console.error('[useChat] Error parsing employee data:', e)
        return null
      }
    }
  }
  
  // For testing: use test companyId from localStorage or environment
  const testCompanyId = localStorage.getItem('test_company_id') || process.env.NEXT_PUBLIC_TEST_COMPANY_ID
  if (testCompanyId) {
    console.log('[useChat] Using test company ID:', testCompanyId)
    return testCompanyId
  }
  
  console.log('[useChat] No company ID found')
  return null
}

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
  const [welcomeGenerated, setWelcomeGenerated] = useState(false)

  // Fetch conversations when company changes
  useEffect(() => {
    const fetchConversations = async () => {
      const companyId = getCompanyId()
      if (!companyId) {
        setConversations([])
        return
      }

      try {
        const { api } = await import("../api-client")
        const fetchedConversations = await api.chat.listConversations(companyId)

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

  // Generate welcome message for new employees
  useEffect(() => {
    const generateWelcomeMessage = async () => {
      // Only for employees without conversation and haven't generated welcome yet
      const userType = getUserType()
      if (userType !== 'employee' || conversationId || welcomeGenerated || conversations.length > 0) {
        return
      }

      const companyId = getCompanyId()
      if (!companyId) return

      try {
        // Get employee data
        const employeeData = localStorage.getItem('employee')
        if (!employeeData) return

        const employee = JSON.parse(employeeData)
        
        setWelcomeGenerated(true)
        setIsLoading(true)

        // Create a new conversation
        const { api } = await import("../api-client")
        const newConversationId = await createConversation()
        onConversationCreate?.(newConversationId)

        // Generate personalized welcome message
        const welcomeResponse = await api.chat.generateWelcome({
          companyId,
          employeeName: employee.name,
          department: employee.department,
          tags: employee.tags,
        })

        // Save welcome message to backend
        const welcomeMessage = await api.chat.sendMessage(
          newConversationId,
          welcomeResponse.content,
          "assistant"
        )

        // Add sources if available
        const welcomeMessageWithSources: Message = {
          ...welcomeMessage,
          sources: welcomeResponse.sources?.map((source: any) => ({
            type: source.resource?.type || "file",
            title: source.resource?.title || "Company Document",
            excerpt: source.text,
            resourceId: source.resourceId,
            fileName: source.resource?.fileName,
            fileUrl: source.resource?.fileUrl,
            url: source.resource?.url,
          })),
        }

        setMessages([welcomeMessageWithSources])

        // Update conversation title
        setConversations(prev =>
          prev.map(conv =>
            conv.id === newConversationId
              ? { ...conv, title: "Welcome to OnboardAI" }
              : conv
          )
        )

        console.log('✅ Welcome message generated successfully')
      } catch (error) {
        console.error('Error generating welcome message:', error)
        setWelcomeGenerated(false) // Allow retry
      } finally {
        setIsLoading(false)
      }
    }

    generateWelcomeMessage()
  }, [conversationId, conversations.length, welcomeGenerated, onConversationCreate])

  const createConversation = async () => {
    const companyId = getCompanyId()
    if (!companyId) {
      console.warn("[useChat] No company ID found. Set test_company_id in localStorage or login.")
      throw new Error("No company ID found. Please login or set test_company_id in localStorage for testing.")
    }

    try {
      const { api } = await import("../api-client")
      const newConversation = await api.chat.createConversation(companyId, "New Conversation")

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
    const companyId = getCompanyId()
    if (!companyId) {
      console.warn("[useChat] No company ID found. Set test_company_id in localStorage or login.")
      throw new Error("No company ID found. Please login or set test_company_id in localStorage for testing.")
    }

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
          companyId: companyId,
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
