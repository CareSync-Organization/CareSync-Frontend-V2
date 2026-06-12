import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getMe, logout, signin, signup, updateMe } from "./auth.api";
import { mapUserDto } from "./auth.mapper";
import { toast } from "sonner";

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
        onSettled: () => {
            queryClient.clear();
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