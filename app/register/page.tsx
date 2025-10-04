import { Suspense } from "react"
import RegisterPageContent from "@/components/register/register-page-content"

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <RegisterPageContent />
    </Suspense>
  )
}
