import { Hono } from "hono";
import { v2 as cloudinary } from 'cloudinary';
import { ErrorResponse, SuccessResponse } from "@/lib/api-types";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "@/lib/envs";
import { zValidator } from "@hono/zod-validator";
import { createMediaSchema, paginationMediaSchema, updateMediaSchema } from "../schema";
import { mediaLibraryTable } from "@/lib/db/schema";
import { db } from "@/lib/db/client";
import { and, eq, sql } from "drizzle-orm";

const app = new Hono()
    .post("/image/upload", async (c) => {
        const formData = await c.req.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
            return c.json<ErrorResponse>({ error: 'No file provided', data: null, success: false, }, 400);
        }
        cloudinary.config({
            cloud_name: CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
        });

        try {
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer);

            const originalName = file.name.replace(/\.[^/.]+$/, "");  
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            const newFileName = `${originalName}-${randomSuffix}`;

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    public_id: newFileName,  
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
                uploadStream.end(fileBuffer);
            });


            return c.json<SuccessResponse>({
                success: true, data: {
                    url: (result as any).secure_url,
                    name: newFileName
                }
            }, 201);
        } catch (error) {
            console.error('/one/:id users error:', error);
            return c.json<ErrorResponse>({ error: 'Internal server error', data: null, success: false, }, 500);
        }
    })

    .get("/all",
        zValidator('query', paginationMediaSchema),
        async (c) => {
            try {
                const { page, limit, search, type } = c.req.valid('query');
                const offset = (page - 1) * limit;

                const query = db
                    .select()
                    .from(mediaLibraryTable)
                    .where(
                        and(
                            search ? sql`LOWER(${mediaLibraryTable.url}) LIKE ${'%' + search.toLowerCase() + '%'}` : undefined,
                            type ? eq(mediaLibraryTable.type, type) : undefined
                        )
                    )
                    .limit(limit)
                    .offset(offset);

                const [media, total] = await Promise.all([
                    query,
                    db.select({ count: sql<number>`count(*)` })
                        .from(mediaLibraryTable)
                        .then(res => res[0].count)
                ]);

                return c.json<SuccessResponse>({
                    success: true,
                    data: {
                        data: media,
                        total,
                        page,
                        limit
                    }
                }, 200);
            } catch (error) {
                console.error('Media library error:', error);
                return c.json<ErrorResponse>({ error: 'Internal server error', data: null, success: false }, 500);
            }
        })

    .get("/:id", async (c) => {
        try {
            const id = Number(c.req.param('id'));
            if (isNaN(id)) return c.json<ErrorResponse>({ success: false, error: 'ID inválido', data: null }, 400);

            const media = await db
                .select()
                .from(mediaLibraryTable)
                .where(eq(mediaLibraryTable.id, id))
                .limit(1);

            if (!media[0]) {
                return c.json<ErrorResponse>({ success: false, error: 'Medio no encontrado', data: null }, 404);
            }

            return c.json<SuccessResponse>({ success: true, data: media[0] }, 200);
        } catch (error) {
            console.error('Media by ID error:', error);
            return c.json<ErrorResponse>({ error: 'Internal server error', data: null, success: false }, 500);
        }
    })

    .post("/create",
        zValidator('json', createMediaSchema),
        async (c) => {
            try {
                const mediaData = c.req.valid('json');

                const [newMedia] = await db
                    .insert(mediaLibraryTable)
                    .values(mediaData)
                    .returning();

                return c.json<SuccessResponse>({ success: true, data: newMedia }, 201);
            } catch (error) {
                console.error('Create media error:', error);
                return c.json<ErrorResponse>({ error: 'Internal server error', data: null, success: false }, 500);
            }
        })

    .put("/:id",
        zValidator('json', updateMediaSchema),
        async (c) => {
            try {
                const id = Number(c.req.param('id'));
                if (isNaN(id)) return c.json<ErrorResponse>({ success: false, error: 'ID inválido', data: null }, 400);

                const updateData = c.req.valid('json');

                const [updatedMedia] = await db
                    .update(mediaLibraryTable)
                    .set(updateData)
                    .where(eq(mediaLibraryTable.id, id))
                    .returning();

                if (!updatedMedia) {
                    return c.json<ErrorResponse>({ success: false, error: 'Medio no encontrado', data: null }, 404);
                }

                return c.json<SuccessResponse>({ success: true, data: updatedMedia }, 200);
            } catch (error) {
                console.error('Update media error:', error);
                return c.json<ErrorResponse>({ error: 'Internal server error', data: null, success: false }, 500);
            }
        })

    .delete("/:id", async (c) => {
        try {
            const id = Number(c.req.param('id'));
            if (isNaN(id)) return c.json<ErrorResponse>({ success: false, error: 'ID inválido', data: null }, 400);

            const [media] = await db
                .select()
                .from(mediaLibraryTable)
                .where(eq(mediaLibraryTable.id, id));

            if (!media) {
                return c.json<ErrorResponse>({ success: false, error: 'Medio no encontrado', data: null }, 404);
            }

            // Eliminar si   es Cloudinary
            if (media.provider === 'cloudinary') {
                cloudinary.config({
                    cloud_name: CLOUDINARY_CLOUD_NAME,
                    api_key: CLOUDINARY_API_KEY,
                    api_secret: CLOUDINARY_API_SECRET,
                });

                // Extraer public_id de la URL
                const regex = /\/upload\/(?:v\d+\/)?(.+?)\.\w+$/;
                const match = media.url.match(regex);

                if (!match) {
                    return c.json<ErrorResponse>({
                        success: false,
                        error: 'Formato de URL de Cloudinary inválido',
                        data: null
                    }, 400);
                }

                const publicId = match[1];

                try {
                    const result = await cloudinary.uploader.destroy(publicId);
                    if (result.result !== 'ok') {
                        throw new Error(result.result);
                    }
                } catch (error) {
                    console.error('Error eliminando de Cloudinary:', error);
                    return c.json<ErrorResponse>({
                        success: false,
                        error: 'Error eliminando el archivo de Cloudinary: ' + (error as any).message,
                        data: null
                    }, 500);
                }
            }

            const [deletedMedia] = await db
                .delete(mediaLibraryTable)
                .where(eq(mediaLibraryTable.id, id))
                .returning();

            if (!deletedMedia) {
                return c.json<ErrorResponse>({ success: false, error: 'Medio no encontrado', data: null }, 404);
            }

            return c.json<SuccessResponse>({ success: true, data: null }, 200);
        } catch (error) {
            console.error('Delete media error:', error);
            return c.json<ErrorResponse>({ error: 'Internal server error', data: null, success: false }, 500);
        }
    })

export default app;
