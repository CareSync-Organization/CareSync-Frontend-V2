import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle, Clock, Mail } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { ApiError } from "@/lib/api";
import { useMe } from "@/features/auth/api/auth.queries";
import {
    useAcceptInvitation,
    useInvitationDetails,
} from "@/features/users/api/users.queries";

const searchSchema = z.object({ token: z.string().min(1) });

export const Route = createFileRoute("/invite/accept")({
    head: () => ({ meta: [{ title: "Accept Invitation | CareSync" }] }),
    validateSearch: searchSchema,
    component: RouteComponent,
});

function RouteComponent() {
    const { token } = Route.useSearch();
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);

    const { data: user } = useMe();
    const { data: invitation, isLoading, isError, error } = useInvitationDetails(token);
    const acceptMutation = useAcceptInvitation();

    const inviteRedirect = `/invite/accept?token=${token}`;

    async function handleAccept() {
        try {
            await acceptMutation.mutateAsync(token);
            setAccepted(true);
            toast.success("You have joined the store!");
            setTimeout(() => navigate({ to: "/" }), 2000);
        } catch {
            toast.error("Failed to accept invitation. It may have expired.");
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm space-y-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                        <Mail className="size-7" />
                    </span>
                    <h1 className="text-xl font-semibold">Team Invitation</h1>
                </div>

                {isLoading ? (
                    <p className="text-center text-sm text-muted-foreground">
                        Loading invitation details...
                    </p>
                ) : isError ? (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center space-y-2">
                        <p className="text-sm font-medium text-destructive">
                            {error instanceof ApiError && error.status === 0
                                ? "Could not reach the server. Check your connection."
                                : "This invitation is invalid or has expired."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {error instanceof ApiError && error.status === 0
                                ? "Make sure the app is online and try again."
                                : "Ask the store admin to send a new invite."}
                        </p>
                    </div>
                ) : accepted ? (
                    <div className="flex flex-col items-center gap-3 text-center">
                        <CheckCircle className="size-10 text-green-500" />
                        <p className="text-sm font-medium">Invitation accepted!</p>
                        <p className="text-xs text-muted-foreground">
                            Redirecting you to the dashboard...
                        </p>
                    </div>
                ) : invitation ? (
                    <div className="space-y-4">
                        <div className="rounded-xl border bg-muted/40 p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Store</span>
                                <span className="font-medium">{invitation.store_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Invited by</span>
                                <span className="font-medium">{invitation.inviter_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">For</span>
                                <span className="font-medium">{invitation.invited_email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Expires</span>
                                <span className="flex items-center gap-1 text-xs text-amber-600">
                                    <Clock className="size-3" />
                                    {new Date(invitation.expires_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {user ? (
                            user.email.toLowerCase() === invitation.invited_email.toLowerCase() ? (
                                <ActionButton
                                    type="button"
                                    className="w-full"
                                    isLoading={acceptMutation.isPending}
                                    loadingText="Accepting..."
                                    onClick={handleAccept}
                                >
                                    Accept Invitation
                                </ActionButton>
                            ) : (
                                <div className="space-y-3">
                                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-center text-xs text-muted-foreground">
                                        You are signed in as <strong>{user.email}</strong> but this
                                        invitation was sent to{" "}
                                        <strong>{invitation.invited_email}</strong>. Sign in with the
                                        correct account to accept.
                                    </div>
                                    <ActionButton
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() =>
                                            navigate({
                                                to: "/login",
                                                search: { redirect: inviteRedirect },
                                            })
                                        }
                                    >
                                        Sign in with a different account
                                    </ActionButton>
                                </div>
                            )
                        ) : (
                            <div className="space-y-3">
                                <div className="rounded-xl border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                                    <p className="font-medium text-foreground text-sm">How to accept this invite:</p>
                                    <ol className="list-decimal list-inside space-y-1">
                                        <li>
                                            Create a CareSync account using{" "}
                                            <strong>{invitation.invited_email}</strong>
                                        </li>
                                        <li>Return to this link and click Accept</li>
                                    </ol>
                                    <p className="mt-1">Already have an account? Just sign in below.</p>
                                </div>
                                <ActionButton
                                    type="button"
                                    className="w-full"
                                    onClick={() =>
                                        navigate({
                                            to: "/login",
                                            search: { redirect: inviteRedirect },
                                        })
                                    }
                                >
                                    Sign In / Create Account
                                </ActionButton>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </main>
    );
}
