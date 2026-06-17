import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getMe, logout, signin, signup} from "./auth.api";
import { mapUserDto } from "./auth.mapper"

export function useMe() {
    return useQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: async () => mapUserDto(await getMe()),
        retry: false,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60
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
            queryClient.clear();
        },
    });
}