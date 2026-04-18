import { z } from "zod"

export const forgotPassSchema = z.object({
  email: z.email("Enter a valid email address"),
})

export type ForgotPassFormValues = z.infer<typeof forgotPassSchema>
