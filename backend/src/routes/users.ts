import { Hono } from 'hono';
import { z } from 'zod';
import { AppDataSource } from '../config/database';
import { Dream } from '../entities/Dream';
import { Follow } from '../entities/Follow';
import { User } from '../entities/User';
import { auth } from '../middleware/auth';
import { updateProfileSchema } from '../schema/user';

const users = new Hono();

// ユーザープロフィールを取得
users.get('/:username', async c => {
  try {
    const username = c.req.param('username');
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { username },
      relations: ['dreams', 'followers', 'following']
    });

    if (!user) {
      return c.json({ error: 'ユーザーが見つかりません' }, 404);
    }

    return c.json({
      user: {
        id: user.id,
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
    console.error('Get user error:', error);
    return c.json({ error: 'ユーザー情報の取得中にエラーが発生しました' }, 500);
  }
});

// ユーザーの夢一覧を取得
users.get('/:username/dreams', async c => {
  try {
    const username = c.req.param('username');
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { username }
    });

    if (!user) {
      return c.json({ error: 'ユーザーが見つかりません' }, 404);
    }

    const dreamRepository = AppDataSource.getRepository(Dream);
    const dreams = await dreamRepository.find({
      where: {
        user: { id: user.id },
        isPublic: true
      },
      relations: ['user', 'tags', 'likes', 'comments'],
      order: { createdAt: 'DESC' }
    });

    return c.json({
      dreams: dreams.map(dream => ({
        ...dream,
        user: {
          id: dream.user.id,
          username: dream.user.username,
          displayName: dream.user.displayName,
          avatarUrl: dream.user.avatarUrl
        },
        tags: dream.tags.map(tag => ({ name: tag.name })),
        _count: {
          likes: dream.likes.length,
          comments: dream.comments.length
        }
      }))
    });
  } catch (error) {
    console.error('Get user dreams error:', error);
    return c.json({ error: 'ユーザーの夢の取得中にエラーが発生しました' }, 500);
  }
});

// プロフィールを更新
users.put('/profile', auth(), async c => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const input = updateProfileSchema.parse(body);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return c.json({ error: 'ユーザーが見つかりません' }, 404);
    }

    user.displayName = input.displayName;
    user.bio = input.bio;
    user.avatarUrl = input.avatarUrl;

    await userRepository.save(user);

    return c.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: '入力内容が正しくありません' }, 400);
    }
    console.error('Update profile error:', error);
    return c.json({ error: 'プロフィールの更新中にエラーが発生しました' }, 500);
  }
});

// フォローする/解除する
users.post('/:username/follow', auth(), async c => {
  try {
    const currentUserId = c.get('userId');
    const username = c.req.param('username');

    const userRepository = AppDataSource.getRepository(User);
    const followRepository = AppDataSource.getRepository(Follow);

    const targetUser = await userRepository.findOne({
      where: { username }
    });

    if (!targetUser) {
      return c.json({ error: 'ユーザーが見つかりません' }, 404);
    }

    if (targetUser.id === currentUserId) {
      return c.json({ error: '自分自身をフォローすることはできません' }, 400);
    }

    const existingFollow = await followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: targetUser.id
      }
    });

    if (existingFollow) {
      await followRepository.remove(existingFollow);
      return c.json({ message: 'フォローを解除しました' });
    } else {
      const follow = followRepository.create({
        followerId: currentUserId,
        followingId: targetUser.id
      });
      await followRepository.save(follow);
      return c.json({ message: 'フォローしました' });
    }
  } catch (error) {
    console.error('Follow user error:', error);
    return c.json({ error: 'フォロー処理中にエラーが発生しました' }, 500);
  }
});

// フォロワー一覧を取得
users.get('/:username/followers', async c => {
  try {
    const username = c.req.param('username');
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { username },
      relations: ['followers', 'followers.follower']
    });

    if (!user) {
      return c.json({ error: 'ユーザーが見つかりません' }, 404);
    }

    const followers = user.followers.map(f => ({
      id: f.follower.id,
      username: f.follower.username,
      displayName: f.follower.displayName,
      avatarUrl: f.follower.avatarUrl
    }));

    return c.json({ followers });
  } catch (error) {
    console.error('Get followers error:', error);
    return c.json({ error: 'フォロワー一覧の取得中にエラーが発生しました' }, 500);
  }
});

// フォロー中一覧を取得
users.get('/:username/following', async c => {
  try {
    const username = c.req.param('username');
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { username },
      relations: ['following', 'following.following']
    });

    if (!user) {
      return c.json({ error: 'ユーザーが見つかりません' }, 404);
    }

    const following = user.following.map(f => ({
      id: f.following.id,
      username: f.following.username,
      displayName: f.following.displayName,
      avatarUrl: f.following.avatarUrl
    }));

    return c.json({ following });
  } catch (error) {
    console.error('Get following error:', error);
    return c.json({ error: 'フォロー中一覧の取得中にエラーが発生しました' }, 500);
  }
});

export default users;
