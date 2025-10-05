import { useState, useEffect } from "react"
import type { Resource } from "../api-client"
import { useCompany } from "./use-company"

export function useResources(companyId: string) {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { company } = useCompany()

  // Fetch resources when companyId changes
  useEffect(() => {
    const fetchResources = async () => {
      if (!companyId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const { api } = await import("../api-client")
        const fetchedResources = await api.resources.list(companyId)
        setResources(fetchedResources)
      } catch (error) {
        console.error('Error fetching resources:', error)
        setResources([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [companyId])

  const uploadFile = async (file: File) => {
    if (!company) throw new Error("No company registered")

    const { api } = await import("../api-client")
    const resource: any = await api.resources.uploadFile(company.id, file, file.name)

    const formattedResource: Resource = {
      id: resource._id || resource.id,
      companyId: typeof resource.companyId === 'string' ? resource.companyId : resource.companyId.toString(),
      type: resource.type,
      title: resource.title,
      fileUrl: resource.fileUrl,
      tags: resource.tags || [],
      createdAt: typeof resource.createdAt === 'string' ? resource.createdAt : resource.createdAt.toString(),
    }

    setResources(prev => [...prev, formattedResource])

    // Process the file for RAG (create embeddings)
    try {
      const resourceId = resource._id || resource.id
      await fetch(`http://localhost:8000/api/ai/process-file/${resourceId}`, {
        method: 'POST',
      })
      console.log(`File processed for RAG: ${resourceId}`)
    } catch (error) {
      console.error('Error processing file for RAG:', error)
      // Don't fail the upload if processing fails
    }

    return formattedResource
  }

  const addUrl = async (url: string, title?: string) => {
    if (!company) throw new Error("No company registered")

    const { api } = await import("../api-client")
    const resource: any = await api.resources.addUrl(company.id, url, title || new URL(url).hostname)

    const formattedResource: Resource = {
      id: resource._id || resource.id,
      companyId: typeof resource.companyId === 'string' ? resource.companyId : resource.companyId.toString(),
      type: resource.type,
      title: resource.title,
      url: resource.url,
      tags: resource.tags || [],
      createdAt: typeof resource.createdAt === 'string' ? resource.createdAt : resource.createdAt.toString(),
    }

    setResources(prev => [...prev, formattedResource])

    // Process the URL for RAG (create embeddings)
    try {
      const resourceId = resource._id || resource.id
      await fetch(`http://localhost:8000/api/ai/process-url/${resourceId}`, {
        method: 'POST',
      })
      console.log(`URL processed for RAG: ${resourceId}`)
    } catch (error) {
      console.error('Error processing URL for RAG:', error)
      // Don't fail the upload if processing fails
    }

    return formattedResource
  }

  const deleteResource = async (id: string) => {
    try {
      const { api } = await import("../api-client")
      await api.resources.delete(id)
      setResources(prev => prev.filter(r => r.id !== id))
    } catch (error) {
      console.error('Error deleting resource:', error)
      throw error
    }
  }

  return {
    resources,
    isLoading,
    uploadFile,
    addUrl,
    removeResource: deleteResource,
  }
}
