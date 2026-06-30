import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getMe, logout, signin, signup, updateMe, forgotPassword, resetPassword, uploadAvatar, changePassword } from "./auth.api";
import { mapUserDto } from "./auth.mapper";
import { toast } from "sonner";
import type { User } from "../types/auth.types";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => mapUserDto(await getMe()),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}


export function useSignin() {
    const queryClient = useQueryClient();

    return useMutation( {
        mutationFn: signin,
        onSuccess: (userDto) => {
            queryClient.setQueryData(queryKeys.auth.me(), mapUserDto(userDto));
        },
    }
    )
}

export function useSignup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: signup,
        onSuccess: (userDto) => {
            queryClient.setQueryData(queryKeys.auth.me(), mapUserDto(userDto))
        }
    })
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear(); // should be onSettled if I want the user to just logout instantly and redirect
        },
    });
}

export function useUpdateMe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMe,
        onSuccess: (userDto) => {
            const updatedUser = mapUserDto(userDto);
            queryClient.setQueryData(queryKeys.auth.me(), updatedUser);
            toast.success("Profile updated successfully");
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to update profile");
        }
    });
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: forgotPassword,
    });
}

export function useResetPassword() {
    return useMutation({
        mutationFn: resetPassword,
    });
}

export function useUploadAvatar() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadAvatar,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.auth.me(), (old: User | undefined) =>
                old ? { ...old, profilePic: data.profile_pic } : old
            );
            toast.success("Profile picture updated");
        },
        onError: () => {
            toast.error("Failed to upload avatar. Please try again.");
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: changePassword,
    });
}