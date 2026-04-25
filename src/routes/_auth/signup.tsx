import { SignUpPage } from '@/features/auth/components/pages/SignUpPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/signup')({
  head: () => ({
    meta: [{title: "SignUp | CareSync"}]
  }) ,
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <SignUpPage />
  </div>
}
