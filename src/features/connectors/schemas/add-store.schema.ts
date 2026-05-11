import { z }  from "zod"

export const addStoreSchema = z.object({
    storeName: z.string().min(2, "Store name must be 2 characters"),
    industry: z.string().min(2, "Industry/Store type must be 2 characters"),
    description: z.string().optional()
})

export type AddStoreFormValues = z.infer<typeof addStoreSchema>