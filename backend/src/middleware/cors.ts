import { Context, Next } from 'hono';

export const cors = () => async (c: Context, next: Next) => {
  c.res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.res.headers.set('Access-Control-Allow-Credentials', 'true');

  if (c.req.method === 'OPTIONS') {
    return c.json(null, 204);
  }

  await next();
};
