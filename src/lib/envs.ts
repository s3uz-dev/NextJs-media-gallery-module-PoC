import 'server-only' 
import { get } from 'env-var' 
export const LOG_LEVEL = get('LOG_LEVEL').required().asString();
export const NODE_ENV = get('NODE_ENV').required().asString();
  
export const CLOUDINARY_CLOUD_NAME = get('CLOUDINARY_CLOUD_NAME').required().asString();
export const CLOUDINARY_API_KEY = get('CLOUDINARY_API_KEY').required().asString();
export const CLOUDINARY_API_SECRET = get('CLOUDINARY_API_SECRET').required().asString();

export const TURSO_AUTH_TOKEN = get('TURSO_AUTH_TOKEN').required().asString();
export const TURSO_DATABASE_URL = get('TURSO_DATABASE_URL').required().asString();

 
