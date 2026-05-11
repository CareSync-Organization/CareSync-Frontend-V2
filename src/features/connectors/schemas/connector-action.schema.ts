import { z } from "zod";

export const connectorActionSchema = z.object({
    accountId: z
        .string()
        .min(2, "Account identifier must be at least 2 characters"),
    apiKey: z.string().min(6, "API key or access token is required"),
    webhookUrl: z
        .url("Enter a valid webhook URL")
        .optional()
        .or(z.literal("")),
});

export type ConnectorActionFormValues = z.infer<
    typeof connectorActionSchema
>;