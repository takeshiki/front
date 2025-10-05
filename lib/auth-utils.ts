// Utility functions for authentication and user type detection

export type UserType = 'employee' | 'company' | null

export function getUserType(): UserType {
  if (typeof window === 'undefined') return null
  return (localStorage.getItem('user_type') as UserType) || null
}

export function isEmployee(): boolean {
  return getUserType() === 'employee'
}

export function isCompany(): boolean {
  return getUserType() === 'company'
}

export function getHomePath(): string {
  const userType = getUserType()
  if (userType === 'employee') return '/chat'
  if (userType === 'company') return '/dashboard'
  return '/'
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for employee token or company data
  const hasEmployeeToken = !!localStorage.getItem('access_token')
  const hasCompanyData = !!localStorage.getItem('company-storage')
  
  return hasEmployeeToken || hasCompanyData
}

export function logout() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('access_token')
  localStorage.removeItem('user_type')
  localStorage.removeItem('employee')
  localStorage.removeItem('company-storage') // zustand persist storage
  localStorage.removeItem('company') // legacy key (if exists)
}

