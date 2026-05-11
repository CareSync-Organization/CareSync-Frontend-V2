import { z } from "zod";

export const requestIntegrationSchema = z.object({
    platformName: z
        .string()
        .min(2, "Platform name must be at least 2 characters"),
    useCase: z
        .string()
        .min(10, "Tell us a little more about the integration use case"),
    contactEmail: z.email("Enter a valid contact email"),
});

export type RequestIntegrationFormValues = z.infer<
    typeof requestIntegrationSchema
>;