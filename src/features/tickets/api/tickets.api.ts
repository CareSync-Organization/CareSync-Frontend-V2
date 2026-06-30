import { api } from "@/lib/api";
import type { TicketDto } from "../types/ticket.types";

export function getRecentTickets(storeId: string, limit = 10): Promise<TicketDto[]> {
  return api<TicketDto[]>(
    `/api/tickets/recent/?store_id=${encodeURIComponent(storeId)}&limit=${limit}`,
  );
}

export function getTicket(ticketId: string): Promise<TicketDto> {
  return api<TicketDto>(`/api/tickets/${ticketId}/`);
}

export function approveTicket(ticketId: string): Promise<TicketDto> {
  return api<TicketDto>(`/api/tickets/${ticketId}/approve/`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function denyTicket(ticketId: string, reason?: string): Promise<TicketDto> {
  return api<TicketDto>(`/api/tickets/${ticketId}/deny/`, {
    method: "POST",
    body: JSON.stringify({ reason: reason ?? "" }),
  });
}

export function patchTicketPayload(
  ticketId: string,
  payload: Record<string, unknown>,
): Promise<TicketDto> {
  return api<TicketDto>(`/api/tickets/${ticketId}/`, {
    method: "PATCH",
    body: JSON.stringify({ payload }),
  });
}
