import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Resource } from "../api-client"
import { useCompany } from "./use-company"

interface ResourceStore {
  resources: Resource[]
  setResources: (resources: Resource[]) => void
  addResource: (resource: Resource) => void
  removeResource: (id: string) => void
}

const useResourceStore = create<ResourceStore>()(
  persist(
    (set) => ({
      resources: [],
      setResources: (resources) => set({ resources }),
      addResource: (resource) => set((state) => ({ resources: [...state.resources, resource] })),
      removeResource: (id) =>
        set((state) => ({
          resources: state.resources.filter((r) => r.id !== id),
        })),
    }),
    {
      name: "resources-storage",
    },
  ),
)

export function useResources() {
  const { company } = useCompany()
  const { resources, addResource, removeResource } = useResourceStore()

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

    addResource(formattedResource)
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

    addResource(formattedResource)
    return formattedResource
  }

  const deleteResource = async (id: string) => {
    removeResource(id)
  }

  return {
    resources,
    uploadFile,
    addUrl,
    deleteResource,
  }
}
