import { hc } from 'hono/client' 
import { ApiTypes } from './api-types';

export const rpcClient = hc<ApiTypes>(process.env.NEXT_PUBLIC_APP_URL!);