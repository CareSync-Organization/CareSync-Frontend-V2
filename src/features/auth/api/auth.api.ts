import { api } from "@/lib/api"
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
        body: JSON.stringify(input)
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