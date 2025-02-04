import { z } from "zod";
import { mediaLibraryTable } from "@/lib/db/schema";

// Esquemas Zod
export const createMediaSchema = z.object({
    url: z.string().url(),
    name: z.string({ message: "el nombre es obligatorio" }),
    type: z.enum(['image', 'video']),
    provider: z.string().optional(),
    width: z.number().int().optional(),
    height: z.number().int().optional(),
    duration: z.number().int().optional(),
});

export const updateMediaSchema = createMediaSchema.partial();

export const paginationMediaSchema = z.object({
    page: z.string().transform(Number).pipe(
        z.number().int().positive().default(1)
    ),
    limit: z.string().transform(Number).pipe(
        z.number().int().positive().max(100).default(10)
    ),
    search: z.string().optional(),
    type: z.enum(['image', 'video']).optional(),
});

export type MediaResponse = typeof mediaLibraryTable.$inferSelect;