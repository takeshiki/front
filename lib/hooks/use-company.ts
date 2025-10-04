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
      setCompany: (company) => set({ company, isRegistered: true }),
      clearCompany: () => set({ company: null, isRegistered: false }),
    }),
    {
      name: "company-storage",
    },
  ),
)
