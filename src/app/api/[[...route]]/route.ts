import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from "hono/cors";
import { notFound, onError } from "stoker/middlewares";
import { logger } from 'hono/logger'
import mediaLibrary from '@/modules/media-library/server/route';

const app = new Hono()
  .basePath("/api")
  .use("*", cors())
  .use(logger())
  .notFound(notFound)
  .onError(onError);

export const routes = app
  .route("/media", mediaLibrary)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)