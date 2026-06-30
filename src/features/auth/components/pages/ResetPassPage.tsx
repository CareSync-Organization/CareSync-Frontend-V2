import { LeftPanelForgotPass } from "../left-panel/LeftPanelForgotPass";
import { ResetPassForm } from "../forms/ResetPassForm";

export function ResetPassPage({ token }: { token: string }) {
  return (
    <main className="flex justify-center items-center lg:justify-start lg:items-stretch">
      <aside className="w-1/2 hidden lg:block">
        <LeftPanelForgotPass />
      </aside>
      <div className="w-full lg:w-1/2 px-12 lg:px-32 py-4 flex flex-col justify-center items-center gap-2">
        <h1>Reset Password</h1>
        <p>Enter and confirm your new password</p>
        <ResetPassForm token={token} />
      </div>
    </main>
  );
}
