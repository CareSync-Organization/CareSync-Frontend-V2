import type {
  AgentPermissions,
  PermissionLevel,
  UserStatus,
} from "../types/users.types";

export const statusConfig = {
  active: { label: "Active", className: "bg-emerald-500/10 text-emerald-500" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-500" },
} satisfies Record<UserStatus, { label: string; className: string }>;

export const defaultPermissions: AgentPermissions = {
  inventory: "none",
  conversations: "read",
  knowledgeBase: "none",
  analytics: "none",
  connectors: "none",
};

export type PermissionConfig = {
  key: keyof AgentPermissions;
  label: string;
  description: string;
  options: Array<{ value: PermissionLevel; label: string }>;
};

export const permissionConfigs: PermissionConfig[] = [
  {
    key: "conversations",
    label: "Conversations",
    description: "Customer conversation management",
    options: [
      { value: "none", label: "None" },
      { value: "read", label: "Read" },
      { value: "write", label: "Read & Write" },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    description: "Product and stock management",
    options: [
      { value: "none", label: "None" },
      { value: "read", label: "Read" },
      { value: "write", label: "Read & Write" },
    ],
  },
  {
    key: "knowledgeBase",
    label: "Knowledge Base",
    description: "AI training documents",
    options: [
      { value: "none", label: "None" },
      { value: "read", label: "Read" },
      { value: "write", label: "Add Docs" },
    ],
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "Reports and performance metrics",
    options: [
      { value: "none", label: "None" },
      { value: "read", label: "View" },
    ],
  },
  {
    key: "connectors",
    label: "Connectors",
    description: "Sales channel integrations",
    options: [
      { value: "none", label: "None" },
      { value: "read", label: "View" },
      { value: "write", label: "Manage" },
    ],
  },
];
