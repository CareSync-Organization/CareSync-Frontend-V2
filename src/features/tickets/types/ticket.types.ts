export type TicketStatus =
  | "pending"
  | "processing"
  | "approved"
  | "denied"
  | "completed_externally"
  | "failed";

export type TicketActionType =
  | "cancel_order"
  | "create_refund"
  | "refund_order"
  | "update_fulfillment"
  | "update_inventory";

export type TicketChannel = "whatsapp" | "shopify" | "daraz";

// Raw shape from backend (snake_case)
export type TicketDto = {
  id: string;
  ticket_number: string;
  store: string;
  conversation: string;
  conversation_status: string;
  customer_name: string;
  channel: TicketChannel;
  source_message: string | null;
  acknowledgement_message: string | null;
  customer_update_message: string | null;
  action_type: TicketActionType;
  title: string;
  issue: string;
  payload: Record<string, unknown>;
  is_actionable: boolean;
  missing_action_fields: string[];
  status: TicketStatus;
  result: Record<string, unknown>;
  resolution_note: string;
  error_message: string;
  processing_task_id: string | null;
  processing_started_at: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
};

// Camel-case domain type used in components
export type Ticket = {
  id: string;
  ticketNumber: string;
  store: string;
  conversation: string;
  conversationStatus: string;
  customerName: string;
  channel: TicketChannel;
  actionType: TicketActionType;
  title: string;
  issue: string;
  payload: Record<string, unknown>;
  isActionable: boolean;
  missingActionFields: string[];
  status: TicketStatus;
  result: Record<string, unknown>;
  resolutionNote: string;
  errorMessage: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export function mapTicketDto(dto: TicketDto): Ticket {
  return {
    id: dto.id,
    ticketNumber: dto.ticket_number,
    store: dto.store,
    conversation: dto.conversation,
    conversationStatus: dto.conversation_status,
    customerName: dto.customer_name,
    channel: dto.channel,
    actionType: dto.action_type,
    title: dto.title,
    issue: dto.issue,
    payload: dto.payload,
    isActionable: dto.is_actionable,
    missingActionFields: dto.missing_action_fields,
    status: dto.status,
    result: dto.result,
    resolutionNote: dto.resolution_note,
    errorMessage: dto.error_message,
    resolvedAt: dto.resolved_at,
    resolvedBy: dto.resolved_by,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export const ACTION_LABELS: Record<TicketActionType, string> = {
  cancel_order: "Cancel order",
  create_refund: "Create refund",
  refund_order: "Create refund",
  update_fulfillment: "Update fulfillment tracking",
  update_inventory: "Update inventory",
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  approved: "Approved",
  denied: "Denied",
  completed_externally: "Completed externally",
  failed: "Failed",
};
