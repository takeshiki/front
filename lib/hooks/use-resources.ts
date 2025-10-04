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

    // Mock upload for testing
    const mockResource: Resource = {
      id: `resource-${Date.now()}`,
      companyId: company.id,
      type: "file",
      title: file.name,
      fileUrl: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
    }

    addResource(mockResource)
    return mockResource
  }

  const addUrl = async (url: string, title?: string) => {
    if (!company) throw new Error("No company registered")

    // Mock add URL for testing
    const mockResource: Resource = {
      id: `resource-${Date.now()}`,
      companyId: company.id,
      type: "url",
      title: title || new URL(url).hostname,
      url,
      createdAt: new Date().toISOString(),
    }

    addResource(mockResource)
    return mockResource
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
