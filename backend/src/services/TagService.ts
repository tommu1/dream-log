import { AppDataSource } from '../config/database';
import { Tag } from '../entities/Tag';

export class TagService {
  private tagRepository = AppDataSource.getRepository(Tag);

  async findPopular() {
    return this.tagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.dreams', 'dream')
      .select(['tag.name', 'COUNT(dream.id) as count'])
      .groupBy('tag.id')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async findByName(name: string) {
    return this.tagRepository.findOne({
      where: { name },
      relations: ['dreams', 'dreams.user']
    });
  }

  async findOrCreate(name: string) {
    let tag = await this.tagRepository.findOne({ where: { name } });
    if (!tag) {
      tag = this.tagRepository.create({ name });
      await this.tagRepository.save(tag);
    }
    return tag;
  }
}
