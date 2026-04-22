import { LeftPanelLogin } from "@/features/auth/components/left-panel/LeftPanelLogin"
import { LoginForm } from "@/features/auth/components/forms/LoginForm"

export function LoginPage() {
    return (
    <main className="flex justify-center items-center lg:justify-start lg:items-stretch">
        <aside className="w-1/2 hidden lg:block">
        <LeftPanelLogin />
        </aside>
        <div className="w-full lg:w-1/2 px-12 lg:px-32 py-4 flex flex-col justify-center items-center gap-2">
        <h1>Welcome Back</h1>
        <p>Sign in to your account to continue</p>
        <LoginForm />
        </div>
    </main>

    )
}