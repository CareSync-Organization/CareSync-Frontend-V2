import { SignUpForm } from "../forms/SignUpForm";
import { LeftPanelSignUp } from "../left-panel/LeftPanelSignUp";

type SignUpPageProps = {
  redirectTo?: string;
};

export function SignUpPage({ redirectTo }: SignUpPageProps) {
  return (
    <main className="flex justify-center items-center lg:justify-start lg:items-stretch">
      <aside className="w-1/2 hidden lg:block">
        <LeftPanelSignUp />
      </aside>
      <div className="w-full lg:w-1/2 px-12 lg:px-32 py-4 flex flex-col justify-center items-center gap-2">
        <h1>Create Your Account</h1>
        <p>Join our customer care platform</p>
        <SignUpForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}
