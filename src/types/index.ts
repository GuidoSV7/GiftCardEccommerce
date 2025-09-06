import {z} from "zod";

/** Categories */
export const categorySchema = z.object({
    id: z.number(),
    name: z.string()
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryFormData = Pick<Category, "name">;

/** Products */
export const productSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    redeem: z.string(),
    termsConditions: z.string(),
    state: z.boolean(),
    category: z.object({
        id: z.string(),
        name: z.string()
    })
});

export const dashboardProductSchema = z.array(
    productSchema.pick({
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        redeem: true,
        termsConditions: true,
        state: true,
        category: true
    })
)

export type Product = z.infer<typeof productSchema>;
export type ProductFormData = Pick<Product, "title" | "description" | "imageUrl" | "redeem" | "termsConditions" | "state"> & {
    categoryId: number;
};
