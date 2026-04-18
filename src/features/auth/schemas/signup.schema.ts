import { z } from "zod"


export const signupSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Enter a valid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must be fewer than 72 characters")
        .regex(/[A-Z]/, "Password must include an uppercase letter")
        .regex(/[a-z]/, "Password must include a lowercase letter")
        .regex(/[0-9]/, "Password must include a number")
        .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    confirmPassword: z.string().min(1, "confirm your password"),
    acceptedTerms: z.boolean().refine((value) => value, {
        message: "You must agree to the Terms of Services and Privacy Policy"
    })
})
    .check(
        z.refine((data) => data.password === data.confirmPassword, {
            error: "Passwords don't match",
            path: ["confirmPassword"]
        })
    )

export type SignUpFormValues = z.infer<typeof signupSchema>