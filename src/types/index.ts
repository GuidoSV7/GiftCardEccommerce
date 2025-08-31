import {z} from "zod";

/** Categories */
export const categorySchema = z.object({
    id: z.number(),
    name: z.string()
});

export type Category = z.infer<typeof categorySchema>;

/** Products */
export const productSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    redeem: z.string(),
    termsConditions: z.string(),
    state: z.boolean(),
    categoryId: z.object({
        name: z.string()
    })
});

export type Product = z.infer<typeof productSchema>;
export type ProductFormData = Pick<Product, "title" | "description" | "imageUrl" | "redeem" | "termsConditions" | "state" | "categoryId">;
