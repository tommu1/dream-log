import { Hono } from 'hono';
import { AppDataSource } from '../config/database';
import { Dream } from '../entities/Dream';
import { Tag } from '../entities/Tag';

const tags = new Hono();

// 人気のタグを取得
tags.get('/popular', async c => {
  try {
    const tagRepository = AppDataSource.getRepository(Tag);
    const queryBuilder = tagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.dreams', 'dream')
      .select(['tag.name'])
      .addSelect('COUNT(dream.id)', 'dreamCount')
      .groupBy('tag.id')
      .orderBy('dreamCount', 'DESC')
      .limit(10);

    const tags = await queryBuilder.getRawMany();

    return c.json({
      tags: tags.map(tag => ({
        name: tag.tag_name,
        _count: {
          dreams: parseInt(tag.dreamCount)
        }
      }))
    });
  } catch (error) {
    console.error('Get popular tags error:', error);
    return c.json({ error: 'タグの取得中にエラーが発生しました' }, 500);
  }
});

// タグに関連する夢を取得
tags.get('/:name/dreams', async c => {
  try {
    const name = c.req.param('name');
    const dreamRepository = AppDataSource.getRepository(Dream);
    const dreams = await dreamRepository.find({
      where: {
        isPublic: true,
        tags: {
          name
        }
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
    console.error('Get tag dreams error:', error);
    return c.json({ error: 'タグに関連する夢の取得中にエラーが発生しました' }, 500);
  }
});

export default tags;
