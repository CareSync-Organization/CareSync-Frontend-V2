export type NotificationType =
  | "new_conversation"
  | "escalation"
  | "new_message"
  | "connector_failed"
  | "knowledge_doc_processed"
  | "inventory_sync_complete"
  | "action_request_pending"
  | "invitation_received";

export type AppNotification = {
  id: string;
  user: string;
  store: string | null;
  type: NotificationType;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  read: boolean;
  created_at: string;
};

export type NotificationListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AppNotification[];
};
