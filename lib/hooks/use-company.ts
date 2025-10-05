import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Company } from "../api-client"

interface CompanyStore {
  company: Company | null
  isRegistered: boolean
  setCompany: (company: Company) => void
  clearCompany: () => void
}

export const useCompany = create<CompanyStore>()(
  persist(
    (set) => ({
      company: null,
      isRegistered: false,
      setCompany: (company) => {
        // Normalize _id to id for frontend compatibility
        const normalizedCompany = {
          ...company,
          id: company.id || (company as any)._id
        }
        set({ company: normalizedCompany, isRegistered: true })
      },
      clearCompany: () => set({ company: null, isRegistered: false }),
    }),
    {
      name: "company-storage",
      // Migration to normalize old data with _id to id
      migrate: (persistedState: any, version: number) => {
        if (persistedState?.company && !persistedState.company.id && persistedState.company._id) {
          persistedState.company.id = persistedState.company._id
        }
        return persistedState
      },
    },
  ),
)
