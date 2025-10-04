import { Suspense } from "react"
import dynamic from "next/dynamic"

const RegisterPageContent = dynamic(() => import("@/components/register/register-page-content"), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
})

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <RegisterPageContent />
    </Suspense>
  )
}
