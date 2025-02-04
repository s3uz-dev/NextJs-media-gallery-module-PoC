 
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client'; 
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '../envs';
 
const config = { url: TURSO_DATABASE_URL!, authToken: TURSO_AUTH_TOKEN! }

export const client = createClient({ ...config });
export const db = drizzle({ client });