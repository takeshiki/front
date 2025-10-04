// API Client for communicating with backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export interface Company {
  id: string
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
    list: (companyId: string) => this.request<Resource[]>(`/companies/${companyId}/resources`),

    uploadFile: async (companyId: string, file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("companyId", companyId)

      const response = await fetch(`${API_BASE_URL}/resources/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      return response.json() as Promise<Resource>
    },

    addUrl: (companyId: string, url: string, title?: string) =>
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
    listConversations: (companyId: string) => this.request<Conversation[]>(`/companies/${companyId}/conversations`),

    createConversation: (companyId: string) =>
      this.request<Conversation>("/conversations", {
        method: "POST",
        body: JSON.stringify({ companyId }),
      }),

    getMessages: (conversationId: string) => this.request<Message[]>(`/conversations/${conversationId}/messages`),

    sendMessage: (conversationId: string, content: string) =>
      this.request<Message>(`/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
  }
}

export const api = new ApiClient()
