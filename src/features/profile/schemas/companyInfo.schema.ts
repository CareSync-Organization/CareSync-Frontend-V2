import { z } from "zod";

export const companyInfoSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  sector: z.string().min(2, "Sector is required"),
  companyEmail: z.email("Enter a valid email address"),
  contactNumber: z.string().min(5, "Enter a valid contact number"),
  companyAddress: z.string().optional(),
});

export type CompanyInfoValues = z.infer<typeof companyInfoSchema>;