import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";

import {
  getStoreAISettings,
  updateStoreAISettings,
} from "../api/ai-config.api";
import { mapStoreAISettingsDto } from "../mappers/ai-config.mapper";
import type {
  StoreAISettings,
  UpdateStoreAISettingsInput,
} from "../../types/ai-config.types";

export function useStoreAISettings(storeId: string | null) {
  return useQuery({
    queryKey: storeId
      ? queryKeys.stores.aiSettings(storeId)
      : queryKeys.stores.aiSettings("missing-store"),
    queryFn: async () => {
      if (!storeId) return null;
      return mapStoreAISettingsDto(await getStoreAISettings(storeId));
    },
    enabled: Boolean(storeId),
  });
}

export function useUpdateStoreAISettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStoreAISettingsInput) =>
      updateStoreAISettings(input),

    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.stores.aiSettings(input.storeId),
      });

      const previousSettings =
        queryClient.getQueryData<StoreAISettings>(
          queryKeys.stores.aiSettings(input.storeId),
        ) ?? null;

      queryClient.setQueryData<StoreAISettings>(
        queryKeys.stores.aiSettings(input.storeId),
        (oldSettings) => ({
          storeId: input.storeId,
          createdAt: oldSettings?.createdAt ?? "",
          updatedAt: oldSettings?.updatedAt ?? "",
          autoReplyEnabled: input.autoReplyEnabled,
          confidenceThreshold: input.confidenceThreshold,
          autoEscalateEnabled: input.autoEscalateEnabled,
          aiTone: input.aiTone,
        }),
      );

      return { previousSettings };
    },

    onError: (error, input, context) => {
      queryClient.setQueryData(
        queryKeys.stores.aiSettings(input.storeId),
        context?.previousSettings ?? null,
      );

      toast.error(
        error instanceof Error ? error.message : "Could not update AI settings",
      );
    },

    onSuccess: (dto) => {
      const settings = mapStoreAISettingsDto(dto);

      queryClient.setQueryData(
        queryKeys.stores.aiSettings(settings.storeId),
        settings,
      );

      toast.success("AI settings updated");
    },
  });
}