import { z } from "zod";

export const resetPassSchema = z.object({
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[a-z]/, "Must include a lowercase letter")
        .regex(/[0-9]/, "Must include a number")
        .regex(/[^A-Za-z0-9]/, "Must include a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
});

export type ResetPassFormValues = z.infer<typeof resetPassSchema>;
