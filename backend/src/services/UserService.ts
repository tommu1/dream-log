import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { Follow } from '../entities/Follow';
import { User } from '../entities/User';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private followRepository = AppDataSource.getRepository(Follow);

  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'displayName', 'bio', 'avatarUrl', 'createdAt']
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(data: { username: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      ...data,
      password: hashedPassword
    });
    return this.userRepository.save(user);
  }

  async updateProfile(userId: string, data: { displayName?: string; bio?: string; avatarUrl?: string }) {
    await this.userRepository.update(userId, data);
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async follow(followerId: string, followingUsername: string) {
    const following = await this.findByUsername(followingUsername);
    if (!following) throw new Error('ユーザーが見つかりません');

    const existingFollow = await this.followRepository.findOne({
      where: { followerId, followingId: following.id }
    });

    if (existingFollow) {
      await this.followRepository.remove(existingFollow);
      return { message: 'フォローを解除しました' };
    }

    const follow = this.followRepository.create({
      followerId,
      followingId: following.id
    });
    await this.followRepository.save(follow);
    return { message: 'フォローしました' };
  }

  async getFollowers(username: string) {
    const user = await this.findByUsername(username);
    if (!user) throw new Error('ユーザーが見つかりません');

    return this.followRepository.find({
      where: { followingId: user.id },
      relations: ['follower']
    });
  }

  async getFollowing(username: string) {
    const user = await this.findByUsername(username);
    if (!user) throw new Error('ユーザーが見つかりません');

    return this.followRepository.find({
      where: { followerId: user.id },
      relations: ['following']
    });
  }

  async validatePassword(user: User, password: string) {
    return bcrypt.compare(password, user.password);
  }
}
