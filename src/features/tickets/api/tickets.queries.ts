import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import {
  approveTicket,
  denyTicket,
  getRecentTickets,
  getTicket,
  patchTicketPayload,
} from "./tickets.api";
import { mapTicketDto } from "../types/ticket.types";
import type { Ticket } from "../types/ticket.types";

const RECENT_LIMIT = 10;

export function useRecentTickets(storeId: string | null) {
  return useQuery({
    queryKey: queryKeys.tickets.recent(storeId ?? ""),
    queryFn: async () => {
      const dtos = await getRecentTickets(storeId!, RECENT_LIMIT);
      return dtos.map(mapTicketDto);
    },
    enabled: Boolean(storeId),
    staleTime: 0,
  });
}

export function useTicket(ticketId: string | null) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(ticketId ?? ""),
    queryFn: () => getTicket(ticketId!).then(mapTicketDto),
    enabled: Boolean(ticketId),
    staleTime: 0,
  });
}

export function useApproveTicket(storeId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketId: string) => approveTicket(ticketId),
    onSuccess: (dto) => {
      const ticket = mapTicketDto(dto);
      updateTicketCaches(queryClient, ticket, storeId);
      toast.success("Ticket submitted for processing.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not approve ticket.",
      );
    },
  });
}

export function useDenyTicket(storeId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, reason }: { ticketId: string; reason?: string }) =>
      denyTicket(ticketId, reason),
    onSuccess: (dto) => {
      const ticket = mapTicketDto(dto);
      updateTicketCaches(queryClient, ticket, storeId);
      toast.success("Ticket denied.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not deny ticket.",
      );
    },
  });
}

export function usePatchTicketPayload(storeId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      payload,
    }: {
      ticketId: string;
      payload: Record<string, unknown>;
    }) => patchTicketPayload(ticketId, payload),
    onSuccess: (dto) => {
      const ticket = mapTicketDto(dto);
      updateTicketCaches(queryClient, ticket, storeId);
      toast.success("Ticket data updated.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not update ticket data.",
      );
    },
  });
}

export function updateTicketCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  ticket: Ticket,
  storeId: string | null,
) {
  queryClient.setQueryData(queryKeys.tickets.detail(ticket.id), ticket);

  if (storeId) {
    queryClient.setQueryData<Ticket[]>(
      queryKeys.tickets.recent(storeId),
      (old = []) => {
        const exists = old.some((t) => t.id === ticket.id);
        if (exists) return old.map((t) => (t.id === ticket.id ? ticket : t));
        return [ticket, ...old].slice(0, RECENT_LIMIT);
      },
    );
  }
}
