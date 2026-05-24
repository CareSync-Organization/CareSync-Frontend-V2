import { z } from "zod";

const permissionLevelSchema = z.enum(["none", "read", "write"]);

export const inviteUserSchema = z.object({
  email: z.email("Please enter a valid email address"),
  permissions: z.object({
    inventory: permissionLevelSchema,
    conversations: permissionLevelSchema,
    knowledgeBase: permissionLevelSchema,
    analytics: permissionLevelSchema,
    connectors: permissionLevelSchema,
  }),
});

export type InviteUserValues = z.infer<typeof inviteUserSchema>;
