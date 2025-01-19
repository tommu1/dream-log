import { AppDataSource } from '../config/database';
import { Comment } from '../entities/Comment';
import { Dream } from '../entities/Dream';
import { Like } from '../entities/Like';
import { Tag } from '../entities/Tag';
import { User } from '../entities/User';

export class DreamService {
  private dreamRepository = AppDataSource.getRepository(Dream);
  private tagRepository = AppDataSource.getRepository(Tag);
  private likeRepository = AppDataSource.getRepository(Like);
  private commentRepository = AppDataSource.getRepository(Comment);

  async findAll() {
    return this.dreamRepository.find({
      where: { isPublic: true },
      relations: ['user', 'tags', 'likes', 'comments'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: string) {
    return this.dreamRepository.findOne({
      where: { id },
      relations: ['user', 'tags', 'likes', 'comments', 'comments.user']
    });
  }

  async findByUser(username: string) {
    const user = await AppDataSource.getRepository(User).findOne({ where: { username } });
    if (!user) throw new Error('ユーザーが見つかりません');

    return this.dreamRepository.find({
      where: { userId: user.id, isPublic: true },
      relations: ['user', 'tags', 'likes', 'comments'],
      order: { createdAt: 'DESC' }
    });
  }

  async create(userId: string, data: { title: string; content: string; tags?: string[]; isPublic?: boolean }) {
    const { tags: tagNames, ...dreamData } = data;
    const dream = this.dreamRepository.create({ ...dreamData, userId });

    if (tagNames && tagNames.length > 0) {
      const tags = await Promise.all(
        tagNames.map(async name => {
          let tag = await this.tagRepository.findOne({ where: { name } });
          if (!tag) {
            tag = this.tagRepository.create({ name });
            await this.tagRepository.save(tag);
          }
          return tag;
        })
      );
      dream.tags = tags;
    }

    return this.dreamRepository.save(dream);
  }

  async update(
    id: string,
    userId: string,
    data: { title?: string; content?: string; tags?: string[]; isPublic?: boolean }
  ) {
    const dream = await this.dreamRepository.findOne({ where: { id, userId } });
    if (!dream) throw new Error('夢が見つかりません');

    if (data.tags) {
      const tags = await Promise.all(
        data.tags.map(async name => {
          let tag = await this.tagRepository.findOne({ where: { name } });
          if (!tag) {
            tag = this.tagRepository.create({ name });
            await this.tagRepository.save(tag);
          }
          return tag;
        })
      );
      dream.tags = tags;
      delete data.tags;
    }

    Object.assign(dream, data);
    return this.dreamRepository.save(dream);
  }

  async delete(id: string, userId: string) {
    const dream = await this.dreamRepository.findOne({ where: { id, userId } });
    if (!dream) throw new Error('夢が見つかりません');
    await this.dreamRepository.remove(dream);
  }

  async toggleLike(dreamId: string, userId: string) {
    const existingLike = await this.likeRepository.findOne({
      where: { dreamId, userId }
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      return { message: 'いいねを解除しました' };
    }

    const like = this.likeRepository.create({ dreamId, userId });
    await this.likeRepository.save(like);
    return { message: 'いいねしました' };
  }

  async addComment(dreamId: string, userId: string, content: string) {
    const comment = this.commentRepository.create({
      dreamId,
      userId,
      content
    });
    return this.commentRepository.save(comment);
  }

  async search(query: { q?: string; tag?: string; sort?: string }) {
    const queryBuilder = this.dreamRepository
      .createQueryBuilder('dream')
      .leftJoinAndSelect('dream.user', 'user')
      .leftJoinAndSelect('dream.tags', 'tag')
      .leftJoinAndSelect('dream.likes', 'like')
      .leftJoinAndSelect('dream.comments', 'comment')
      .where('dream.isPublic = :isPublic', { isPublic: true });

    if (query.q) {
      queryBuilder.andWhere('(dream.title ILIKE :query OR dream.content ILIKE :query)', {
        query: `%${query.q}%`
      });
    }

    if (query.tag) {
      queryBuilder.andWhere('tag.name = :tag', { tag: query.tag });
    }

    switch (query.sort) {
      case 'oldest':
        queryBuilder.orderBy('dream.createdAt', 'ASC');
        break;
      case 'likes':
        queryBuilder.orderBy('COUNT(like.id)', 'DESC');
        break;
      case 'comments':
        queryBuilder.orderBy('COUNT(comment.id)', 'DESC');
        break;
      default:
        queryBuilder.orderBy('dream.createdAt', 'DESC');
    }

    return queryBuilder.getMany();
  }
}
