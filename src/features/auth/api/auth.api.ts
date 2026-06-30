import { api, apiFormData } from "@/lib/api"
import type { SignupInput, SigninInput, UserDto } from "../types/auth.types"


export async function signup(input: SignupInput) {
    return api<UserDto>("/api/auth/signup/", {
        method: "POST",
        body: JSON.stringify({
            name: input.name,
            email: input.email,
            password: input.password,
            password_confirm: input.passwordConfirm,
        }),
    });
}

export async function signin(input: SigninInput) {
    return api<UserDto>("/api/auth/signin/", {
        method: "POST",
        body: JSON.stringify(input),
    })
}

export async function getMe() {
    return api<UserDto>("/api/auth/me/");
}

export async function updateMe(input: { name?: string; email?: string; profile_pic?: string }) {
    return api<UserDto>("/api/auth/me/", {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}

export async function logout() {
    return api<{detail: string}>("/api/auth/logout/", {
        method: "POST"
    });
}

export async function forgotPassword(email: string) {
    return api<{ detail: string }>("/api/auth/forgot-password/", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function resetPassword(input: {
    token: string;
    new_password: string;
    confirm_password: string;
}) {
    return api<{ detail: string }>("/api/auth/reset-password/", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export async function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return apiFormData<{ profile_pic: string }>("/api/auth/me/avatar/", formData);
}

export async function changePassword(input: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) {
    return api<{ detail: string }>("/api/auth/change-password/", {
        method: "POST",
        body: JSON.stringify({
            current_password: input.currentPassword,
            new_password: input.newPassword,
            confirm_password: input.confirmPassword,
        }),
    });
}