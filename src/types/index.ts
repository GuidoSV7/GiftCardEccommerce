import {z} from "zod";

/** Gifcards / */
export const gifcardSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    price: z.number().min(0),
    imageUrl: z.string().url(),
    state: z.boolean()
});

export type Gifcard = z.infer<typeof gifcardSchema>;
export type GifcardFormData = Pick<Gifcard, "price" | "title" | "description" | "imageUrl" | "state">;
