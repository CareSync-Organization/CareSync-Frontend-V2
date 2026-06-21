import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";

import { createStore, deleteStore, getStores, updateStore } from "./stores.api";
import { mapStoreDto } from "./stores.mapper";
import type { Store, UpdateStoreInput } from "../types/stores.types";

export function useStores() {
  return useQuery({
    queryKey: queryKeys.stores.list(),
    queryFn: async () => {
      const dtos = await getStores();
      return dtos.map(mapStoreDto);
    },
    staleTime: Infinity
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  const setActiveStoreId = useActiveStoreStore((state) => state.setActiveStoreId);

  return useMutation({
    mutationFn: (name: string) => createStore(name.trim()),

    onSuccess: (dto) => {
      const createdStore = mapStoreDto(dto);

      queryClient.setQueryData<Store[]>(
        queryKeys.stores.list(),
        (oldStores = []) => [createdStore, ...oldStores],
      );

      setActiveStoreId(createdStore.id);
      toast.success(`Store "${createdStore.name}" created successfully`);
    },

    onError: () => {
      toast.error("Failed to create store. Please try again.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.list() });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (input: UpdateStoreInput) => 
      updateStore({
        storeId: input.storeId, 
        name: input.name.trim()}),
    onMutate: async ({storeId, name}) => {
      await queryClient.cancelQueries({queryKey: queryKeys.stores.list()});
      const previousStores = queryClient.getQueryData<Store[]>(queryKeys.stores.list()) ?? [];
      queryClient.setQueryData<Store[]>(
        queryKeys.stores.list(),
        previousStores?.map((store) => store.id === storeId ? {...store, name: name.trim()} : store)
      );
      return { previousStores }
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(queryKeys.stores.list(), context.previousStores)
      }
      toast.error("Failed to rename store. Please try again.")
    },
    onSuccess: (dto) => {
      const updatedStore = mapStoreDto(dto);
      toast.success(`Store renamed to "${updatedStore.name}"`);
    },
    onSettled: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.stores.list()})
    }
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  const setActiveStoreId = useActiveStoreStore((state) => state.setActiveStoreId);

  return useMutation({
    mutationFn: (storeId: string) => deleteStore(storeId),

    onMutate: async (deletedStoreId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.stores.list() });

      const previousStores =
        queryClient.getQueryData<Store[]>(queryKeys.stores.list()) ?? [];

      const previousActiveStoreId = useActiveStoreStore.getState().activeStoreId;

      const nextStores = previousStores.filter(
        (store) => store.id !== deletedStoreId,
      );

      queryClient.setQueryData<Store[]>(queryKeys.stores.list(), nextStores);

      if (previousActiveStoreId === deletedStoreId) {
        setActiveStoreId(nextStores[0]?.id ?? null);
      }

      return {
        previousStores,
        previousActiveStoreId,
      };
    },

    onError: (_error, _deletedStoreId, context) => {
      if (context) {
        queryClient.setQueryData(
          queryKeys.stores.list(),
          context.previousStores,
        );

        setActiveStoreId(context.previousActiveStoreId);
      }

      toast.error("Failed to delete store. Please try again.");
    },

    onSuccess: () => {
      toast.success("Store deleted successfully.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.list() });
    },
  });
}