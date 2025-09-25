import {z} from "zod";

/** Categories */
export const categorySchema = z.object({
    id: z.string(),
    name: z.string(),
    state: z.boolean()
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryFormData = Pick<Category, "name" | "state">;

/** Products */
export const productSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    squareImageUrl: z.string().url().optional(),
    rectangularImageUrl: z.string().url().optional(),
    smallSquareImageUrl: z.string().url().optional(),
    redeem: z.string(),
    termsConditions: z.string(),
    purchaseCost: z.union([z.number(), z.string().transform(val => parseFloat(val))]),
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
        squareImageUrl: true,
        rectangularImageUrl: true,
        smallSquareImageUrl: true,
        redeem: true,
        termsConditions: true,
        purchaseCost: true,
        state: true,
        category: true
    })
)

export type Product = z.infer<typeof productSchema>;
export type ProductFormData = Pick<Product, "title" | "description" | "squareImageUrl" | "rectangularImageUrl" | "smallSquareImageUrl" | "redeem" | "termsConditions" | "purchaseCost" | "state"> & {
    categoryId: string;
    tempPrices?: any[]; // Precios temporales para modo creación
};

/** Chat Support */
export const chatMessageSchema = z.object({
    id: z.string(),
    message: z.string(),
    sender: z.enum(['user', 'support']),
    timestamp: z.string(),
    isRead: z.boolean()
});

export const chatSessionSchema = z.object({
    id: z.string(),
    userId: z.string(),
    status: z.enum(['active', 'closed', 'pending']),
    createdAt: z.string(),
    lastMessageAt: z.string(),
    messages: z.array(chatMessageSchema),
    supportAgentId: z.string().optional(),
    supportAgent: z.object({
        id: z.string(),
        userId: z.string(),
        name: z.string().optional(),
        email: z.string()
    }).optional()
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatSession = z.infer<typeof chatSessionSchema>;
export type ChatMessageFormData = Pick<ChatMessage, "message">;

// Re-export Google Auth types
export * from './google-auth';