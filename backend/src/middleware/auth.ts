import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

export const auth = () => async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    console.log('Auth Header:', authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No Bearer token found');
      return c.json({ error: '認証が必要です' }, 401);
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      console.log('Decoded Token:', decoded);
      c.set('userId', decoded.userId);
      await next();
    } catch (jwtError) {
      console.log('JWT Verification Error:', jwtError);
      return c.json({ error: '無効なトークンです' }, 401);
    }
  } catch (error) {
    console.log('Auth Middleware Error:', error);
    return c.json({ error: '無効なトークンです' }, 401);
  }
};
