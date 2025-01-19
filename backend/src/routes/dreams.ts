import { Hono } from 'hono';
import { z } from 'zod';
import { AppDataSource } from '../config/database';
import { Comment } from '../entities/Comment';
import { Dream } from '../entities/Dream';
import { Like } from '../entities/Like';
import { Tag } from '../entities/Tag';
import { User } from '../entities/User';
import { auth } from '../middleware/auth';
import { createDreamSchema, searchQuerySchema, updateDreamSchema } from '../schema/dream';

const dreams = new Hono();

// 夢の一覧を取得
dreams.get('/', async c => {
  try {
    const dreamRepository = AppDataSource.getRepository(Dream);
    const dreams = await dreamRepository.find({
      where: { isPublic: true },
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
    console.error('Get dreams error:', error);
    return c.json({ error: '夢の取得中にエラーが発生しました' }, 500);
  }
});

// 夢を検索
dreams.get('/search', async c => {
  try {
    const query = searchQuerySchema.parse({
      q: c.req.query('q'),
      tag: c.req.query('tag'),
      sort: c.req.query('sort')
    });

    const dreamRepository = AppDataSource.getRepository(Dream);
    const queryBuilder = dreamRepository
      .createQueryBuilder('dream')
      .leftJoinAndSelect('dream.user', 'user')
      .leftJoinAndSelect('dream.tags', 'tags')
      .leftJoinAndSelect('dream.likes', 'likes')
      .leftJoinAndSelect('dream.comments', 'comments')
      .where('dream.isPublic = :isPublic', { isPublic: true });

    if (query.q) {
      queryBuilder.andWhere('(dream.title LIKE :query OR dream.content LIKE :query)', {
        query: `%${query.q}%`
      });
    }

    if (query.tag) {
      queryBuilder.andWhere('tags.name = :tagName', { tagName: query.tag });
    }

    switch (query.sort) {
      case 'oldest':
        queryBuilder.orderBy('dream.createdAt', 'ASC');
        break;
      case 'likes':
        queryBuilder.orderBy('COUNT(likes.id)', 'DESC');
        break;
      case 'comments':
        queryBuilder.orderBy('COUNT(comments.id)', 'DESC');
        break;
      default:
        queryBuilder.orderBy('dream.createdAt', 'DESC');
    }

    const dreams = await queryBuilder.getMany();

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
    if (error instanceof z.ZodError) {
      return c.json({ error: '無効なクエリパラメータです' }, 400);
    }
    console.error('Search error:', error);
    return c.json({ error: '検索中にエラーが発生しました' }, 500);
  }
});

// 夢を作成
dreams.post('/', auth(), async c => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const input = createDreamSchema.parse(body);

    const dreamRepository = AppDataSource.getRepository(Dream);
    const tagRepository = AppDataSource.getRepository(Tag);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return c.json({ error: 'ユーザーが見つかりません' }, 404);
    }

    const tags = await Promise.all(
      (input.tags || []).map(async tagName => {
        let tag = await tagRepository.findOneBy({ name: tagName });
        if (!tag) {
          tag = tagRepository.create({ name: tagName });
          await tagRepository.save(tag);
        }
        return tag;
      })
    );

    const dream = dreamRepository.create({
      title: input.title,
      content: input.content,
      isPublic: input.isPublic,
      user,
      tags
    });

    await dreamRepository.save(dream);

    const savedDream = await dreamRepository.findOne({
      where: { id: dream.id },
      relations: ['user', 'tags', 'likes', 'comments']
    });

    return c.json({
      dream: {
        ...savedDream,
        user: {
          id: savedDream.user.id,
          username: savedDream.user.username,
          displayName: savedDream.user.displayName,
          avatarUrl: savedDream.user.avatarUrl
        },
        tags: savedDream.tags.map(tag => ({ name: tag.name })),
        _count: {
          likes: savedDream.likes.length,
          comments: savedDream.comments.length
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: '入力内容が正しくありません' }, 400);
    }
    console.error('Create dream error:', error);
    return c.json({ error: '夢の作成中にエラーが発生しました' }, 500);
  }
});

// 夢を取得
dreams.get('/:id', async c => {
  try {
    const id = c.req.param('id');
    const dreamRepository = AppDataSource.getRepository(Dream);
    const dream = await dreamRepository.findOne({
      where: { id },
      relations: ['user', 'tags', 'comments', 'comments.user', 'likes']
    });

    if (!dream) {
      return c.json({ error: '夢が見つかりません' }, 404);
    }

    if (!dream.isPublic) {
      const userId = c.get('userId');
      if (!userId || dream.user.id !== userId) {
        return c.json({ error: 'この夢にアクセスする権限がありません' }, 403);
      }
    }

    return c.json({
      dream: {
        ...dream,
        user: {
          id: dream.user.id,
          username: dream.user.username,
          displayName: dream.user.displayName,
          avatarUrl: dream.user.avatarUrl
        },
        tags: dream.tags.map(tag => ({ name: tag.name })),
        comments: dream.comments.map(comment => ({
          ...comment,
          user: {
            id: comment.user.id,
            username: comment.user.username,
            displayName: comment.user.displayName,
            avatarUrl: comment.user.avatarUrl
          }
        })),
        _count: {
          likes: dream.likes.length,
          comments: dream.comments.length
        }
      }
    });
  } catch (error) {
    console.error('Get dream error:', error);
    return c.json({ error: '夢の取得中にエラーが発生しました' }, 500);
  }
});

