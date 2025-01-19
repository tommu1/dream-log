import bcrypt from 'bcryptjs';
import { Hono } from 'hono';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { auth } from '../middleware/auth';
import { loginSchema, registerSchema } from '../schema/auth';

const auth_routes = new Hono();

auth_routes.post('/login', async c => {
  try {
    const body = await c.req.json();
    const input = loginSchema.parse(body);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email: input.email }
    });

    if (!user) {
      return c.json({ error: 'メールアドレスまたはパスワードが正しくありません' }, 401);
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);
    if (!isValidPassword) {
      return c.json({ error: 'メールアドレスまたはパスワードが正しくありません' }, 401);
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: '入力内容が正しくありません' }, 400);
    }
    console.error('Login error:', error);
    return c.json({ error: 'ログイン中にエラーが発生しました' }, 500);
  }
});

auth_routes.post('/register', async c => {
  try {
    const body = await c.req.json();
    const input = registerSchema.parse(body);

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({
      where: [{ email: input.email }, { username: input.username }]
    });

    if (existingUser) {
      return c.json({ error: 'このメールアドレスまたはユーザー名は既に使用されています' }, 400);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = userRepository.create({
      email: input.email,
      username: input.username,
      password: hashedPassword,
      displayName: input.displayName || input.username
    });

    await userRepository.save(user);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: '入力内容が正しくありません' }, 400);
    }
    console.error('Register error:', error);
    return c.json({ error: '登録中にエラーが発生しました' }, 500);
  }
});

auth_routes.get('/me', auth(), async c => {
  const userId = c.get('userId');

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['dreams', 'followers', 'following']
    });

    if (!user) {
      return c.json({ error: 'ユーザーが見つかりません' }, 404);
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        dreamCount: user.dreams.length,
        followerCount: user.followers.length,
        followingCount: user.following.length
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    return c.json({ error: 'ユーザー情報の取得中にエラーが発生しました' }, 500);
  }
});

export default auth_routes;
