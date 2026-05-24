export type UserStatus = "active" | "pending";
export type PermissionLevel = "none" | "read" | "write";

export type AgentPermissions = {
  inventory: PermissionLevel;
  conversations: PermissionLevel;
  knowledgeBase: PermissionLevel;
  analytics: PermissionLevel;
  connectors: PermissionLevel;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agent";
  status: UserStatus;
  lastActive: string | null;
  permissions?: AgentPermissions;
};
