// API Client for communicating with backend
const API_BASE_URL = process.env.NEXT_PUBLIC_BACK_URI || "http://localhost:8000/api"

export interface Company {
  id: string
  _id?: string
  name: string
  industry: string
  size: string
  contactName: string
  email: string
  createdAt: string
}

export interface Resource {
  id: string
  companyId: string
  type: "file" | "url"
  title: string
  url?: string
  fileUrl?: string
  tags: string[]
  createdAt: string
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
  }>
  createdAt: string
}

export interface Conversation {
  id: string
  companyId: string
  title?: string
  createdAt: string
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Company endpoints
  company = {
    register: (data: Omit<Company, "id" | "createdAt">) =>
      this.request<Company>("/companies", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    get: (id: string) => this.request<Company>(`/companies/${id}`),
  }

  // Resource endpoints
  resources = {
    list: (companyId: string) => this.request<Resource[]>(`/resources/company/${companyId}`),

    uploadFile: async (companyId: string, file: File, title?: string) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("companyId", companyId)
      if (title) formData.append("title", title)

      const response = await fetch(`${API_BASE_URL}/resources/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      return response.json() as Promise<Resource>
    },

    addUrl: (companyId: string, url: string, title: string) =>
      this.request<Resource>("/resources/url", {
        method: "POST",
        body: JSON.stringify({ companyId, url, title }),
      }),

    delete: (id: string) =>
      this.request<void>(`/resources/${id}`, {
        method: "DELETE",
      }),
  }

  // Chat endpoints
  chat = {
    listConversations: (companyId: string) => this.request<Conversation[]>(`/conversations/company/${companyId}`),

    createConversation: (companyId: string, title: string) =>
      this.request<Conversation>("/conversations", {
        method: "POST",
        body: JSON.stringify({ companyId, title }),
      }),

    getMessages: (conversationId: string) => this.request<Message[]>(`/messages/conversation/${conversationId}`),

    sendMessage: (conversationId: string, content: string, role: "user" | "assistant" = "user") =>
      this.request<Message>("/messages", {
        method: "POST",
        body: JSON.stringify({ conversationId, content, role }),
      }),

    generateWelcome: (data: {
      companyId: string
      employeeName?: string
      department?: string
      tags?: {
        roles?: string[]
        skills?: string[]
        interests?: string[]
      }
    }) =>
      this.request<{ content: string; sources: any[] }>("/ai/welcome", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  }
}

export const api = new ApiClient()
