import { LeftPanelForgotPass } from "../left-panel/LeftPanelForgotPass";
import { ForgotPassForm } from "../forms/ForgotPassForm";

export function ForgotPassPage() {
  return (
    <main className="flex justify-center items-center lg:justify-start lg:items-stretch">
      <aside className="w-1/2 hidden lg:block">
        <LeftPanelForgotPass />
      </aside>
      <div className="w-full lg:w-1/2 px-12 lg:px-32 py-4 flex flex-col justify-center items-center gap-2">
        <h1>Forgot Password</h1>
        <p>Enter your email to receive a reset link</p>
        <ForgotPassForm />
      </div>
    </main>
  );
}