// 夢を更新
dreams.put('/:id', auth(), async c => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const body = await c.req.json();
    const input = updateDreamSchema.parse(body);

    const dreamRepository = AppDataSource.getRepository(Dream);
    const tagRepository = AppDataSource.getRepository(Tag);

    const dream = await dreamRepository.findOne({
      where: { id },
      relations: ['user', 'tags']
    });

    if (!dream) {
      return c.json({ error: '夢が見つかりません' }, 404);
    }

    if (dream.user.id !== userId) {
      return c.json({ error: 'この夢を編集する権限がありません' }, 403);
    }

    const tags = await Promise.all(
      (input.tags || []).map(async tagName => {
        let tag = await tagRepository.findOneBy({ name: tagName });
        if (!tag) {
          tag = tagRepository.create({ name: tagName });
          await tagRepository.save(tag);
        }
        return tag;
      })
    );

    dream.title = input.title;
    dream.content = input.content;
    dream.isPublic = input.isPublic;
    dream.tags = tags;

    await dreamRepository.save(dream);

    const updatedDream = await dreamRepository.findOne({
      where: { id },
      relations: ['user', 'tags', 'likes', 'comments']
    });

    return c.json({
      dream: {
        ...updatedDream,
        user: {
          id: updatedDream.user.id,
          username: updatedDream.user.username,
          displayName: updatedDream.user.displayName,
          avatarUrl: updatedDream.user.avatarUrl
        },
        tags: updatedDream.tags.map(tag => ({ name: tag.name })),
        _count: {
          likes: updatedDream.likes.length,
          comments: updatedDream.comments.length
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: '入力内容が正しくありません' }, 400);
    }
    console.error('Update dream error:', error);
    return c.json({ error: '夢の更新中にエラーが発生しました' }, 500);
  }
});

// 夢を削除
dreams.delete('/:id', auth(), async c => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');

    const dreamRepository = AppDataSource.getRepository(Dream);
    const dream = await dreamRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!dream) {
      return c.json({ error: '夢が見つかりません' }, 404);
    }

    if (dream.user.id !== userId) {
      return c.json({ error: 'この夢を削除する権限がありません' }, 403);
    }

    await dreamRepository.remove(dream);

    return c.json({ message: '夢を削除しました' });
  } catch (error) {
    console.error('Delete dream error:', error);
    return c.json({ error: '夢の削除中にエラーが発生しました' }, 500);
  }
});

// いいねを追加/削除
dreams.post('/:id/like', auth(), async c => {
  try {
    const userId = c.get('userId');
    const dreamId = c.req.param('id');

    const dreamRepository = AppDataSource.getRepository(Dream);
    const likeRepository = AppDataSource.getRepository(Like);

    const dream = await dreamRepository.findOne({
      where: { id: dreamId },
      relations: ['likes']
    });

    if (!dream) {
      return c.json({ error: '夢が見つかりません' }, 404);
    }

    const existingLike = dream.likes.find(like => like.userId === userId);

    if (existingLike) {
      await likeRepository.remove(existingLike);
      return c.json({ message: 'いいねを削除しました' });
    } else {
      const newLike = likeRepository.create({
        userId,
        dream
      });
      await likeRepository.save(newLike);
      return c.json({ message: 'いいねを追加しました' });
    }
  } catch (error) {
    console.error('Like dream error:', error);
    return c.json({ error: 'いいねの処理中にエラーが発生しました' }, 500);
  }
});

// コメントを追加
dreams.post('/:id/comments', auth(), async c => {
  try {
    const userId = c.get('userId');
    const dreamId = c.req.param('id');
    const { content } = await c.req.json();

    if (!content || typeof content !== 'string' || content.length === 0) {
      return c.json({ error: 'コメント内容は必須です' }, 400);
    }

    const dreamRepository = AppDataSource.getRepository(Dream);
    const commentRepository = AppDataSource.getRepository(Comment);
    const userRepository = AppDataSource.getRepository(User);

    const dream = await dreamRepository.findOne({
      where: { id: dreamId },
      relations: ['comments']
    });

    if (!dream) {
      return c.json({ error: '夢が見つかりません' }, 404);
    }

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return c.json({ error: 'ユーザーが見つかりません' }, 404);
    }

    const comment = commentRepository.create({
      content,
      user,
      dream
    });

    await commentRepository.save(comment);

    return c.json({ comment });
  } catch (error) {
    console.error('Create comment error:', error);
    return c.json({ error: 'コメントの作成中にエラーが発生しました' }, 500);
  }
});

// コメントを取得
dreams.get('/:id/comments', async c => {
  try {
    const dreamId = c.req.param('id');
    const commentRepository = AppDataSource.getRepository(Comment);
    const comments = await commentRepository.find({
      where: { dreamId },
      orderBy: { createdAt: 'DESC' },
      relations: ['user']
    });

    return c.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    return c.json({ error: 'コメントの取得中にエラーが発生しました' }, 500);
  }
});

export default dreams;
